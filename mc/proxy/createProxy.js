// https://github.com/darcros/node-minecraft-proxy

import NodeRSA from "node-rsa";

import Proxy from "./Proxy.js";
import minecraftData from "minecraft-data";

const localServerPlugins = [];

const proxyPlugins = [
  function handleCommands(client, proxy, localServerOptions, proxyOptions) {
    client.on("chat", (data, metadata) => {
      let split = data.message.split(" ");
      if (split[0] === "/server") {
        if (proxy.serverList[split[1]]) {
          proxy.setRemoteServer(client.id, split[1]);
        } else {
          const msg = {
            color: "red",
            translate: "commands.generic.selector_argument",
            with: [split[1]],
          };
          client.write("chat", { message: JSON.stringify(msg), position: 0 });
        }
      }
    });
  },
];

/**
 * Create a new proxy
 * @param {Object} localServerOptions Settings for the minecraft-protocol server
 * @param {Object} serverList An object that maps a 'serverName' to the server info
 * @returns {MinecraftProxy} A new Minecraft proxy
 */
export function createProxy(localServerOptions = {}, serverList = {}, proxyOptions = {}) {
  const {
    host = "0.0.0.0",
    "server-port": serverPort,
    port = serverPort || 25565,
    motd = "A Minecraft server",
    "max-players": maxPlayers = 69,
    version,
    favicon,
    customPackets,
  } = localServerOptions;

  const { enablePlugins = true } = proxyOptions;

  const mcData = minecraftData(version);
  const mcversion = mcData.version;

  const serverOptions = {
    version: mcversion.minecraftVersion,
    customPackets: customPackets,
  };

  const proxy = new Proxy(serverOptions, serverList, proxyOptions);
  proxy.mcversion = mcversion;
  proxy.motd = motd;
  proxy.maxPlayers = maxPlayers;
  proxy.playerCount = 0;
  proxy.onlineModeExceptions = {};
  proxy.favicon = favicon;
  proxy.serverKey = new NodeRSA({ b: 1024 });

  proxy.on("connection", function (client) {
    localServerPlugins.forEach((plugin) => plugin(client, proxy, localServerOptions, proxyOptions));
    if (enablePlugins)
      proxyPlugins.forEach((plugin) => plugin(client, proxy, localServerOptions, proxyOptions));
  });

  proxy.listen(port, host);
  return proxy;
}
