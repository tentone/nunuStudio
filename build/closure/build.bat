@echo off
echo ------------------------
echo       nunu Studio
echo ------------------------
echo Joining Javascript files
node join.js ../../source/ ../../source/runtime/NunuRuntime.js temp.js

echo Optimizing with google closure (takes a while)
java -jar closure.jar --compilation_level SIMPLE --warning_level QUIET --formatting PRETTY_PRINT --language_in ECMASCRIPT5 --language_out ECMASCRIPT5 --js temp.js --js_output_file ../nunu.js

echo Minifying
java -jar closure.jar --compilation_level WHITESPACE_ONLY --warning_level QUIET --formatting SINGLE_QUOTES --language_in ECMASCRIPT5 --language_out ECMASCRIPT5 --js ../nunu.js --js_output_file ../nunu.min.js

echo Cleaning temporary files
del temp.js

echo Done
pause