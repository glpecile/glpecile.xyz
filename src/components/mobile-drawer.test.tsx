import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import MobileDrawer from "./mobile-drawer";

describe("mobile drawers", () => {
	for (const menu of ["nav", "footer"] as const) {
		it(`server-renders the closed ${menu} trigger without browser globals`, () => {
			const html = renderToStaticMarkup(<MobileDrawer menu={menu} currentPath="/blog" />);
			expect(html).toContain(menu === "nav" ? "Open navigation" : "Open footer menu");
			expect(html).toContain('aria-expanded="false"');
			expect(html).toContain("sm:hidden");
			expect(html).not.toContain('role="dialog"');
		});
	}
});
