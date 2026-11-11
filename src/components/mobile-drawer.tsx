import { useEffect, useState } from "react";
import { Drawer } from "vaul";

import { icons } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { siteConfig } from "#config/site";

type Props = { menu: "nav" | "footer"; currentPath?: string };

export default function MobileDrawer({ menu, currentPath = "/" }: Props) {
	const [open, setOpen] = useState(false);
	const [instant, setInstant] = useState(false);
	const [theme, setTheme] = useState("auto");
	const isNav = menu === "nav";

	useEffect(() => {
		const desktop = window.matchMedia("(min-width: 640px)");
		const closeOnDesktop = () => {
			if (desktop.matches) setOpen(false);
		};
		desktop.addEventListener("change", closeOnDesktop);
		const root = document.documentElement;
		const syncTheme = () => setTheme(root.dataset.themePreference ?? "auto");
		const observer = new MutationObserver(syncTheme);
		observer.observe(root, { attributes: true, attributeFilter: ["data-theme-preference"] });
		syncTheme();
		return () => {
			desktop.removeEventListener("change", closeOnDesktop);
			observer.disconnect();
		};
	}, []);

	return (
		<Drawer.Root open={open} onOpenChange={setOpen} autoFocus shouldScaleBackground={false}>
			<Drawer.Trigger
				aria-label={isNav ? "Open navigation" : "Open footer menu"}
				onClick={(event) => setInstant(event.detail === 0)}
				className="text-tone-mid hover:text-foreground -mr-3 inline-flex size-11 cursor-pointer items-center justify-center sm:hidden"
			>
				{isNav ? (
					<span aria-hidden="true" className="flex w-5 flex-col gap-1.5">
						<span className="h-px w-full bg-current" />
						<span className="h-px w-full bg-current" />
						<span className="h-px w-full bg-current" />
					</span>
				) : <span aria-hidden="true" className="tracking-[-0.2em]">···</span>}
			</Drawer.Trigger>
			<Drawer.Portal>
				<Drawer.Overlay data-mobile-drawer="" data-instant={instant} className="fixed inset-0 z-40 bg-black/40" />
				<Drawer.Content
					data-mobile-drawer=""
					data-instant={instant}
					aria-describedby={undefined}
					onKeyDownCapture={() => setInstant(true)}
					onPointerDownCapture={() => setInstant(false)}
					className="border-border bg-background text-foreground fixed inset-x-0 bottom-0 z-50 flex max-h-[85dvh] flex-col rounded-t-xl border-t outline-none"
				>
					<div className="mx-auto min-h-0 w-full max-w-[42rem] overflow-y-auto overscroll-contain px-6 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
						<div aria-hidden="true" className="bg-border mx-auto mb-3 h-1 w-8 rounded-full" />
						<div className="mb-3 flex items-center justify-between gap-4">
							<Drawer.Title className="text-tone-soft text-sm">{isNav ? "navigation" : "settings"}</Drawer.Title>
							<Drawer.Close aria-label="Close drawer" className="text-tone-soft -mr-2 inline-flex min-h-11 cursor-pointer items-center px-2 text-sm">close</Drawer.Close>
						</div>
						{isNav ? (
							<nav aria-label="Mobile primary">
								<ul className="flex flex-col text-base">
									{siteConfig.shortcuts.nav.map((item) => {
										const active = item.href === "/" ? currentPath === "/" : currentPath === item.href || currentPath.startsWith(`${item.href}/`);
										return (
											<li key={item.href} data-tui-row="">
												<a href={item.href} aria-current={active ? "page" : undefined} aria-keyshortcuts={item.shortcut} onClick={() => setOpen(false)} className={cn("flex min-h-12 items-center justify-between gap-4 no-underline", active ? "text-foreground font-[575]" : "text-tone-mid")}><span className="lowercase">{item.title}</span><span className="kbd" aria-hidden="true">{item.shortcut}</span>
												</a>
											</li>
										);
									})}
								</ul>
							</nav>
						) : (
							<div className="flex flex-col gap-4 text-base">
								<a href={`${siteConfig.links.github}/glpecile.xyz`} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} className="action flex min-h-11"><svg viewBox="0 0 24 24" aria-hidden="true" className="icon"><path d={icons.code} /></svg>source code</a>
								<fieldset className="flex flex-col">
									<legend className="text-tone-soft mb-2 text-sm">theme</legend>
									{siteConfig.shortcuts.theme.map((item) => (
										<button key={item.theme} type="button" aria-pressed={theme === item.theme} aria-keyshortcuts={item.shortcut} onClick={() => document.querySelector<HTMLButtonElement>(`footer [data-theme-option="${item.theme}"]`)?.click()} className={cn("flex min-h-12 cursor-pointer items-center justify-between gap-4 text-left", theme === item.theme ? "text-foreground font-[575]" : "text-tone-mid")}><span>{item.theme}</span><span className="kbd" aria-hidden="true">{item.shortcut}</span>
										</button>
									))}
								</fieldset>
							</div>
						)}
					</div>
				</Drawer.Content>
			</Drawer.Portal>
		</Drawer.Root>
	);
}
