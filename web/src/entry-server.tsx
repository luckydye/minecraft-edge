import { StartServer, createHandler, renderAsync } from "solid-start/entry-server";

import mc from "../../mc/main.js";

mc.start();

export default createHandler(renderAsync((event) => <StartServer event={event} />));
