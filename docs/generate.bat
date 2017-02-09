@echo off
REM echo Installing YUIDocJS
REM npm -g install yuidocjs
echo Generating YUI Docs
yuidoc -o docs -N -C -x lib ../source
echo Done
pause