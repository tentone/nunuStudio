taskkill /IM nw.exe /F
set arg1=%1
cd source
npm run start %arg1%