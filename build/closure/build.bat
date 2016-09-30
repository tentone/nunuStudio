@echo off
echo "Joining Javascript files"
node join.js
echo "Closure compiling"
java -jar closure.jar --language_out ES5 --js out.js --js_output_file ../nunu.js
echo "Cleaning temp files"
del out.js

echo "Done"
pause