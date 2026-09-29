# Master → editions

One design, many deliverables: a **master** and the **editions** derived from it (sizes, locales,
or both). The workspace's revision DAG already records everything needed — this page is the
convention that makes a master fix reach every edition by **replaying** each edition's build step,
instead of redoing it by hand. Used by `resize` (size editions) and `localize` (language editions).

## The rules

1. **The master is one revision.** It is the native design — layout, brand, timeline, voice-over —
   in its source size and language. Name every block you will touch in an edition
   (`create({ type, name, … })`); editions find blocks with `engine.design.findByName(name)`.
2. **An edition is one `edit` on the master.** `edit({ parent: <master>, code, note: 'edition: ig-story 1080×1920' })`.
   Always fork from the master — never from another edition (a resize of a resize, a translation
   of a translation compounds every error).
3. **The edition's code is self-contained.** It resolves blocks by **name**, never by numeric id
   (ids are session-scoped — a replay with literal ids edits the wrong blocks or throws). It carries
   its inputs inline — target size, copy, asset `workspace://` URIs, a transcript's word timings —
   and reads anything that comes from the master (positions, offsets, styles) from the scene at run
   time, so a changed master flows through.
4. **Fold follow-up fixes into that one body.** If you corrected the edition in a second `edit`,
   merge the correction into the edition's code and re-run it on the master, so the edition stays a
   single replayable step.
5. **A combined edition runs both bodies.** A German vertical = one `edit` on the master whose code
   is the resize body followed by the localize body.

## Re-applying a master fix

1. Fix the master: `edit({ parent: <master>, code, note: 'master fix: …' })` → the new master `M2`.
2. For each edition `E`: read its build step with `inspect({ revision: E })` — the `code` field —
   and run it again: `edit({ parent: M2, code, note: <E's note> })`.
3. `preview` every re-run edition (at several `time`s for video) and judge it again — a fix that
   is right for the master can still break an edition's layout.

If a replay throws, the fix renamed or removed a block the edition names: correct the edition's
code, not its output. The previous editions stay in `history()`; the replayed ones are the new
leaves.
