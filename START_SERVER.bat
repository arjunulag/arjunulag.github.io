@echo off
echo ========================================
echo   Fourier SVG Approximation Server
echo ========================================
echo.
echo Starting local web server...
echo.
echo Opening browser to: http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

REM Open browser after a short delay
start "" http://localhost:8000

REM Start the server
python -m http.server 8000

pause

