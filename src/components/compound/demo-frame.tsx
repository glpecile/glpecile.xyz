import type { ReactNode } from "react";

type DemoFrameProps = {
	label: string;
	children: ReactNode;
};

/**
 * Mono caption + bordered viewport, same treatment as the map post's
 * MapFrame, so interactive demos read as siblings of inline code blocks.
 */
export function DemoFrame({ label, children }: DemoFrameProps) {
	return (
		<figure className="border-border my-10 overflow-hidden rounded-md border text-sm">
			<figcaption className="border-border bg-muted/40 text-tone-soft border-b px-3 py-1.5 font-mono text-xs">
				{label}
			</figcaption>
			{children}
		</figure>
	);
}
