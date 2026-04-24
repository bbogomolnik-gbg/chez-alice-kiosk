@echo off
REM Launch Chez Alice Kiosk in Chrome kiosk mode with silent printing
REM Prerequisites: Set your default printer in Windows Settings first
REM Chrome flags: --kiosk-printing enables silent print (no dialog)

start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" ^
  --kiosk ^
  --kiosk-printing ^
  --disable-print-preview ^
  --disable-features=TranslateUI ^
  --disable-infobars ^
  --disable-session-crashed-bubble ^
  --noerrdialogs ^
  --no-first-run ^
  --window-size=1080,1920 ^
  --window-position=0,0 ^
  http://localhost:8080
