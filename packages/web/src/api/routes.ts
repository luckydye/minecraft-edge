import { router } from "./trpc.js";

import getUser from "./routes/getUser.js";

export const appRouter = router({
  userById: getUser,
});

export type AppRouter = typeof appRouter;
