import readline from "readline"
import { readFile, writeFile } from "fs/promises"
import path from "path"
import https from "https"
import qs from "querystring"
import { getSession } from "./get-session"
import { isObservable } from "rxjs"

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})
const askQuestion = (x: string) =>
  new Promise<string>((res) => rl.question(x, res))

const relPath = path.resolve(__dirname)

const [cmdName, , day_, idx] = process.argv
const day = day_ || new Date().getDate()

const dayPath = `${relPath}/src/${day}`

const fns: [
  (lines: string[]) => string | Promise<string>,
  (lines: string[]) => string | Promise<string>,
] = (await import(`./src/${day}/solution.ts`)).default

console.log("fns", fns)

const fn =
  idx !== undefined ? fns[Number(idx)] : fns.filter(Boolean).slice(-1)[0]

const updateOutputs = async (idx: number, answer: string) => {
  const filePath = `${dayPath}/outputs`
  const currentOutput = await readFile(filePath, "utf-8")
  const currentParts = currentOutput.split("\n")
  const output = Array(2)
    .fill(null)
    .map((_, index) => (index === idx ? answer : currentParts[index]))
    .filter((x) => x !== undefined)
    .join("\n")
  return writeFile(filePath, output)
}

const submitSolution = async (
  solution: string,
  level: number,
  session: string,
  year: number,
) => {
  console.log(
    `Submitting solution ${solution} for day: ${day}, part: ${level}, year: ${year}`,
  )
  const postData = qs.stringify({
    level,
    answer: solution,
  })

  const result = await new Promise<string>((resolve, reject) => {
    const request = https.request(
      {
        hostname: "adventofcode.com",
        path: `/${year}/day/${day}/answer`,
        port: 443,
        method: "POST",
        headers: {
          Cookie: `session=${session}`,
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": postData.length,
        },
      },
      (res) => {
        let result = ""
        res.on("data", function (chunk) {
          result += chunk
        })
        res.on("end", function () {
          resolve(result)
        })
        res.on("error", function (err) {
          reject(err)
        })
      },
    )
    request.write(postData)
    request.end()
  })

  const [, main] = result.match(/<main>((.|\n)*)<\/main>/)!

  if (main.includes("That's the right answer!")) {
    console.log("\x1b[32m", "That's right!")
    return updateOutputs(level - 1, solution)
  }

  const wrongMatch = main.match(
    /That's not the right answer;?\s?((.|\n)*)If you're stuck/,
  )
  if (wrongMatch) {
    return console.log("\x1b[31m", `Wrong! ${wrongMatch[1]}`)
  }

  const waitMatch = main.match(/You\shave\s(\d*)s\sleft\sto\swait/)

  if (waitMatch) {
    const secsToWait = Number(waitMatch[1])
    console.log(`Waiting ${secsToWait} seconds before re-submitting...`)
    await new Promise((res) => setTimeout(res, secsToWait * 1000))
    return await submitSolution(solution, level, session, year)
  }

  console.log(main)
}

const defaultPart = Array.isArray(fns) && fns.length

const submit = async (solution: string) => {
  try {
    const session = await getSession()
    if (!session) return

    const part_ = await askQuestion(`submit part? (${defaultPart})`)
    const part = !part_ ? defaultPart : Number(part_)
    if (Number.isNaN(part)) return

    const defaultYear = new Date().getFullYear()
    const year_ = await askQuestion(`year? (${defaultYear})`)
    const year = !year_ ? defaultYear : year_

    await submitSolution(solution, part as number, session, year as number)
  } finally {
    rl.close()
  }
}

const getInput = (text: string) => {
  const lines = text.split("\n")
  let input
  if (lines.length > 2) {
    lines.splice(-1, 1)
    input = lines
  } else {
    input = lines[0]
  }
  return input
}

readFile(`${dayPath}/input`, "utf-8")
  .then(getInput)
  .then((input) => {
    const start = Date.now()
    const result = fn(input as any)
    const end = Date.now()

    if (isObservable(result)) {
      return result.subscribe(console.log, console.error)
    }
    console.log(result)
    console.log(`Solved in ${end - start}ms`)
    return result
  })
  .then(submit as any)
