#!/bin/sh
# The plugin's commands: `mcp` (the MCP server) and `bootstrap ensure --detach` (the SessionStart prefetch).
# Not on musl; then the installed runtime, else the shim beside this file on the user's Node 18+; without either, `mcp`
# says what to install and the prefetch does nothing. Shell builtins only, so it runs on a machine that has nothing else on PATH.
for loader in /lib/ld-musl-*; do
  [ -e "$loader" ] || continue
  [ "$1" = mcp ] || exit 0
  echo "CoDesign does not support musl Linux (Alpine)" >&2
  exit 1
done

home=${IMGLY_CODESIGN_HOME:-$HOME/.codesign}
if [ -x "$home/bin/cdsn" ]; then
  [ "$1" = mcp ] && exec "$home/bin/cdsn" mcp
  exit 0
fi

case $0 in
  */*) here=${0%/*} ;;
  *) here=. ;;
esac
version=$(node --version 2>/dev/null) || version=
major=${version#v}
major=${major%%.*}
case $major in
  '' | *[!0-9]*) major=0 ;;
esac
[ "$major" -ge 18 ] && exec node "$here/codesign-shim.mjs" "$@"
[ "$1" = mcp ] || exit 0

echo "CoDesign needs Node 18 or newer once, to install itself. Install Node from https://nodejs.org, or see https://codesign.co/install" >&2
exit 1
