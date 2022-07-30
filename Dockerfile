# Defining from what image to build from
FROM node:16.16.0

# Creating app directory
WORKDIR /api

# Installing all dependencies
COPY package*.json ./

# Installing npm
RUN npm install

# Bundling app source
COPY . .

# Port
EXPOSE 5000

# Command for running the app (node .)
CMD ["node", "."]
