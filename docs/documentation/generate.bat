@echo off
REM echo Installing YUIDocJS
REM npm -g install yuidocjs
echo Generating YUI Docs
yuidoc ../../source/core -o . -T simple
echo Done
pause