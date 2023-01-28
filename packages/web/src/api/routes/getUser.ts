import { procedure } from "../trpc.js";

interface User {
  id: string;
  name: string;
}

const userList: User[] = [
  {
    id: "1",
    name: "KATT",
  },
];

export default procedure
  .input((val: unknown) => {
    if (typeof val === "string") return val;

    throw new Error(`Invalid input: ${typeof val}`);
  })
  .query((req) => {
    const { input } = req;

    const user = userList.find((u) => u.id === input);

    return user;
  });
