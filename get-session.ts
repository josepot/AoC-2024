import { readFile } from "fs/promises"

export const getSession = () =>
  readFile(`.session`, "utf-8")
    .then((x) => x.replace("\n", ""))
    .catch(() => "")
