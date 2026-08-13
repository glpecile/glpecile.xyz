import * as React from "react";
import { DemoFrame } from "@/components/compound/demo-frame";
import { solutionsCorpus } from "@/components/compound/solutions-corpus";

/**
 * A searchable snapshot of shinobu's real docs/solutions/ folder. The point
 * of the widget is the point of the convention: because every title is a
 * claim, grep IS the retrieval system.
 */
export function SolutionsExplorer() {
	const [query, setQuery] = React.useState("");

	const q = query.trim().toLowerCase();
	const filtered = q
		? solutionsCorpus.filter(
				(doc) =>
					doc.title.toLowerCase().includes(q) ||
					doc.file.toLowerCase().includes(q),
			)
		: solutionsCorpus;

	return (
		<DemoFrame label={`docs/solutions/ · ${solutionsCorpus.length} files · 2026-07-02 → 2026-08-10`}>
			<div className="flex flex-col font-mono text-xs">
				<div className="border-border border-b p-3">
					<input
						type="text"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder="grep the corpus — try: simkl, cors, leak, silently"
						aria-label="Search the solutions corpus"
						className="border-border text-tone-mid placeholder:text-tone-faint w-full rounded border bg-transparent px-3 py-2 text-base outline-none focus:border-[hsl(var(--link))] sm:text-xs"
					/>
				</div>
				<ul className="m-0 max-h-80 list-none divide-y divide-[hsl(var(--tone-faint)/0.14)] overflow-y-auto p-0">
					{filtered.length === 0 ? (
						<li className="text-tone-faint mt-0 px-3 py-4">
							Nothing — which in this system is also an answer.
							Plans record "solutions scan done: nothing."
						</li>
					) : (
						filtered.map((doc) => (
							<li key={doc.file} className="mt-0 px-3 py-2">
								<span className="text-tone-mid block">
									{doc.title}
								</span>
								<span className="text-tone-faint flex justify-between gap-2">
									<span className="truncate">{doc.file}</span>
									<span className="shrink-0">
										{doc.date ?? ""}
									</span>
								</span>
							</li>
						))
					)}
				</ul>
				<p className="border-border text-tone-faint m-0 border-t px-3 py-1.5">
					{filtered.length} of {solutionsCorpus.length} findings
				</p>
			</div>
		</DemoFrame>
	);
}
