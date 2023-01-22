const McProxy = require("./proxy/createProxy.js");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

let localServerOptions = {
  port: "25565",
  version: process.env.MINECRAFT_VERSION,
  "online-mode": false,
  motd: "",
};

let serverList = {
  main: {
    host: "localhost",
    port: 25566,
    isDefault: true,
  },
};

function startServer() {
  return new Promise((resolve) => {
    const server = spawn(
      "java",
      ["-Xmx6G", "-jar", "spigot.jar", "--port", "25566", "--nogui", "--universe", "saves"],
      {
        cwd: path.resolve("./data"),
      }
    );

    server.stdin.pipe(process.stdin);
    server.stdout.pipe(process.stdout);
    server.stderr.pipe(process.stderr);

    server.stdout.on("data", (data) => {
      if (data.toString().match(": Done")) {
        resolve(server);
      }
    });

    return server;
  });
}

let server = null;
let players = new Set();

function checkIdleStatus() {
  if (server && players.size === 0) {
    server.stdin.write("stop\n");
    server.stdin.end();
    server = null;
  }

  setTimeout(() => {
    checkIdleStatus();
  }, 1000 * 60);
}

function playerHasAccess(player) {
  const list = JSON.parse(fs.readFileSync("./data/whitelist.json").toString());
  return !!list.find((p) => p.name === player.username);
}

function createServer() {
  let proxy = McProxy.createProxy(localServerOptions, serverList, {
    autoConnect: false,
    autoFallback: false,
  });

  proxy.on("login", async (player) => {
    console.info(`${player.username} connected from ${player.socket.remoteAddress}`);

    if (!playerHasAccess(player)) {
      return;
    }

    players.add(player);

    player.on("end", () => {
      console.info(`${player.username} disconnected: ${player.socket.remoteAddress}`);
      players.delete(player);
    });

    player.on("error", (err) => {
      console.error(
        `${player.username} disconnected with error: ${player.socket.remoteAddress}`,
        err
      );
      players.delete(player);
    });

    if (!server) {
      server = await startServer();
      console.log("Startup done.");
    }

    setTimeout(() => {
      proxy.setRemoteServer(player.id, "main");
    }, 200);
  });

  proxy.on("listening", () => {
    console.info("Minecraft proxy listening!");
  });
}

function start() {
  try {
    createServer();
  } catch (err) {
    console.error("  ------  ");
    console.error(err);
    console.error("  ------  ");
    console.error("Restarting...");

    setTimeout(() => {
      start();
    }, 1000 * 3);
  }
}

start();
checkIdleStatus();
