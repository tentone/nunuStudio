@echo off
echo ------------------------
echo        nunuStudio
echo ------------------------
echo         Runtime
echo ------------------------

echo Joining Javascript files
node join.js ../../source/ ../../source/runtime/NunuApp.js temp.js temp.css

echo Optimizing with google closure (takes a while)
java -jar closure.jar --compilation_level SIMPLE --warning_level QUIET --formatting PRETTY_PRINT --language_in ECMASCRIPT5 --language_out ECMASCRIPT5 --js temp.js --js_output_file ../nunu.js

echo Minifying
java -jar closure.jar --compilation_level WHITESPACE_ONLY --warning_level QUIET --formatting SINGLE_QUOTES --language_in ECMASCRIPT5 --language_out ECMASCRIPT5 --js ../nunu.js --js_output_file ../nunu.min.js

echo Cleaning temporary files
del temp.js
del temp.css

echo ------------------------
echo         Editor
echo ------------------------

echo Joining Javascript files
node join.js ../../source/ ../../source/Editor.js temp.js ../editor/nunu.editor.css

echo Optimizing with google closure (takes a while)
java -jar closure.jar --compilation_level SIMPLE --warning_level QUIET --formatting PRETTY_PRINT --language_in ECMASCRIPT5 --language_out ECMASCRIPT5 --js temp.js --js_output_file ../editor/nunu.editor.js

echo Minifying
java -jar closure.jar --compilation_level WHITESPACE_ONLY --warning_level QUIET --formatting SINGLE_QUOTES --language_in ECMASCRIPT5 --language_out ECMASCRIPT5 --js ../editor/nunu.editor.js --js_output_file ../editor/nunu.editor.min.js

echo Cleaning temporary files
del temp.js

echo Done
pause