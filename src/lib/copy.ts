export type CopyLabels = {
	idle: string;
	success: string;
	error: string;
};

export async function copyText(text: string) {
	if (navigator.clipboard?.writeText) {
		await navigator.clipboard.writeText(text);
		return;
	}

	if (typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
		const blob = new Blob([text], { type: "text/plain" });
		await navigator.clipboard.write([
			new ClipboardItem({
				"text/plain": blob,
			}),
		]);
		return;
	}

	throw new Error("copy unavailable");
}

type AttachCopyStateOptions = {
	button: HTMLButtonElement;
	getCopyText(): string;
	labels: CopyLabels;
	setLabel(nextLabel: string, animate: boolean): void;
	setState(nextState?: "success" | "error"): void;
	onBeforeCopy?(): void;
	resetDelay?: number;
};

export function attachCopyState({
	button,
	getCopyText,
	labels,
	setLabel,
	setState,
	onBeforeCopy,
	resetDelay = 1600,
}: AttachCopyStateOptions) {
	let resetTimer = 0;
	const status = document.createElement("span");
	status.className = "sr-only";
	status.setAttribute("role", "status");
	button.append(status);
	const action = button.getAttribute("aria-label") ?? labels.idle;

	button.addEventListener("click", async (event) => {
		window.clearTimeout(resetTimer);
		const animate = event.detail > 0;
		status.textContent = "";

		if (onBeforeCopy) {
			onBeforeCopy();
		}

		try {
			await copyText(getCopyText());
			setLabel(labels.success, animate);
			status.textContent = labels.success;
			button.setAttribute("aria-label", `${labels.success}: ${action}`);
			setState("success");
		} catch {
			setLabel(labels.error, animate);
			status.textContent = labels.error;
			button.setAttribute("aria-label", `${labels.error}: ${action}`);
			setState("error");
		}

		resetTimer = window.setTimeout(() => {
			setLabel(labels.idle, animate);
			button.setAttribute("aria-label", action);
			setState();
		}, resetDelay);
	});
}
