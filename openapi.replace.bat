@echo off
chcp 65001 > nul

setlocal enabledelayedexpansion

set "old_text=import { request } from 'umi';"
set "new_text=import request from 'umi-request';"

set "file_pattern=src/servers/api/*.ts"

for %%f in (%file_pattern%) do (
    set "old_file=%%~nf%%~xf"
    set "new_file=%%~nf_output%%~xf"

    set "input_file=src/servers/api/%%~nf%%~xf"
    set "output_file=src/servers/api/%%~nf_output%%~xf"

    (for /f "usebackq delims=" %%a in (!input_file!) do (
        set "line=%%a"
        set "line=!line:%old_text%=%new_text%!"
        echo(!line!
    )) > !output_file!

    (for /f "usebackq delims=" %%a in (!output_file!) do (
        set "line=%%a"
        set "line=!line!"
        echo(!line!
    )) > !input_file!

    del "%cd%\src\servers\api\%%~nf_output%%~xf"
)
