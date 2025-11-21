@echo off
echo ========================================
echo   Fourier SVG Approximation Server
echo ========================================
echo.
echo Starting local web server...
echo.
echo Once started, open your browser to:
echo http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

python -m http.server 8000

pause

