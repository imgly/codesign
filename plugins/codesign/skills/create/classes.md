# Design classes — parameter tables and derivation notes

Full per-format data (safe zones, bleed/dpi mechanics, all social placements) lives in the
`formats` skill — the **Format:** lines below are the class defaults only.

Every class shares the core parameters; each adds its own. Column key:
**R** = required, no default (must be stated or asked); **A** = ask if underived;
**D** = defaultable, never worth a question on its own.

Core (all classes): `topic/content` **R** · `format/size` **D** (class default below) ·
`audience` **A** · `vibe` **A**\* · `brand/colors` **D**\* (blank → designer's choice; a
brand kit routes through the `brand` skill) · `content availability` **D** ·
`content language` **A**.

\* `vibe` and `brand/colors` are **design-defining**: on the **first build of a new
design** they are asked unless the request, a supplied kit, a reference image or a prior
design implies them — never silently defaulted. Their defaults still apply once the user
has taken `Decide automatically`. See
`../handbook/intake.md`.

`content language` is the language of the words **inside** the design — not the language
you are speaking (handbook §1). Derive it: an explicit ask wins, then the language of any
supplied copy or topic, then the conversation's language as the default. It is worth a
chip row only when those disagree; otherwise take it and name it in the brief
("content language: German, from the conversation"). Chips: the conversation's language ·
`English` · Other.

## deck

| Parameter   | Kind    | Chips / values                                               | Default |
| ----------- | ------- | ------------------------------------------------------------ | ------- |
| talk length | A       | ~5 min · ~10 min · ~20 min · ~30+ min · Decide automatically | ~10 min |
| slide count | derived | ≈ 1.5 × minutes, clamped to 5–30                             | 15      |

**Format:** 1920×1080 px (16:9), one page per slide.
**Derivation:** length → slide count; content availability decides outline-first
(draft from topic) vs. layout-first (paste/attach).

## poster

| Parameter | Kind | Chips / values                  | Default  |
| --------- | ---- | ------------------------------- | -------- |
| venue     | A    | Print · Screen                  | Print    |
| imagery   | D    | Provided · Searched · Type only | Searched |

**Format:** print → A2 portrait (420×594 mm) + 3 mm bleed; A1/A3 on request; screen →
1080×1920 px unless stated.

## flyer

| Parameter    | Kind | Chips / values | Default |
| ------------ | ---- | -------------- | ------- |
| print format | A    | A5 · A4 · DL   | A5      |
| sides        | D    | 1 · 2          | 1       |

**Format:** chosen print size + 3 mm bleed; two-sided → one page per side.

## social-post

| Parameter            | Kind | Chips / values                                  | Default            |
| -------------------- | ---- | ----------------------------------------------- | ------------------ |
| platform + placement | A    | Instagram post · Instagram story · LinkedIn · X | Instagram post     |
| copy                 | D    | Provided · Drafted from topic                   | Drafted from topic |

**Format (derived from placement):** Instagram post 1080×1350 px · Instagram story
1080×1920 px · LinkedIn 1200×627 px · X 1600×900 px.

## business-card

| Parameter              | Kind | Chips / values            | Default |
| ---------------------- | ---- | ------------------------- | ------- |
| name + contact details | R    | free text                 | —       |
| region format          | A    | EU 85×55 mm · US 3.5×2 in | EU      |
| sides                  | D    | 1 · 2                     | 2       |

**Format:** chosen card size + 3 mm bleed; side 2 defaults to a brand/logo face.

## custom

| Parameter  | Kind | Chips / values                               | Default |
| ---------- | ---- | -------------------------------------------- | ------- |
| dimensions | R    | explicit width × height (+ unit; px, mm, in) | —       |
| medium     | D    | Print (adds 3 mm bleed, dpi 300) · Screen    | Screen  |

Use `custom` whenever the request names explicit dimensions or none of the classes
fit; everything else about the intake is unchanged.
