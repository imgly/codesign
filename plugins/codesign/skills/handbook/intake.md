# Intake — derive what you can, ask for the rest, invent nothing

Every skill that takes input follows this. `create` is the worked example (its
per-class parameter tables live in `../create/classes.md`); `brand`, `resize` and
`localize` each carry their own table. The one rule underneath all four steps:

> **Derive every parameter you can. Ask only what is missing. Never invent a
> value that belongs to the user.**

## The four steps

**1. Derive.** Fill your skill's parameter table from everything already
available — the prompt, earlier conversation, attached files or images, the
current design itself, and **whatever a calling skill handed you**. A parameter
counts as answered if it is stated outright or safely inferable. Track each
value's source: `stated`, `inferred`, or `default`.

**2. Ask — once.** Put every still-unresolved **R** and **A** parameter to the
user in a **single round**, phrased as the table's canned question with its chips.
**Ask through your own environment's question UI whenever it has one** — a
structured question tool, an elicitation API, a form, any chip-style picker. You
know your host better than this server does, and its native surface is the best
experience your user can get: options become chips, "Other" stays free. Only when
your environment offers nothing at all, fall back to one compact markdown list of
just the missing questions.

**Every question carries options** — three to five concrete choices, plus
`Decide automatically`, plus Other. A bare open question is not an intake
question. The one exception is the topic/content **R** parameter, which is free
text.

Never ask a second round. If an answer is still vague, take the default and say
so in the echo. **D** parameters are never worth a question on their own.
Showing work and letting the user pick — 2–3 style frames previewed, then "which
of these?" — is **not** a second round: that rule governs parameter rounds only.

Word every question and chip by `../create/choice-copy.md`.

**3. Echo.** State the resolved inputs in one to three lines, tagging what was
inferred or defaulted — "acme restyle, paper scheme (defaulted), 1 design" — so a
wrong derivation is correctable at a glance. Don't block on confirmation: state it
and proceed.

**4. Never invent someone else's facts.** Where a parameter's value belongs to
the user or a third party — a brand's colours, a font a brand licenses, a locale's
wording, the contents of a file — a missing value is an **ask**. Never a guess,
and **never a silent stop** either: "the kit is incomplete, so I stopped" leaves
the user with nothing. Name what is missing and ask for that one thing.

## When you must ask — the threshold, not a feeling

"The prompt was vague" is a self-assessment, and a model with work to do resolves
it toward working. So the trigger is countable instead. Five parameters are
**design-defining** — the ones whose value the user sees the moment they look at
the result:

> **topic · audience · visual direction · brand / palette · format & placement**

- **Two or more of the five neither stated nor safely inferable → you ask, before
  the first `edit`.** Not "consider asking". One or none → derive, echo, build.
- **Visual direction and brand are never silently defaulted on the first build of
  a new design.** These two are what the user notices first, and their documented
  defaults are exactly what absorbs a skipped intake — a design lands in a style
  nobody chose and nothing in the transcript shows a choice was made. Either the
  request (or a supplied kit, reference image or prior design) implies the
  direction, or you offer it as a question with `Decide automatically` on it.
- Everything already derived stays derived. **A fully specified request still gets
  zero questions** — the point is never to ask more, only to stop inventing.

## Kind key

Every parameter table classifies each parameter:

| Kind  | Meaning                                                                             |
| ----- | ----------------------------------------------------------------------------------- |
| **R** | Required, no default. Must be stated or asked — the work cannot start without it.   |
| **A** | Ask if underived. Has a default, but is worth one chip row when nothing implies it. |
| **D** | Defaultable. Never worth a question on its own; state it in the echo.               |

`derived` marks a parameter that is never asked because it always comes from
context — "the latest revision of the current design" is the usual one.

## Chips may be data-driven

`create`'s chip sets are fixed, so its tables list them literally. Others are
discovered at runtime: the brand kits available come from the workspace, and a
kit's colour schemes come from its own `tokens.json`. Such a table names the
**source** of its chips rather than the chips themselves.

Nothing may hardcode a brand's schemes, fonts or colours. If the chips have to be
read from the user's data, read them.

## A handoff is derived input, not a fresh start

When another skill routes to you — `onboard` picking a job, `create` handing over
a brief with a brand kit already in play — everything it carried is `stated`
input. Re-asking it is the failure mode that makes this whole protocol feel worse
than guessing: the user answers the same question twice and concludes the tools
don't talk to each other. Read what you were given before you ask anything.

## `judge` does not ask

`judge` is step 5 of the Loop — the mandatory gate on every build. A question
there would interrupt every design this server makes, so its axis set and
threshold are **D**, overridden by the caller and never asked. This is deliberate:
"every skill asks" does not apply to the gate.
