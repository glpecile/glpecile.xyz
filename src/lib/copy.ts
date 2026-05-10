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
	setLabel(nextLabel: string): void;
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

	button.addEventListener("click", async () => {
		window.clearTimeout(resetTimer);

		if (onBeforeCopy) {
			onBeforeCopy();
		}

		try {
			await copyText(getCopyText());
			setLabel(labels.success);
			setState("success");
		} catch {
			setLabel(labels.error);
			setState("error");
		}

		resetTimer = window.setTimeout(() => {
			setLabel(labels.idle);
			setState();
		}, resetDelay);
	});
}
