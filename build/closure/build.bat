@echo off
echo ------------------------
echo       nunu Studio
echo ------------------------
echo Joining Javascript files
node join.js
echo Optimizing with google closure (takes a while)
java -jar closure.jar --compilation_level SIMPLE_OPTIMIZATIONS --language_in ECMASCRIPT6_STRICT --language_out ES5 --js out.js --js_output_file ../nunu.js
echo Cleaning temporary files
del out.js

echo Done
pause