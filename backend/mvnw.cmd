@echo off
set "MAVEN_CMD=C:\Users\Swetha\.maven\maven-3.10.0-rc-1\bin\mvn.cmd"
if exist "%MAVEN_CMD%" (
    "%MAVEN_CMD%" %*
) else (
    mvn %*
)
