@echo off
rem The plugin's MCP server on Windows, as codesign.sh: the installed runtime, else the shim beside this file on the
rem user's Node 18+, else one line saying what to install. The build writes it with CRLF line ends.
setlocal
set "home=%IMGLY_CODESIGN_HOME%"
if not defined home set "home=%USERPROFILE%\.codesign"
if not exist "%home%\bin\cdsn.cmd" goto shim
rem Without `call` cmd hands over to cdsn.cmd and never comes back, as sh's exec.
"%home%\bin\cdsn.cmd" mcp

:shim
set major=0
where node >nul 2>nul || goto none
for /f "tokens=1 delims=v." %%m in ('node --version 2^>nul') do set "major=%%m"
if %major% GEQ 18 (
  node "%~dp0codesign-shim.mjs" mcp
  exit /b
)

:none
echo CoDesign needs Node 18 or newer once, to install itself. Install Node from https://nodejs.org, or see https://codesign.co/install 1>&2
exit /b 1
