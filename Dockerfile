# Pull base image
FROM node:18 AS base

# Install OpenJDK 17
RUN apt-get update && \
  apt-get install -y openjdk-17-jdk wget unzip sed && \
  rm -rf /var/lib/apt/lists/*

# Set Java environment variables
ENV JAVA_HOME="/usr/lib/jvm/java-17-openjdk-amd64"
ENV PATH="$JAVA_HOME/bin:$PATH"

# Print Java version for verification
RUN java --version

# Stage for Android SDK installation
FROM base AS sdk

# Set Android environment variables
ENV ANDROID_HOME="/usr/lib/android-sdk"
ENV ANDROID_SDK_ROOT="/usr/lib/android-sdk"
ENV PATH="$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH"

# Create Android SDK directory
RUN mkdir -p $ANDROID_HOME

# Download and install command line tools
RUN cd $ANDROID_HOME && \
  wget -q https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip && \
  unzip -q commandlinetools-linux-11076708_latest.zip && \
  mkdir -p cmdline-tools/latest && \
  cd cmdline-tools && \
  mv NOTICE.txt bin lib source.properties latest/ && \
  cd .. && \
  rm commandlinetools-linux-11076708_latest.zip

# Install Android SDK components
RUN yes | sdkmanager --licenses && \
  sdkmanager --update && \
  sdkmanager "build-tools;33.0.2" \
             "platforms;android-33" \
             "platform-tools"

# Final stage
FROM sdk AS final

ARG ENVIRONMENT=production
ARG VERSION_CODE
ARG KEYSTORE
ARG KEYSTORE_ALIAS
ARG KEYSTORE_PASSWORD
ARG KEYSTORE_ALIAS_PASSWORD

# Create app directory
WORKDIR /www/app

# Install app dependencies
COPY package*.json ./

RUN npm install --include dev && \
  npm install -g @ionic/cli

# Bundle app source
COPY . /www/app/

# Grant execution permissions to gradlew
RUN chmod +x /www/app/android/gradlew

# Update compileSdk to 33 (keeping targetSdk at 35)
RUN echo "Updating compileSdk to 33 (keeping targetSdk at 35)..." && \
  find /www/app/android -name "build.gradle" -type f -exec sed -i \
    -e 's/compileSdk[[:space:]]*=[[:space:]]*[0-9]\+/compileSdk = 33/g' \
    -e 's/compileSdkVersion[[:space:]]\+[0-9]\+/compileSdkVersion 33/g' \
    -e 's/compileSdk[[:space:]]\+[0-9]\+/compileSdk 33/g' \
    {} \; && \
  echo "compileSdk updated to 33, targetSdk remains at 35"

# Set the path to the build.gradle file
ENV ANDROID_BUILD_PATH="/www/app/android/app/build.gradle"

# Modify the android/app/build.gradle version name
RUN if [ "${ENVIRONMENT}" = "development" ]; then \
    sed -i -E "s/(versionName \")(.*)(\")/\1\2-test.${VERSION_CODE}\3/" ${ANDROID_BUILD_PATH}; \
  else \
    sed -i -E "s/(versionName \")(.*)(\")/\1\2-prod.${VERSION_CODE}\3/" ${ANDROID_BUILD_PATH}; \
  fi

# Verify the version was updated
RUN echo "Updated version in build.gradle:" && \
  grep -A 2 "versionName" ${ANDROID_BUILD_PATH}

# Build the web app
RUN ionic cap build android --configuration=${ENVIRONMENT} --no-open

# Create the keystore file
RUN echo "${KEYSTORE}" | base64 -d > /www/app/android/app/pif-keystore.jks

# Verify keystore was created
RUN echo "Keystore file created:" && \
  ls -lh /www/app/android/app/pif-keystore.jks

# Configure gradle.properties
RUN echo "Configuring gradle.properties..." && \
  echo "" >> /www/app/android/gradle.properties && \
  echo "# AndroidX Configuration" >> /www/app/android/gradle.properties && \
  echo "android.useAndroidX=true" >> /www/app/android/gradle.properties && \
  echo "android.enableJetifier=true" >> /www/app/android/gradle.properties && \
  echo "" >> /www/app/android/gradle.properties && \
  echo "# 16KB Page Size Support (Required by Play Store)" >> /www/app/android/gradle.properties && \
  echo "android.bundle.enableUncompressedNativeLibs=false" >> /www/app/android/gradle.properties && \
  echo "" >> /www/app/android/gradle.properties && \
  echo "# Suppress warnings" >> /www/app/android/gradle.properties && \
  echo "android.suppressUnsupportedCompileSdk=33,34,35" >> /www/app/android/gradle.properties && \
  echo "" >> /www/app/android/gradle.properties && \
  echo "# Signing Configuration" >> /www/app/android/gradle.properties && \
  echo "RELEASE_STORE_FILE=/www/app/android/app/pif-keystore.jks" >> /www/app/android/gradle.properties && \
  echo "RELEASE_STORE_PASSWORD=${KEYSTORE_PASSWORD}" >> /www/app/android/gradle.properties && \
  echo "RELEASE_KEY_ALIAS=${KEYSTORE_ALIAS}" >> /www/app/android/gradle.properties && \
  echo "RELEASE_KEY_PASSWORD=${KEYSTORE_ALIAS_PASSWORD}" >> /www/app/android/gradle.properties && \
  echo "" >> /www/app/android/gradle.properties

# Display gradle.properties (without sensitive data)
RUN echo "Gradle properties configured:" && \
  grep -v "PASSWORD\|ALIAS" /www/app/android/gradle.properties || true

# Clean previous builds
RUN cd /www/app/android && \
  echo "Cleaning previous builds..." && \
  ./gradlew clean

# Build the signed AAB
RUN cd /www/app/android && \
  echo "Starting AAB build process..." && \
  echo "Configuration: compileSdk=33, targetSdk=35, 16KB support" && \
  ./gradlew bundleRelease \
    -Pandroid.injected.signing.store.file=/www/app/android/app/pif-keystore.jks \
    -Pandroid.injected.signing.store.password=${KEYSTORE_PASSWORD} \
    -Pandroid.injected.signing.key.alias=${KEYSTORE_ALIAS} \
    -Pandroid.injected.signing.key.password=${KEYSTORE_ALIAS_PASSWORD} && \
  echo "Build completed successfully!"

# Verify and rename the AAB
RUN echo "Verifying build outputs..." && \
  ls -lah /www/app/android/app/build/outputs/bundle/release/ && \
  if [ -f /www/app/android/app/build/outputs/bundle/release/app-release.aab ]; then \
    cp /www/app/android/app/build/outputs/bundle/release/app-release.aab \
       /www/app/android/app/build/outputs/bundle/release/app-release-signed.aab && \
    echo "✓ AAB signed and renamed successfully!" && \
    ls -lh /www/app/android/app/build/outputs/bundle/release/app-release-signed.aab; \
  else \
    echo "✗ ERROR: AAB file not found" && \
    echo "Available files:" && \
    find /www/app/android/app/build/outputs -type f && \
    exit 1; \
  fi

# Final verification
RUN echo "=== BUILD SUMMARY ===" && \
  echo "Environment: ${ENVIRONMENT}" && \
  echo "Version Code: ${VERSION_CODE}" && \
  echo "compileSdk: 33 (build compatibility)" && \
  echo "targetSdk: 35 (Play Store requirement)" && \
  echo "16KB Support: Enabled ✓" && \
  echo "AAB Location:" && \
  ls -lh /www/app/android/app/build/outputs/bundle/release/app-release-signed.aab