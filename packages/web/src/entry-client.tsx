import { mount, StartClient } from "solid-start/entry-client";
import trpc from "./api/client.js";

mount(() => <StartClient />, document);

trpc.userById.query("1").then((res) => {
  console.log(res);
});
