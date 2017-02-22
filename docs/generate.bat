@echo off
REM echo Installing YUIDocJS
REM npm -g install yuidocjs
echo Removing old docs file
del /Q /S docs
echo Generating YUI Docs
yuidoc -o docs -N -C -t theme -x lib ../source

echo Done
pause