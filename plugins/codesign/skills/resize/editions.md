# Master → editions

One design, many deliverables: a **master** and the **editions** derived from it (sizes, locales,
or both). This page is the convention that makes a master fix reach every edition by **re-running**
each edition's build step, instead of redoing it by hand. Used by `resize` (size editions) and
`localize` (language editions).

## The rules

1. **The master is one saved design.** It is the native design — layout, brand, timeline,
   voice-over — in its source size and language, saved with `export({ format: 'imgly' })` →
   `MASTER_URI`. Name every block you will touch in an edition (`create({ type, name, … })`);
   editions find blocks with `engine.design.findByName(name)`.
2. **An edition is one `edit` on a fresh copy of the master.** `import({ source: { uri: MASTER_URI } })`,
   then one `edit({ code, note: 'edition: ig-story 1080×1920' })`, `preview`, and
   `export({ format: 'imgly' })` — the edition's own file. Always start from the master — never
   from another edition (a resize of a resize, a translation of a translation compounds every
   error).
3. **The edition's code is self-contained.** It resolves blocks by **name**, never by numeric id
   (ids are session-scoped — a replay with literal ids edits the wrong blocks or throws). It carries
   its inputs inline — target size, copy, the asset `uri`s it places, a transcript's word timings —
   and reads anything that comes from the master (positions, offsets, styles) from the scene at run
   time, so a changed master flows through.
4. **Keep that one body, and fold follow-up fixes into it.** The server keeps no history of your
   edits, so the edition's code is its build step only if you keep it. If you corrected the edition
   in a second `edit`, merge the correction into the edition's code, so the edition stays a single
   replayable step.
5. **A combined edition runs both bodies.** A German vertical = one `edit` on the master whose code
   is the resize body followed by the localize body.

## Re-applying a master fix

1. Fix the master: `import({ source: { uri: MASTER_URI } })`, `edit({ code, note: 'master fix: …' })`,
   `export({ format: 'imgly' })` → the new master.
2. For each edition: `import` the new master and run the edition's kept code again, with its
   `note`; `export({ format: 'imgly' })` it.
3. `preview` every re-run edition (at several `time`s for video) and judge it again — a fix that
   is right for the master can still break an edition's layout.

If a replay throws, the fix renamed or removed a block the edition names: correct the edition's
code, not its output.
