FROM openjdk:19-buster

ENV MINECRAFT_VERSION=1.19.3
ENV PORT=25565

RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -  &&\
  apt update -y &&\ 
  apt install nodejs -y 

ADD . /app

WORKDIR /app/data

RUN curl https://download.getbukkit.org/spigot/spigot-${MINECRAFT_VERSION}.jar -o spigot.jar

WORKDIR /app

RUN npm i 
RUN chmod -R 770 .

ENTRYPOINT [ "node", "app/main.js" ]