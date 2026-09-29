# Handbook §6.8 — Copy-writing rules (the words on the page)

Expands the **copy** axis. Every other section governs how the design looks; this one governs what it says. A page can pass all seven other axes and still be obviously machine-written, because nothing else in this rubric reads the words.

The rules below are adapted from Wikipedia's ["Signs of AI writing"](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing) (WikiProject AI Cleanup), narrowed to copy that lives inside a layout. Template copy is not an essay: a slide headline is six words, a menu item is three, a chart caption is one sentence explaining a number. The judgment is not "does this paragraph flow" but **"would a person who actually runs this business write this line on this artifact."**

#### The tells worth hunting

- **The nothing tagline.** A line that could sit on any brand in any category. _"We navigate the intersection of raw human emotion and digital precision to redefine the modern aesthetic"_ describes no business. Replace it with what the business actually does.
- **The transformation claim.** _turns X into Y_, _stops being X and becomes Y_, _from a bottleneck into a safety net_. State the change plainly and once. The same shape twice in one design is the confession.
- **The superlative nobody can check.** _world-class_, _best-in-class_, _premier_, _unparalleled_, _the world's most-loved_. A real company writes the number instead — and when a number is already in the sentence, the superlative is doing nothing.
- **The upbeat closer.** _the compounding is just getting started_, _exciting times ahead_, _a major step in the right direction_. Cut the sentence; the line before it already made the point.
- **Manufactured depth.** Present-participle tails that add no fact (_…, reflecting the community's deep connection to the land_), abstract-noun openers that delay the point (_X has always run on a quiet contradiction_), and aphorism formulas (_X is the language of Y_).
- **Rule-of-three padding.** Three abstract nouns where one concrete one would do: _disciplined growth, operational resilience, and durable long-term value_.
- **Vocabulary that marks the text as generated.** _elevate, unlock, seamless, empower, effortless, bespoke, timeless, vibrant, tapestry, testament, redefine, leverage, holistic, curated_. Judge each in context — `curated wine pairing` on a restaurant menu is ordinary English; `curated experiences that elevate your journey` is not. The word is never the tell; the emptiness is.
- **Filler body text.** Copy that fills a frame without saying anything. Delete the block and ask whether the page lost information. If it did not, the block needs a real sentence, not a shorter version of the same nothing.

#### What is not a tell

The failure mode of a copy pass is damaging good writing. Leave copy alone when it is:

- **Specific.** Numbers, dates, names, addresses, real figures. `ARR reached $48.2M, up 27% year over year` is not slop, whatever its cadence.
- **Domain idiom.** `synergy targets` in a CV, `transformation programme` in consulting, `house-made` on a menu. Trade language is how those trades write.
- **The voice the brief asked for.** A luxury stationery card is meant to sound formal; a pull quote is meant to sound quotable; a greeting card is warm and formulaic because that is the product.
- **Deliberately generic placeholder copy**, where the design ships as a template for someone else's words.

#### Typography is not a tell

Two rules from general anti-AI-writing guidance are written for web prose and are **wrong here**:

- **Em and en dashes stay.** In a layout the em dash is typography: `Reception 7:00 PM — Dinner at 8:00` is correct setting, and so is a dash in a pull quote or a chart annotation. What can be a tell is **density** — three or more in one short block, or a dash in every second line of a deck. Flag the pattern, never the character.
- **Curly quotes stay.** `“…”` and `’` are correct typography and §6.1.7 already requires them. Straight quotes are the defect, not the fix — except in a monospace or terminal design where the plain glyph is the point.

Likewise, do not inject personality where the artifact does not want it. Adding opinions, first person or asides is right for a blog post and wrong for a wedding invitation, a lab report cover or a compliance footer, where neutral and plain **is** the correct human voice.

#### Editing copy in an existing design

- **Length is a layout constraint.** The text sits in a frame laid out around it. Keep a rewrite within ~10% of the original character count, preserve explicit line breaks and their positions, and preserve leading/trailing spaces — some strings are fragments of a sentence split across styled blocks. One string in, one string out: never merge or split blocks to make a rewrite fit.
- **Localized editions move together.** A source-derived edition shares its blocks with the source (§6.6), so rewriting only the source language leaves the German saying what the English used to. Rewrite every language, or leave the string alone.
- **Check the glyphs before you commit.** A saved archive carries **subsetted** fonts — only the glyphs the copy needed when it was built. A rewrite that introduces a new character has no glyph, and the engine falls back to another face silently rather than failing: the render comes back with mixed stroke weights inside one headline and looks almost right. Latin copy rarely trips this; a CJK subset can be ~150 glyphs, so nearly any rewrite does. Re-render and read the result, and prefer characters the design already uses.

#### Pass

Every line names something true about this business, product or occasion that a competitor could not paste into their own page; no transformation claim, uncheckable superlative or upbeat closer; no abstract-noun opener or participle tail standing in for a fact; vocabulary chosen for the trade rather than for the register; every rewrite within its frame's length, its line breaks intact, its sibling languages carried, and its glyphs actually present in the packed fonts.
