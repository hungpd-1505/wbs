FROM centos:7

# system update
RUN yum -y update

# Compilers and related tools:
RUN yum -y groupinstall 'Development Tools'

# Libraries needed during compilation to enable all features of Python:
RUN yum install -y gcc openssl-devel bzip2-devel

# install dev library
RUN yum install -y wget curl telnet

# install image compressing library (libpng,libjpeg, giflib)
RUN yum -y install libjpeg-devel libpng-devel giflib-devel

# install nodejs
RUN curl -sL https://rpm.nodesource.com/setup_10.x | bash -
RUN yum install -y nodejs

RUN mkdir -p /usr/local/app
WORKDIR /usr/local/app

# Install app dependencies
COPY package.json package-lock.json /usr/local/app/
RUN npm install

# Build dll for Development env
COPY ./internals /usr/local/app/internals
RUN npm run build:dll

# Start dev env
CMD ["npm", "start"]