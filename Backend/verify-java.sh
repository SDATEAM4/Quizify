#!/bin/bash
echo "Checking Java version:"
java -version
echo "Checking JAVA_HOME:"
echo $JAVA_HOME
echo "Checking Java location:"
which java
echo "Available Java versions:"
update-java-alternatives -l || true
