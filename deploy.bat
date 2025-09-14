@echo off
echo 🚀 Starting Vercel deployment...
echo.

:: Set environment variables to avoid Korean character issues
set "VERCEL_USER_AGENT=vercel-cli"
set "HOSTNAME=deploy-host"
set "USERNAME=deploy-user"

:: Try to deploy with token (user needs to provide token)
echo Please visit: https://vercel.com/account/tokens
echo Create a token and run: vercel --token YOUR_TOKEN_HERE
echo.
echo Or use the web interface:
echo 1. Go to https://vercel.com/new
echo 2. Import from GitHub: moonjyoon/classhub
echo 3. Configure and Deploy
echo.
pause