@ECHO off

:choice
ECHO This action build the css files acording to your json file
ECHO and may run over older files located in the destination location (styles.css)
SET /P c=Are you sure you want to continue [Y/N]?
IF /I "%c%" EQU "Y" GOTO :install
IF /I "%c%" EQU "N" GOTO :abort
goto :choice


:install

COLOR a
node builder styles
TIMEOUT /T 5
EXIT

:abort

COLOR 40
ECHO All right, never mind
PAUSE
EXIT