@echo off
REM echo Installing YUIDocJS
REM npm -g install yuidocjs
echo Generating YUI Docs
yuidoc -o docs -N -C ../source/core
echo Done
pause