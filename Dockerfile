# Pull base image
FROM node:18

# Create app directory
WORKDIR /www/app

# Install app dependencies
COPY package*.json ./

RUN npm install
RUN npm install -g @ionic/cli

# Bundle app source
COPY . /www/app/

# Expose port 8100
EXPOSE 8100

# Entry point
ENTRYPOINT ["ionic"]

# Run the app
CMD ["serve", "--external", "--no-open"]