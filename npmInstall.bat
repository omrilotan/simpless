@ECHO off

:choice
ECHO This action will install less node package locally on this folder
SET /P c=This may take a while, Are you sure you want to continue [Y/N]?
IF /I "%c%" EQU "Y" GOTO :install
IF /I "%c%" EQU "N" GOTO :abort
goto :choice


:install

COLOR a
npm install less & ECHO ALL DONE. THANK YOU & PAUSE & EXIT


:abort

COLOR 40
ECHO All right, never mind
PAUSE 
EXIT


PAUSE