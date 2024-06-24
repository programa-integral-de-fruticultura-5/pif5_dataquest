#!/bin/bash

# Extract versionCode and versionName from build.gradle
VERSION_CODE=$(grep -m1 versionCode android/app/build.gradle | awk '{print $2}')
VERSION_NAME=$(grep -m1 versionName android/app/build.gradle | awk '{print $2}' | tr -d '"')

echo "Version Code: $VERSION_CODE"
echo "Version Name: $VERSION_NAME"

# Set environment variables
echo "VERSION_CODE=$VERSION_CODE" >> $$GITHUB_OUTPUT
echo "VERSION_NAME=$VERSION_NAME" >> $$GITHUB_OUTPUT
