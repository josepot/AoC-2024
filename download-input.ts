const now = new Date()
import { createWriteStream } from "fs"
import { get } from "https"
import type { Stream } from "stream"
import { getSession } from "./get-session"
import type { IncomingMessage } from "http"

const [, , day_, year_] = process.argv
const year = year_ || now.getFullYear()
const day = day_ || now.getDate()

const getFile = (session: string) =>
  new Promise<IncomingMessage>((resolve, reject) =>
    get(
      {
        hostname: "adventofcode.com",
        path: `/${year}/day/${day}/input`,
        method: "GET",
        headers: {
          Cookie: `session=${session}`,
        },
      },
      resolve,
    ).on("error", reject),
  )

const relPath = import.meta.dir
const writeFile = (stream: Stream) =>
  new Promise((resolve, reject) => {
    const file = createWriteStream(`${relPath}/src/${day}/input`)
    stream.pipe(file)
    file.on("finish", file.close.bind(file, resolve))
    file.on("error", reject)
  })

getSession()
  .then(getFile)
  .then(writeFile)
  .catch((e) => {
    console.log("Error downloading the file")
    console.log(e)
  })
