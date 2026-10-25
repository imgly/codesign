@echo off
rem The plugin's commands on Windows, as codesign.sh: `mcp` (the MCP server) and `bootstrap ensure --detach` (the
rem SessionStart prefetch). The installed runtime, else the shim beside this file on the user's Node 18+; without
rem either, `mcp` says what to install and the prefetch does nothing. The build writes it with CRLF line ends.
setlocal
set "home=%IMGLY_CODESIGN_HOME%"
if not defined home set "home=%USERPROFILE%\.codesign"
if not exist "%home%\bin\cdsn.cmd" goto shim
if not "%~1"=="mcp" exit /b 0
rem Without `call` cmd hands over to cdsn.cmd and never comes back, as sh's exec.
"%home%\bin\cdsn.cmd" mcp

:shim
set major=0
where node >nul 2>nul || goto none
for /f "tokens=1 delims=v." %%m in ('node --version 2^>nul') do set "major=%%m"
if %major% GEQ 18 (
  node "%~dp0codesign-shim.mjs" %*
  exit /b
)

:none
if not "%~1"=="mcp" exit /b 0
set "channel=%IMGLY_CODESIGN_CHANNEL%"
if not defined channel set channel=stable
set "run=iex"
if not "%channel%"=="stable" set "run=$env:IMGLY_CODESIGN_CHANNEL='%channel%'; iex"
echo CoDesign needs Node 18 or newer, or a one-time install in PowerShell: irm https://get.codesign.co/runtime/%channel%/install.ps1 ^| %run% 1>&2
exit /b 1
