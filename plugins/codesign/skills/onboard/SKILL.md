---
name: onboard
description: >-
  Use when the user is new here or asks what this server is / what it
  can do ("what is CoDesign", "what can you make", "show me"). A guided, plain-language
  introduction for a HUMAN: explain what CoDesign is in everyday terms, put the six
  jobs it does on the table, let the user pick one, then run it either on the bundled
  demo design or on the user's own idea — closing with the optional (never required)
  IMG.LY sign-in and the ways to earn more credits. Not a design manual: the handbook
  remains the required read before any edit.
---

# onboard — introduce CoDesign, then do one real job

You are talking to a person who may have never used this before. The goal is that they
leave with **one finished thing** and an accurate idea of what to come back for.

**Bundled files:** `demo-brief.md` — the canned demo brief, read only when the user
picks the demo for the `generate` job. The choice-copy rules every question below
follows live in `../create/choice-copy.md`.

**Narration mode — this flow only.** Be conversational and a little verbose. Announce
each step before you take it, and after every `preview` say in one or two sentences
what it just proved ("I changed only the headline — nothing else re-rolled; that's
what makes this a design file and not a picture"). Normal design work outside this
flow keeps the usual concise style.

**Honesty rules, throughout.** Claim only what this server does. Never guess a version
number — call `diagnostics` if asked. Never disparage image or video generators;
CoDesign works with them. Do not promise video.

**Credits: never quote an amount, and never promise a grant.** Say "credits" and
"more credits" — never a number, a total, or a per-design estimate, not for the
sign-in and not for any rung of the ladder in Beat 5. The amounts live on
<https://img.ly/codesign> and in the Discord, and change without this server knowing.
Nor can this server verify a Discord join or hand out a credit: the ladder is what
IMG.LY offers, linked, not something you are granting.

**Terms: link, never paraphrase.** The account, the AI gateway and the credits — how
they are earned, and that they expire — are governed by
<https://img.ly/tos/codesign>. Point at it when the account comes up (Beat 4) and list
it in the close (Beat 5). Do not summarise a clause, restate a right or a restriction,
or answer a specific terms question from memory: the page is the authority and it
changes without this server knowing. The same discipline as amounts — link, don't
recite.

---

## Beat 1 — what this is, in plain words

No jargon. Do not say "CE.SDK", "engine", "revision DAG", "blocks" or "scene". Cover,
in your own words, about a paragraph:

- **I make a real design document, not a picture of one.** Text stays text, shapes
  stay shapes, layers stay layers.
- **So one word can change without re-rolling everything.** Ask for a different
headline and only the headline moves.
- **You can take over at any point.** Every design opens in a browser editor — move
  things yourself, save, and I carry on from your version.
- **It ends in something usable:** print-quality PDF, or images in whatever size you
  need.

## Beat 2 — the six jobs

Put them on the table, one line each, in plain language. Then ask **one** question —
_**What would you like to do first?**_ Use your environment's structured question tool
if it has one (options become chips); otherwise a compact markdown list.

Offer the titles and subtext **verbatim**: they follow the choice-copy rules in
`../create/choice-copy.md`, which govern every list of choices this server puts to a
user. Do not paraphrase them into your own voice.

**Verbatim binds the content, not the English.** If the user writes in another
language, these cards are written in theirs (handbook §1) — keep each title's
`Label: Action phrase` shape, keep them verb-led and pronoun-free, and keep the
subtext saying the same thing. What you must not do is drift the _meaning_ or
re-voice them. The job ids in the first column are values, never translated.

| Job        | Card title                                             | Subtext                                                                                 | Then run                         |
| ---------- | ------------------------------------------------------ | --------------------------------------------------------------------------------------- | -------------------------------- |
| `generate` | **Create: Make something**                             | Builds a deck, poster, flyer, social post, business card, or any custom size.           | `create`                         |
| `import`   | **Import: Convert an existing file**                   | Turns Photoshop, InDesign, PowerPoint, PDF, or images back into something you can edit. | `import`, then the handbook Loop |
| `resize`   | **Resize: Ship one design in different sizes**         | Re-composes the layout per format and platform — not just scaled.                       | `resize`                         |
| `rebrand`  | **Rebrand: Enforce your brand design rules**           | Applies your colors, fonts, and logo across the whole design.                           | `brand`                          |
| `localize` | **Localize: Translate a design to multiple languages** | Keeps the layout intact, right-to-left included.                                        | `localize`                       |
| `judge`    | **Judge: Give feedback to an existing design**         | Scores a design against a rubric, then fixes what's weak.                               | `judge`                          |


Always add the closing line: **however you start, you can finish with a print-ready
PDF or a link that hands the design to a colleague.** That is not a seventh option —
it is true of all six.


If the user answers with something not on this list, take them at their word and go to
the closest skill; don't force the menu.

## Beat 3 — the demo, or their own idea?

Ask **one** question — _**How would you like to start?**_ — with these two cards,
verbatim (in the user's language, on the same terms as Beat 2):

| Card title              | Subtext                                                                          |
| ----------------------- | -------------------------------------------------------------------------------- |
| **Use the demo design** | Runs the job you picked on a finished example, so the result appears in seconds. |
| **Describe an idea**    | Runs the job on your own brief instead of the example.                           |

If they already described their own idea, skip the question and run it.

**Their own idea** → hand straight to the skill from Beat 2, carrying everything they
said. The `create` skill runs its own intake — do not pre-empt it with questions of
your own. Note that the three questions above are about **navigation**, not about the
design: `create` still has to ask its own, and a user who has answered three questions
already has not answered any of those.

**The demo** — two paths, by job:

- Job `generate` → **build it in front of them.** Read `demo-brief.md` and run it
  through the normal handbook Loop. Narrate as you go, and `preview` your work.

  **Check for `asset_generate` before you start.** This build's hero visual is
  generated, so it needs a free IMG.LY sign-in. If the tool isn't in your list,
  **propose the sign-in first** — one line on why (the demo generates its own artwork),
  then `login`. Never start building and hit the wall halfway. If they'd rather not
  sign in, don't build a degraded version and don't leave an empty slot: load the
  finished design instead (below), say plainly that only the _build_ step needs an
  account, and carry on. Beat 4 then has nothing left to ask — skip it.

- Jobs `import`, `resize`, `rebrand`, `localize`, `judge` → **rebuild nothing.**
  Load the finished demo in one call:

  ```
  import({ source: { demo: "cybernews" } })
  ```

  Then do the job they picked on it and show the result against the original: resize
  it to a story format, restyle it to a brand, localize it, or run the `judge` gate
  over it. That contrast is the point — a variation appears in seconds and nothing was
  regenerated from scratch.


Whichever path ran, finish with `view` and give them the editor link, plus an `export`
when a file makes sense for that job. Say explicitly that the link is live and
editable, and that whatever they change there comes back to you.


## Beat 4 — the optional account (ask once)

Do this **after** the job, once, and never raise it again in the session.

First check what is actually available:

- If `asset_generate` is already in your tool list, say so in one line — image
  generation is on, nothing to do — and skip the rest of this beat.
- If there is no `login` tool, mention the account only as a pointer
  (<https://img.ly/signup>) and ask nothing.

Otherwise, say this honestly:

> Everything you just saw ran with **no account and no API key** — that's the normal
> way to use this. If you want more, a free IMG.LY sign-in adds the **AI Gateway**: I
> can generate images from a prompt and drop them into the design as a real layer —
> the floating glass cubes in the demo design were made exactly that way. Signing in
> comes with credits to spend on it, and it covers commercial
> licensing when you get there.

Then ask **one** question — _**How would you like to continue?**_ — with these two
cards, verbatim (in the user's language, on the same terms as Beat 2):

| Card title                      | Subtext                                                                      |
| ------------------------------- | ---------------------------------------------------------------------------- |
| **Sign in to IMG.LY**           | Free. Adds image generation, and starts you off with credits to spend on it. |
| **Continue without an account** | Everything except image generation keeps working exactly as it does now.     |

On the first, call `login` — it opens their browser and returns immediately; call
`login` again to confirm once they're back. On the second, drop it cheerfully:
everything except image generation works exactly the same.

**Point at the terms once, when the account comes up — don't paraphrase them.** One
line alongside the question: the account, the gateway and the credits are covered by
the CoDesign terms of service, <https://img.ly/tos/codesign>. Link it and move on. You
are not the authority on what the terms say: never summarise a clause, never state a
right or a restriction they don't ask about, and if they do ask something specific,
send them to the page rather than answering from the description above.

## Beat 5 — close

Two short blocks, no wall of text.

**First, where they stand.** Print the ladder as a checklist, ticking only what
actually happened:

```
Where you stand:
  ✓ Install CoDesign            free, and stays free
  ✓ Sign in to IMG.LY           credits added
  □ Join the Discord            → more credits
  □ Post a design in #showcase  → more credits
  □ Get a design featured       → the biggest top-up; we pick one every Friday

  Discord   https://discord.gg/tCRKuykXQN
  More      https://img.ly/codesign
  Terms     https://img.ly/tos/codesign
```

Row 1 is always ticked — installing is free and stays free. Row 2 is ticked **only if
`login` actually succeeded in this session**; if they declined, or there was no `login`
tool to call, leave it unticked and point at <https://img.ly/signup>. Rows 3–5 are
never ticked: you have no way to know, and guessing would breach the honesty rules.

The code fence is a layout, not a string: write the rows in the user's language
(handbook §1). The three URLs and `#showcase` are values and stay exactly as they are.

**Then, three short lines:**

1. **Three starter prompts they can copy**, tailored to the job they picked (e.g.
   _"resize this to a LinkedIn banner and an A4 poster"_, _"restyle it in our brand
   colors #0b0b0b and #ff4d2e"_, _"make a German and an Arabic edition"_).
2. `/codesign:onboard` (plugin) or asking for the `onboard` skill brings this back any time; `/codesign <brief>` starts a new design directly.
3. One line, only if they seem to be building software: this runs on IMG.LY's CE.SDK —
   the same design layer is available as an SDK.

**Last line of the whole flow**, as an afterthought and not a lead:

> Credits expire three months after they land — no rush, but they don't wait forever.
