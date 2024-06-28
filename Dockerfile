# Pull base image
FROM node:18 AS base

# Install OpenJDK 17
RUN apt-get update && \
  apt-get install -y openjdk-17-jdk && \
  rm -rf /var/lib/apt/lists/*

# Set Java environment variables
ENV JAVA_HOME="/usr/lib/jvm/java-17-openjdk-amd64"
ENV PATH="$JAVA_HOME/bin:$PATH"

# Print Java version for verification
RUN java --version

# Stage for building and installing SDK (replace with your SDK installation steps)
FROM base AS sdk

# Install SDK (replace with your SDK installation steps)
RUN apt-get update && \
  apt-get install -y android-sdk && \
  rm -rf /var/lib/apt/lists/*

# Set Android environment variables
ENV ANDROID_HOME="/usr/lib/android-sdk"
ENV PATH="$ANDROID_HOME/tools:$ANDROID_HOME/tools/bin:$ANDROID_HOME/platform-tools:$PATH"

# Download sdkmanager
RUN cd $ANDROID_HOME && \
  wget -q https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip && \
  unzip -q commandlinetools-linux-11076708_latest.zip && \
  cd cmdline-tools && \
  mkdir latest && \
  mv NOTICE.txt bin lib source.properties latest && \
  rm ../commandlinetools-linux-11076708_latest.zip

ENV PATH="$ANDROID_HOME/cmdline-tools/latest/bin:$PATH"

# Install Android SDK components
RUN yes | sdkmanager --licenses && \
  sdkmanager --update && \
  sdkmanager "build-tools;30.0.3" "platforms;android-33"

FROM sdk AS final

ARG ENVIRONMENT=production
ARG KEYSTORE
ARG KEYSTORE_ALIAS
ARG KEYSTORE_PASSWORD
ARG KEYSTORE_ALIAS_PASSWORD

# Set environment variables
ENV ENVIRONMENT=${ENVIRONMENT}
ENV KEYSTORE=${KEYSTORE}
ENV KEYSTORE_ALIAS=${KEYSTORE_ALIAS}
ENV KEYSTORE_PASSWORD=${KEYSTORE_PASSWORD}
ENV KEYSTORE_ALIAS_PASSWORD=${KEYSTORE_ALIAS_PASSWORD}

# Print environment variables for verification
RUN echo "Environment: ${ENVIRONMENT}"
RUN echo "Keystore: ${KEYSTORE}"
RUN echo "Keystore Alias: ${KEYSTORE_ALIAS}"
RUN echo "Keystore Password: ${KEYSTORE_PASSWORD}"
RUN echo "Keystore Alias Password: ${KEYSTORE_ALIAS_PASSWORD}"

# Create app directory
WORKDIR /www/app

# Install app dependencies
COPY package*.json .

RUN npm install --include dev
RUN npm install -g @ionic/cli

# Bundle app source
COPY . /www/app/

# Grant execution permissions to gradlew
RUN chmod +x /www/app/android/gradlew

# Build the app
RUN ionic cap build android --configuration=${ENVIRONMENT}

# GeneratE browser application bundles and copy them to the native project
RUN npx ng build  --configuration=${ENVIRONMENT} && npx cap copy

# Create the keystore file
RUN echo ${KEYSTORE} | base64 -d > android/dataquest-keystore.jks

# Set the ENTRYPOINT to compile the artifact (.aab)
RUN npx cap build android \
  --androidreleasetype=AAB \
  --keystorealias=${KEYSTORE_ALIAS} \
  --keystorealiaspass=${KEYSTORE_ALIAS_PASSWORD} \
  --keystorepass=${KEYSTORE_PASSWORD} \
  --keystorepath="dataquest-keystore.jks"
