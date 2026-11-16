@REM ----------------------------------------------------------------------------
@REM InstaNotes Maven wrapper batch script
@REM ----------------------------------------------------------------------------
@echo off
setlocal
set "DIR=%~dp0"
set "MAVEN_HOME=%DIR%.mvn\apache-maven-3.9.9"
"%MAVEN_HOME%\bin\mvn.cmd" %*
endlocal
