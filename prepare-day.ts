import { writeFile, existsSync, mkdirSync } from "fs"

const relPath = import.meta.dir
const [, , day_] = process.argv
const now = new Date()

const day = day_ || now.getDate()

const dayFolder = `${relPath}/src/${day}`
if (!existsSync(dayFolder)) {
  mkdirSync(dayFolder, { recursive: true })
}

const template = `const solution1 = (lines: string[]) => {

}

const solution2 = (lines: string[]) => {

}

export default [solution1]
`

writeFile(dayFolder + "/solution.ts", template, () => {})
