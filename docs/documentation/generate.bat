@echo off
echo Installing Docco
npm -g install docco
echo Generating Docs
docco ../../source/core -o . -l linear
echo Done
pause