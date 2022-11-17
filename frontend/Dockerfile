#OLD ONE (15 OCT 2022)

# # pull the Node.js Docker image
# FROM node:alpine as builder

# # create the directory inside the container
# WORKDIR ./Frontend

# # copy the package.json files from local machine to the workdir in container
# COPY package*.json ./

# # run npm install in our local machine
# RUN npm install --force

# # copy the generated modules and all other files to the container
# COPY . ./

# # our app is running on port 5000 within the container, so need to expose it
# # EXPOSE 8082

# # the command that starts our app
# RUN npm run build

# #stage 2

# FROM nginx

# # WORKDIR /usr/share/nginx/html
# COPY default.conf /etc/nginx/conf.d/default.conf
# # Remove default nginx static resources
# # RUN rm -rf ./*
# # Copies static resources from builder stage  --from=builder
# COPY --from=builder ./Frontend/build /var/www/html

# # nginx:
# #         restart: always
# #         build:
# #             context: ./nginx
# #         ports:
# #             - "80:80"
# EXPOSE 80

# RUN chown nginx.nginx /var/www/html/ -R
# # Containers run nginx with global directives and daemon off

# # ENTRYPOINT ["nginx", "-g", "daemon off;"]



# pull the Node.js Docker image
FROM node:alpine as builder

# create the directory inside the container
WORKDIR ./frontend

# copy the package.json files from local machine to the workdir in container
COPY package*.json ./

# run npm install in our local machine
RUN npm install --force

# copy the generated modules and all other files to the container
COPY . ./

# the command that starts our app
RUN npm run build

#stage 2

FROM nginx

# WORKDIR /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf
COPY fullchain.pem /etc/nginx/conf.d/fullchain.pem
COPY privkey.pem /etc/nginx/conf.d/privkey.pem

# Copies static resources from builder stage  --from=builder
COPY --from=builder ./frontend/build /var/www/html

EXPOSE 80
EXPOSE 443
# EXPOSE 90
# EXPOSE 445

RUN chown nginx.nginx /var/www/html/ -R
# Containers run nginx with global directives and daemon off

# ENTRYPOINT ["nginx", "-g", "daemon off;"]