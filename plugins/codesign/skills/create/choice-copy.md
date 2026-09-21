# Choice copy — one grammar for every list of options

The rules for any question this server puts to a user with more than one answer:
the `onboard` job menu, every `create` intake question, and anything added later.
The point is scannability — a list where no two rows share a grammar cannot be
read at a glance.

1. **Headers ask the user, from the system's side.** "What would you like to do
   first?", "How would you like to start?", "What visual vibe would you like?"
   Never a bare noun label ("Visual vibe"), and never a header that narrates what
   you are about to do.

2. **Card titles are verb-led — action verb + object.** "Convert an existing
   file", "Sign in to IMG.LY", "Join the Discord". Not a bare noun ("A second
   opinion"), not a fragment ("One design, every size").

3. **No personal pronouns in titles** — no _I_, _my_, _you_, _our_. A title is
   an instruction, not a voice. (`onboard`'s "Rebrand: Enforce your brand design
   rules" is a deliberate, singular exception: there, the possessive is the
   point.)

4. **Subtext addresses the user as "you", or names the capability.** "Turns
   Photoshop files back into something you can edit", "Builds a deck, poster, or
   flyer". Never in the user's voice ("I have rough notes"), and never as "I".

## The `Label:` prefix

`onboard`'s six job cards — and only those — carry a label before the phrase:
`Create: Make something`, `Judge: Give feedback to an existing design`.
Verb-led on both sides of the colon. They earn it by naming durable capabilities
a user comes back for; a this-or-that choice with a colon label is just noise, so
two-option questions and checklist rows take the bare verb-phrase form.

## Value chips are exempt

Rule 2 stops at cards that pick a **path or an action**. Enumerated attribute
values stay value phrases:

```
print format   A5 · A4 · DL
sides          1 · 2
talk length    ~5 min · ~10 min · ~20 min · ~30+ min
venue          Print · Screen
placement      Instagram post · Instagram story · LinkedIn · X
```

Verbing these ("Print at A4", "Plan a 10-minute talk") disguises a size picker as
an action menu and buys nothing. What **is** required of value chips is
**internal** parallelism: every chip in one list takes the same form as its
siblings. `Provided · Search assets · Typographic only` mixes a participle, an
imperative and an adjective for the same parameter — it becomes `Provided ·
Searched · Type only`.

## Every question carries options

A question with no options is not an intake question. Each one offers **three to five
concrete choices**, plus `Decide automatically`, plus Other — even when the parameter
feels open-ended. "What visual vibe would you like?" with four named directions is
answerable in one click; the same question as bare prose is a writing assignment, and
the user's most likely reply to a writing assignment is "you decide" — which is how a
design ends up in a style nobody picked.

The single exception is the topic/content **R** parameter: free text, no chips.

## The default chip

Every optional parameter offers **`Decide automatically`** — same words every
time, so it is recognisable across every question. Never "Decide for me" (a
pronoun), never "Skip" (reads as "leave it blank" when something sensible does in
fact happen).

## In the user's language

These rules are about **grammar, not English**. When the user writes in another
language, every header, title and subtext below is written in theirs (handbook
§1) — and the rules still bind: the header still asks from the system's side, the
titles are still verb-led with no pronouns, and each list is still parallel within
itself. A German menu whose entries mix an imperative and a bare noun is exactly
as unscannable as an English one.

Two consequences worth stating:

- **The default chip is one consistent translation per language**, not the
  English words. Pick a rendering of `Decide automatically` and use that same
  rendering on every question in that language — the point of the rule is that a
  user recognises the chip instantly, and that survives translation only if you
  are consistent.
- **Translate labels, never values.** A chip's visible label is copy; `A4`,
  `ig-story`, `1080×1350`, `#showcase` and anything fed back into a tool call are
  values. Translating a value breaks the call it feeds.
