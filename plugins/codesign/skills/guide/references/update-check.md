# CE.SDK Skill Update Check

Age only triggers a check; it does not prove that an update exists.

## Read-only version and source check

1. Reuse a CE.SDK update result already obtained during this task.
2. Read the local version and plugin name from the calling `SKILL.md`.
3. Identify the active host, then inspect every read-only provenance source
   below that could actually supply the calling skill. Collect all matching
   records before selecting a channel.
4. For one unambiguous canonical IMG.LY installation, use its recorded ref:
   normalize `main` and `latest` to `latest`; otherwise accept
   `next`, `dev`, or `legacy`. If the exact canonical repository is
   recorded without a ref, use its default `main` branch as `latest`.
   An exact `v<version>` tag is pinned: report it and do not compare it with
   a moving channel unless the user asks to change channels.
5. Without unambiguous provenance, do not select a moving channel from the
   version alone. A nightly could be `dev` or an exact tag, a release
   candidate could be `next`, `legacy`, or an exact tag, and a stable
   version could be `latest`, `legacy`, or an exact tag. Report its update
   status as undetermined instead of guessing. If the user requested an update
   check, ask which moving channel or pinned release they intend before fetching
   a catalog. Never compare versions across channels.
6. Fetch only the selected channel's canonical catalog:
   `https://raw.githubusercontent.com/imgly/agent-skills/<channel>/.claude-plugin/marketplace.json`.
7. Select `plugins[].version` from the entry whose `name` exactly matches
   the local plugin. Compare the two values as SemVer. Never substitute
   `metadata.version` when the plugin entry is absent.
8. If the catalog is unavailable, malformed, missing the plugin, or the
   versions are incomparable, report that update status could not be determined
   and continue with the bundled documentation.
9. If the remote version is not newer, continue without interrupting the user.
   If it is newer, report installed and available versions once. Do not change
   local state.

## Read-only installation provenance

Inspect only records that could supply the calling skill. Matching records that
describe the same source, ref, scope, and active path corroborate one
installation; conflicting candidates make provenance ambiguous.

- On Claude Code, read `claude plugin list --json` and
  `claude plugin marketplace list --json`. Require the exact plugin,
  marketplace `imgly`, and source `imgly/agent-skills`.
- On Codex, read `codex plugin list --json` and
  `codex plugin marketplace list --json`. Require the exact plugin, marketplace
  `imgly`, and canonical marketplace source.
- Skills CLI: read project `skills-lock.json`, then
  `~/.agents/.skill-lock.json`. Require the exact
  `imgly/agent-skills` source and a matching `skillPath`.
- Symlink or Git checkout: resolve the active `SKILL.md` and require a Git
  origin exactly matching `https://github.com/imgly/agent-skills` or its SSH
  equivalent. Record its ref and dirty state without changing either. A
  checkout nested in an already matched host- or Skills-managed root
  corroborates that installation; only a standalone checkout is a separate
  candidate.
- Otherwise report the installation as manual or unknown.

Do not inspect another host's inventory merely because its CLI is installed.
Directory names alone are not provenance. If records point to different active
candidates, report the ambiguity instead of choosing one.

## Update only after approval

Show the current and available versions, detected method, scope, source, exact
target, and exact command. Then request explicit approval.

Typical approved routes are:

- Claude Code:
  `claude plugin update <plugin>@imgly --scope <recorded-scope>`
- Codex: `codex plugin marketplace upgrade imgly`, verify the version, then
  `codex plugin add <plugin>@imgly` if the installed plugin still needs to be
  refreshed. Start a new task after reinstalling.
- Skills CLI:
  `npx skills update <exact-skill-name> --project` or `--global`,
  matching the recorded scope.
- Git or manual copy: inspect the checkout or destination first and propose a
  recoverable, target-specific operation. Never assume that `git pull` or
  overwriting a directory is safe.

Refer managed installations to their administrator. Never update a fork, local
development plugin, symlink target, or unknown copy as though it came from an
IMG.LY release channel.
