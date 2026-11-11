import { toast } from "sonner";

/** Shows a pill toast that greets the visitor; a click on the pill dismisses it. */
export const sayHello = () =>
	toast.custom((id) => (
		<button
			type="button"
			title="dismiss"
			onClick={() => toast.dismiss(id)}
			className="bg-card text-foreground focus-visible:ring-ring flex min-h-11 cursor-pointer items-center rounded-full px-4 py-2 text-sm shadow-[0_0_0_1px_hsl(var(--foreground)/0.07),0_4px_12px_hsl(var(--foreground)/0.08)] transition-[scale] duration-150 ease-(--ease-reveal) focus-visible:ring-2 focus-visible:outline-none active:scale-[0.97] motion-reduce:transition-none"
		>
			<span className="transition-opacity duration-200 group-data-[expanded=false]/toast:group-data-[front=false]/toast:opacity-0 motion-reduce:transition-none">
				hello there 👋
			</span>
		</button>
	), {
		// Custom toasts get no width from sonner, so the item shrinks to the pill and
		// sits at the left edge of the toaster. Fill the toaster and center the pill.
		// Sonner only hides the text of stacked toasts it styles itself; the span does it here.
		className: "group/toast flex w-full justify-center",
	});
