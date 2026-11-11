import type * as React from "react";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

// shadcn's sonner without next-themes: the site tokens already follow the
// theme preference on <html>, so the toast colors come from them.
const Toaster = (props: ToasterProps) => (
	<Sonner
		className="toaster group"
		style={
			{
				"--normal-bg": "hsl(var(--popover))",
				"--normal-text": "hsl(var(--popover-foreground))",
				"--normal-border": "hsl(var(--border))",
				"--border-radius": "var(--radius)",
				fontFamily: "inherit",
			} as React.CSSProperties
		}
		{...props}
	/>
);

export { Toaster };
