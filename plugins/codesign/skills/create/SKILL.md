---
name: create
description: >-
  Use when the user asks to create / generate / make a NEW design from a prompt — a deck
  or slides, poster, flyer, social post, business card, or a custom-size canvas. Runs the
  guided intake: derive every brief parameter the prompt already answers (class, format,
  audience, vibe, brand, content), ask ONLY the missing questions — one round, chip-style
  options, "Decide automatically" defaults — then echo the design brief and hand off to the
  handbook Loop. A brief given to the /codesign prompt lands here as the stated input.
---

# create — derive-then-ask intake for a new design

Turn "make me a deck / poster / post" into a structured **design brief** before any
`edit` runs. The one rule:

> **Derive every parameter you can from the prompt. Ask only the questions the prompt
> left unanswered. If nothing is missing, don't ask anything — build.**

That rule is not local to this skill: it is the shared intake contract in
`../handbook/intake.md`, which `brand`, `resize` and `localize`
follow with their own parameter tables. This skill is its worked example — the five steps
below are that contract plus the class system it needs. Read the contract for the parts
this skill doesn't restate: the never-invent rule, data-driven chips, and why a handoff
from another skill counts as input already given.

This skill owns the intake only. Zero design rules live here — the brief hands off to
the `handbook` Loop (which owns how to build) and the `judge` gate (which owns done).

**Bundled files:** `classes.md` — the full per-class parameter tables and derivation
notes. Read it once you know (or must ask) the class. `choice-copy.md` — the grammar
every question and chip must follow; read it before wording any question of your own.

## The intake protocol

Five steps, in order:

1. **Classify.** Map the request to a design class: `deck`, `poster`, `flyer`,
   `social-post`, `business-card`, or `custom` (explicit dimensions). If the class is
   ambiguous, it becomes the first — often only — question.

2. **Derive.** Fill the class's parameter table (see `classes.md`) from everything
   already available: the prompt, earlier conversation, attached files/images, a
   provided brand kit. A parameter counts as answered if it is stated explicitly
   ("10-minute investor pitch") or safely inferable ("for our Series A roadshow" →
   audience: investors). Track each value's source: `stated`, `inferred`, or `default`.
   A brief passed to the `/codesign` prompt counts as `stated`.

3. **Ask — once.** Collect the still-unanswered parameters the class marks `ask` and
   put them to the user in a **single round**, phrased as the class's canned questions
   with their chip options. **Ask through your own environment's question UI whenever
   it has one** — a structured question tool, an elicitation API, any form-style UI:
   options become chips, "Other" stays free. Only when your environment offers nothing
   at all, fall back to one compact markdown form listing only the missing questions.
   **The threshold for asking at all is countable, not a judgement call:** two or more
   of the five design-defining parameters (topic, audience, visual direction, brand,
   format) neither stated nor inferable → you ask. And **visual direction and brand are
   never silently defaulted on a first build** — see `../handbook/intake.md`.
   Never ask a second round: if an answer is still vague, take the default and say so
   in the brief. Every question offers **"Decide automatically"** — only `required`
   parameters (usually just the topic/content) have no default. Word every question
   and chip by `choice-copy.md`: system-POV headers, verb-led titles, no pronouns in
   titles, and each value list internally parallel.

4. **Brief.** Echo the assembled brief in 3–6 lines — class, format, audience, vibe,
   brand, content plan, content language — tagging inferred and defaulted values
   ("audience: investors, inferred") so a wrong derivation is correctable at a glance.
   Write the brief in the user's language (handbook §1), and when the design's **content
   language** was defaulted from the conversation rather than stated, say so on its line:
   it is the one derivation the user cannot see coming. Don't block on
   confirmation: state the brief and proceed, unless the user asked to see options
   first (or picked "Explore a few options" for the vibe — see below).

5. **Hand off.** Enter the handbook Loop: `parent: null`, `title` from the brief,
   format/page setup from the class's derivation notes. Consult `brand` if a brand kit
   is in play; finish through the `judge` gate as always.

## Exemplar: the `deck` intake

The canonical question set — offer these chips verbatim when asking:

1. **What's the deck about?** — free text: topic, purpose, key points or content
   already in hand. **Required — the only question with no default.**
2. **Who's the audience?** — `Executives / leadership` · `Team / internal` ·
   `Customers / prospects` · `Investors` · `Broad / public` · Other.
   Default: inferred from topic, else broad/public.
3. **How long is the talk?** — `~5 min` · `~10 min` · `~20 min` · `~30+ min` ·
   `Decide automatically` · Other. Derives slide count ≈ 1.5 × minutes, clamped to
   5–30. Default: ~10 min.
4. **What visual vibe would you like?** — `Clean & minimal` · `Bold & editorial` ·
   `Corporate / professional` · `Warm & friendly` · `Explore a few options` ·
   `Decide automatically` · Other. Default: decide from topic + audience.
   `Explore a few options` → build 2–3 style frames of the title slide first, preview
   them, let the user pick, then continue the deck in the chosen direction.

   **This question is asked, not defaulted, on any first build where the direction is
   not implied** by the request, a supplied brand kit, a reference image or a prior
   design. It is the parameter the user sees first and the one a skipped intake
   invents most often.

   **`Explore a few options` is every class's remedy, not just `deck`'s** — whenever
   direction is the only thing left open and the user takes `Decide automatically`,
   prefer building 2–3 style frames of the first page, previewing them, and asking
   which. Showing options costs one round of real work and answers the question far
   better than adjectives do; it is explicitly not the forbidden "second round".

5. **Any color or brand preferences?** — free text: brand colors, hex codes,
   `neutral / monochrome`, or an attached brand kit. Blank → designer's choice.
   A brand kit routes through the `brand` skill.
6. **Do you have the content?** — `Provide the content` · `Provide rough notes` ·
   `Draft from the topic` · Other.
   Default: draft from the topic.

The other classes follow the same pattern with their own parameters and formats —
all specced in `classes.md`.

## Worked examples

- _"Series A pitch deck for our robotics startup, 10 minutes, use our brand kit
  (attached), content in the attached notes."_ → class, topic, audience, length,
  brand, and content are all stated or inferable → **zero questions.** Echo the brief,
  build.
- _"Make me a deck about Q3 results."_ → topic stated; ask audience + length + vibe in
  one round; brand and content take defaults, stated in the brief.
- _"A poster."_ → nothing but the class is known → ask the poster question set in one
  round (topic required; venue, vibe, brand, imagery with defaults).
