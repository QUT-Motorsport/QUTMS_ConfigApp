FROM node:alpine
WORKDIR /app
#package*.json will also copy package-lock.json
COPY package*.json ./
#DEBUG is an environment variable which controls logging for many Node modules.
#Dont do it its terrifying
# ENV DEBUG=*
#--production will skip installing devDependencies
RUN npm install --production
#Putting full COPY command last will leverage cache better 
#(you won't have to re-run npm install unless your dependencies have changed)
COPY . .
CMD ["npm", "start"]