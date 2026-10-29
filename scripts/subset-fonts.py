# /// script
# requires-python = ">=3.11"
# dependencies = ["fonttools==4.60.1", "brotli==1.1.0"]
# ///
"""Subset JetBrains Mono to the characters, weights and features the site uses.

Run by hand from the repo root, then commit the output:

    bun run build            # optional: lets the scan include built HTML (film titles etc.)
    uv run scripts/subset-fonts.py

Rerun when: content or UI starts using a character the script reports as
dropped, a weight or font feature is added (`font-feature-settings`,
`font-variant-*`, a non-en `lang`), or @fontsource/jetbrains-mono is upgraded.

Writes src/assets/fonts/*.woff2 and src/styles/fonts.css.

One file per weight, no unicode-range: a core + unicode-range extended split
saves ~9 KB per page but changes rendering in WebKit (a never-loaded range
face disables underline skip-ink, and unicode-range shifts some glyphs
sub-pixel), so it is not used.
"""

import html
import pathlib
import re

from fontTools import subset
from fontTools.pens.recordingPen import DecomposingRecordingPen
from fontTools.ttLib import TTFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "node_modules/@fontsource/jetbrains-mono/files"
OUT = ROOT / "src/assets/fonts"
CSS = ROOT / "src/styles/fonts.css"

# Static cuts, no italic face: italics (and bold italics) are synthesized by
# the browser from these, exactly as before. 500 backs `font-medium`.
WEIGHTS = (400, 500, 700)

KEEP = {
    0x0D, *range(0x20, 0x7F),  # ASCII
    *range(0xA0, 0x180),  # Latin-1 Supplement + Latin Extended-A
    0x2013, 0x2014, 0x2018, 0x2019, 0x201C, 0x201D, 0x2026,  # dashes, quotes, ellipsis
    # Combining marks. Chrome draws Ext-A letters missing from the cmap
    # (Ā Ć Ē Ń Ś Ź ...) as base + mark from this font; without them those
    # letters fall back to the system font.
    *range(0x0300, 0x0370),
}

# Only default-on features with content in this font. Dropped: frac (never
# enabled) and locl (only Catalan/Turkish lang systems; every page is en).
FEATURES = ["calt", "ccmp", "mark"]

CSS_CONTENT = re.compile(r"""content:\s*(["'])(.*?)\1""")


def used_chars():
    """Every character in source, config, and built HTML when present."""
    chars = set()
    files = [p for d in ("src", "config") for p in (ROOT / d).rglob("*")
             if p.suffix in {".astro", ".ts", ".tsx", ".mdx", ".md", ".css", ".json"}]
    files += list((ROOT / "dist/client").rglob("*.html"))
    for p in files:
        if p.is_file():
            text = html.unescape(p.read_text(errors="ignore"))
            chars.update(map(ord, text))
            # CSS escapes like content: "\2192"
            for _, s in CSS_CONTENT.findall(text):
                chars.update(int(h, 16) for h in re.findall(r"\\([0-9a-fA-F]{1,6})", s))
    return chars


def ranges(cps):
    cps, out, i = sorted(cps), [], 0
    while i < len(cps):
        j = i
        while j + 1 < len(cps) and cps[j + 1] == cps[j] + 1:
            j += 1
        out.append(f"U+{cps[i]:04X}" if i == j else f"U+{cps[i]:04X}-{cps[j]:04X}")
        i = j + 1
    return ", ".join(out)


def make(src, cps, dest):
    opts = subset.Options()
    opts.flavor = "woff2"
    opts.layout_features = FEATURES
    opts.hinting = False  # drops prep (dropout control only; no glyph instructions)
    opts.drop_tables += ["STAT"]  # axis naming for apps; browsers ignore it
    opts.name_IDs = ["*"]  # keep copyright/license names (OFL)
    # Keep post glyph names (~0.9 KB per file). Without them, or with short
    # g<N> names, Chrome on macOS rasterizes mermaid's SVG labels sub-pixel
    # differently; pixel diffs caught it on the sequence diagram.
    opts.glyph_names = True
    # Keep the source's global bounds and OS/2 coverage bits.
    opts.prune_unicode_ranges = False
    opts.prune_codepage_ranges = False
    font = TTFont(src, recalcBBoxes=False, recalcTimestamp=False)
    # fontTools packs GSUB with HarfBuzz's repacker whenever uharfbuzz happens
    # to be installed (~200 B larger here); pin the pure-Python packer so the
    # output is the same in any environment.
    font.cfg["fontTools.ttLib.tables.otBase:USE_HARFBUZZ_REPACKER"] = False
    sub = subset.Subsetter(opts)
    sub.populate(unicodes=cps)
    sub.subset(font)
    font.save(dest)


def check(src, dest, cps):
    """Each kept char must draw exactly as in the source: same outline and
    advance; headers unchanged; no unexpected features or hinting."""
    a, b = TTFont(src), TTFont(dest)
    ca, cb = a.getBestCmap(), b.getBestCmap()
    assert set(cb) == cps, f"{dest.name}: cmap {ranges(set(cb) ^ cps)} differs from plan"
    ga, gb = a.getGlyphSet(), b.getGlyphSet()
    for c in cps:
        assert a["hmtx"][ca[c]] == b["hmtx"][cb[c]], f"{dest.name} U+{c:04X} metrics"
        pa, pb = DecomposingRecordingPen(ga), DecomposingRecordingPen(gb)
        ga[ca[c]].draw(pa)
        gb[cb[c]].draw(pb)
        assert pa.value == pb.value, f"{dest.name} U+{c:04X} outline"
    # Fields that describe the file itself (glyph count, char index bounds,
    # checksum) may change; everything else must match the source.
    expected = {"checkSumAdjustment", "numberOfHMetrics", "numGlyphs", "maxComponentDepth",
                "usFirstCharIndex", "usLastCharIndex", "panose"}
    for tag in ("head", "hhea", "OS/2", "maxp"):
        for k, v in vars(a[tag]).items():
            if not k.startswith("_") and k not in expected:
                assert v == getattr(b[tag], k), f"{dest.name} {tag}.{k}: {v} -> {getattr(b[tag], k)}"
    feats = {r.FeatureTag for t in ("GSUB", "GPOS") if t in b
             for r in b[t].table.FeatureList.FeatureRecord}
    assert not feats - set(FEATURES), f"{dest.name}: unexpected features {feats}"
    assert "prep" not in b and "fpgm" not in b, f"{dest.name}: hinting left in"


def main():
    used = used_chars()
    OUT.mkdir(parents=True, exist_ok=True)
    css = ["/* Generated by scripts/subset-fonts.py. Do not edit; rerun the script. */"]
    for w in WEIGHTS:
        src = SRC / f"jetbrains-mono-latin-{w}-normal.woff2"
        dest = OUT / f"jetbrains-mono-{w}.woff2"
        have = set(TTFont(src).getBestCmap())
        cps = (KEEP | used) & have
        make(src, cps, dest)
        check(src, dest, cps)
        print(f"{dest.name}: {dest.stat().st_size} B, {len(cps)} chars (source {src.stat().st_size} B)")
        if w == WEIGHTS[0]:
            print(f"dropped (unused): {ranges(have - cps) or 'none'}")
        css.append(f"""@font-face {{
	font-family: "JetBrains Mono";
	font-style: normal;
	font-display: swap;
	font-weight: {w};
	src: url("../assets/fonts/{dest.name}") format("woff2");
}}""")
    CSS.write_text("\n".join(css) + "\n")
    print(f"wrote {CSS.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
