@echo off
"C:\Program Files\Git\bin\git.exe" init
"C:\Program Files\Git\bin\git.exe" add .
"C:\Program Files\Git\bin\git.exe" commit -m "Initial commit with MVP implementation"
"C:\Program Files\Git\bin\git.exe" remote add origin https://github.com/jahboukie/promptpro.git
"C:\Program Files\Git\bin\git.exe" push -u origin master
pause
