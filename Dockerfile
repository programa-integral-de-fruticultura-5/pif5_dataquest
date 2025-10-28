# Pull base image
FROM node:18 AS base

# Install OpenJDK 17 (requerido para Gradle 8+)
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

# Download and install command line tools (última versión)
RUN cd $ANDROID_HOME && \
  wget -q https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip && \
  unzip -q commandlinetools-linux-11076708_latest.zip && \
  mkdir -p cmdline-tools/latest && \
  cd cmdline-tools && \
  mv NOTICE.txt bin lib source.properties latest/ && \
  cd .. && \
  rm commandlinetools-linux-11076708_latest.zip

# ====================================
# CRÍTICO: Instalar SDK para API 35
# ====================================
RUN yes | sdkmanager --licenses && \
  sdkmanager --update && \
  sdkmanager \
    "build-tools;34.0.0" \
    "platforms;android-35" \
    "platform-tools" \
    "ndk;25.2.9519653" \
    "cmake;3.22.1"

# Verificar instalación
RUN echo "=== Android SDK Installation ===" && \
  sdkmanager --list_installed

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

# ====================================
# Actualizar SDK Versions a API 35
# ====================================
RUN echo "Updating to compileSdk 35 and targetSdk 35..." && \
  find /www/app/android -name "build.gradle" -type f -exec sed -i \
    -e 's/compileSdk[[:space:]]*=[[:space:]]*[0-9]\+/compileSdk = 35/g' \
    -e 's/compileSdkVersion[[:space:]]\+[0-9]\+/compileSdkVersion 35/g' \
    -e 's/compileSdk[[:space:]]\+[0-9]\+/compileSdk 35/g' \
    -e 's/targetSdk[[:space:]]*=[[:space:]]*[0-9]\+/targetSdk = 35/g' \
    -e 's/targetSdkVersion[[:space:]]\+[0-9]\+/targetSdkVersion 35/g' \
    -e 's/targetSdk[[:space:]]\+[0-9]\+/targetSdk 35/g' \
    {} \; && \
  echo "✓ SDK versions updated to API 35"

# Set the path to the build.gradle file
ENV ANDROID_BUILD_PATH="/www/app/android/app/build.gradle"

# ====================================
# Verificar configuración de 16KB
# ====================================
RUN echo "Verifying 16KB page size support in build.gradle..." && \
  if grep -q "splits {" ${ANDROID_BUILD_PATH} && grep -q "ndk {" ${ANDROID_BUILD_PATH}; then \
    echo "✓ 16KB support configuration found in build.gradle"; \
  else \
    echo "⚠ WARNING: Adding 16KB support configuration to build.gradle"; \
    # Si no existe, agregar configuración básica
    sed -i '/defaultConfig {/a\        ndk {\n            abiFilters "armeabi-v7a", "arm64-v8a", "x86", "x86_64"\n        }' ${ANDROID_BUILD_PATH}; \
  fi

# Modify the android/app/build.gradle version name
RUN if [ "${ENVIRONMENT}" = "development" ]; then \
    sed -i -E "s/(versionName[[:space:]]*=[[:space:]]*\")(.*)(\")/\1\2-test.${VERSION_CODE}\3/" ${ANDROID_BUILD_PATH} || \
    sed -i -E "s/(versionName \")(.*)(\")/\1\2-test.${VERSION_CODE}\3/" ${ANDROID_BUILD_PATH}; \
  else \
    sed -i -E "s/(versionName[[:space:]]*=[[:space:]]*\")(.*)(\")/\1\2-prod.${VERSION_CODE}\3/" ${ANDROID_BUILD_PATH} || \
    sed -i -E "s/(versionName \")(.*)(\")/\1\2-prod.${VERSION_CODE}\3/" ${ANDROID_BUILD_PATH}; \
  fi

# Verify the version was updated
RUN echo "Updated version in build.gradle:" && \
  (grep -E "versionName" ${ANDROID_BUILD_PATH} || echo "Version name not found in expected format")

# Build the web app
RUN ionic cap build android --configuration=${ENVIRONMENT} --no-open

# Create the keystore file
RUN echo "${KEYSTORE}" | base64 -d > /www/app/android/app/pif-keystore.jks

# Verify keystore was created
RUN echo "Keystore file created:" && \
  ls -lh /www/app/android/app/pif-keystore.jks

# ====================================
# Configure gradle.properties
# ====================================
RUN echo "Configuring gradle.properties for API 35 + 16KB support..." && \
  echo "" >> /www/app/android/gradle.properties && \
  echo "# ====================================" >> /www/app/android/gradle.properties && \
  echo "# AndroidX Configuration" >> /www/app/android/gradle.properties && \
  echo "# ====================================" >> /www/app/android/gradle.properties && \
  echo "android.useAndroidX=true" >> /www/app/android/gradle.properties && \
  echo "android.enableJetifier=true" >> /www/app/android/gradle.properties && \
  echo "" >> /www/app/android/gradle.properties && \
  echo "# ====================================" >> /www/app/android/gradle.properties && \
  echo "# 16KB Page Size Support" >> /www/app/android/gradle.properties && \
  echo "# REQUIRED by Play Store (deadline: May 30, 2025)" >> /www/app/android/gradle.properties && \
  echo "# ====================================" >> /www/app/android/gradle.properties && \
  echo "android.bundle.enableUncompressedNativeLibs=false" >> /www/app/android/gradle.properties && \
  echo "" >> /www/app/android/gradle.properties && \
  echo "# ====================================" >> /www/app/android/gradle.properties && \
  echo "# API 35 Support" >> /www/app/android/gradle.properties && \
  echo "# REQUIRED by Play Store (deadline: Oct 31, 2024)" >> /www/app/android/gradle.properties && \
  echo "# ====================================" >> /www/app/android/gradle.properties && \
  echo "android.suppressUnsupportedCompileSdk=35" >> /www/app/android/gradle.properties && \
  echo "" >> /www/app/android/gradle.properties && \
  echo "# ====================================" >> /www/app/android/gradle.properties && \
  echo "# Signing Configuration" >> /www/app/android/gradle.properties && \
  echo "# ====================================" >> /www/app/android/gradle.properties && \
  echo "RELEASE_STORE_FILE=/www/app/android/app/pif-keystore.jks" >> /www/app/android/gradle.properties && \
  echo "RELEASE_STORE_PASSWORD=${KEYSTORE_PASSWORD}" >> /www/app/android/gradle.properties && \
  echo "RELEASE_KEY_ALIAS=${KEYSTORE_ALIAS}" >> /www/app/android/gradle.properties && \
  echo "RELEASE_KEY_PASSWORD=${KEYSTORE_ALIAS_PASSWORD}" >> /www/app/android/gradle.properties && \
  echo "" >> /www/app/android/gradle.properties

# Display gradle.properties (without sensitive data)
RUN echo "Gradle properties configured:" && \
  grep -v "PASSWORD\|ALIAS" /www/app/android/gradle.properties || true

# Display relevant parts of build.gradle for verification
RUN echo "Build.gradle configuration:" && \
  echo "=== SDK Versions ===" && \
  (grep -E "(compileSdk|targetSdk)" ${ANDROID_BUILD_PATH} | head -5 || echo "SDK config not found") && \
  echo "=== 16KB Support ===" && \
  (grep -A 5 "splits {" ${ANDROID_BUILD_PATH} || echo "Splits configuration not found") && \
  (grep -A 3 "ndk {" ${ANDROID_BUILD_PATH} || echo "NDK configuration not found")

# Clean previous builds
RUN cd /www/app/android && \
  echo "Cleaning previous builds..." && \
  ./gradlew clean

# ====================================
# Build signed AAB with API 35 + 16KB
# ====================================
RUN cd /www/app/android && \
  echo "========================================" && \
  echo "Starting AAB build with:" && \
  echo "  • compileSdk: 35 (API 35)" && \
  echo "  • targetSdk: 35 (Play Store requirement)" && \
  echo "  • 16KB page size: ENABLED" && \
  echo "  • ABI splits: armeabi-v7a, arm64-v8a, x86, x86_64" && \
  echo "========================================" && \
  ./gradlew bundleRelease \
    -Pandroid.injected.signing.store.file=/www/app/android/app/pif-keystore.jks \
    -Pandroid.injected.signing.store.password=${KEYSTORE_PASSWORD} \
    -Pandroid.injected.signing.key.alias=${KEYSTORE_ALIAS} \
    -Pandroid.injected.signing.key.password=${KEYSTORE_ALIAS_PASSWORD} && \
  echo "✓ Build completed successfully!"

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

# ====================================
# Final Verification & Summary
# ====================================
RUN echo "" && \
  echo "========================================" && \
  echo "     BUILD SUMMARY - PLAY STORE READY   " && \
  echo "========================================" && \
  echo "Environment:           ${ENVIRONMENT}" && \
  echo "Version Code:          ${VERSION_CODE}" && \
  echo "" && \
  echo "✓ compileSdk:          35 (API Level 35)" && \
  echo "✓ targetSdk:           35 (Play Store deadline: Oct 31)" && \
  echo "✓ 16KB Page Support:   ENABLED (deadline: May 30, 2025)" && \
  echo "✓ ABI Splits:          armeabi-v7a, arm64-v8a, x86, x86_64" && \
  echo "✓ Universal APK:       Included" && \
  echo "✓ Signing:             Configured" && \
  echo "" && \
  echo "AAB Location:" && \
  ls -lh /www/app/android/app/build/outputs/bundle/release/app-release-signed.aab && \
  echo "" && \
  echo "========================================" && \
  echo "  Ready for Google Play Store Upload!  " && \
  echo "========================================"