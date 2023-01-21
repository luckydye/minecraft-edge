FROM openjdk:19

ENV PORT=25565
ENV EULA=true

ADD ./data /data

WORKDIR /data

RUN touch eula.txt && echo "eula=${EULA}" > eula.txt

ENTRYPOINT [ "./startup.sh" ]