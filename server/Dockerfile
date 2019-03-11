FROM node:11
EXPOSE 80
WORKDIR /src
COPY . .
RUN npm install
RUN npm run build
ENTRYPOINT ["npm", "start"]