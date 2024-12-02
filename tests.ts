import readline from "readline"
import { existsSync } from "fs"
import { readFile } from "fs/promises"

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})
const askQuestion = (x: string) =>
  new Promise<string>((res) => rl.question(x, res))

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

async function manualCheck(expected: string, output: string) {
  console.log("")
  console.log(`expected: ${expected}`)
  console.log(`received:\n${output}`)
  const response = await askQuestion("is it correct?(y)")
  console.log("")
  return !response || response.toUpperCase() === "Y"
}

Promise.all(
  Array(25)
    .fill(null)
    .map((_, idx) => idx + 1)
    .filter((day) => existsSync(`./src/${day}/outputs`))
    .map((day) =>
      Promise.all([
        readFile(`./src/${day}/input`, "utf-8").then(getInput),
        readFile(`./src/${day}/outputs`, "utf-8").then(getInput),
      ]).then(async ([lines, outputs]) => {
        const fns: [
          (lines: string[]) => string | Promise<string>,
          (lines: string[]) => string | Promise<string>,
        ] = (await import(`./src/${day}/solution.ts`)).default
        return Promise.all(
          fns
            .map((fn) => fn(lines.slice(0) as any))
            .map((x) => (x instanceof Promise ? x : Promise.resolve(x)))
            .map(async (p, idx) => {
              const received = await p.then((x) => x.toString())
              const expected = outputs[idx]

              if (received.indexOf("\n") > -1)
                return [day, idx, expected, received]

              if (received === expected) {
                console.log("\x1b[32m", `Day ${day} part ${idx + 1} ok`)
              } else {
                console.log("\x1b[31m", `Day ${day} part ${idx + 1} ko`)
              }
            }),
        ).then((results) => results.filter(Boolean))
      }),
    ),
).then(async (x) => {
  const manualChecks = x.filter((x) => x.length > 0).flat()
  for (let i = 0; i < manualChecks.length; i++) {
    const [day, idx, expected, received] = manualChecks[i] as any
    const isOk = await manualCheck(expected, received)
    if (isOk) {
      console.log("\x1b[32m", `Day ${day} part ${idx + 1} ok`)
    } else {
      console.log("\x1b[31m", `Day ${day} part ${idx + 1} ko`)
    }
  }
  rl.close()
})
