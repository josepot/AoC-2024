import { readFileSync } from "fs"
import { createInterface } from "readline/promises"

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
})

const WIDTH = 101
const HEIGHT = 103
const solution1 = (lines: string[]) => {
  const rawRobots = lines.map(
    (line) =>
      line
        .split(" ")
        .map((x) => x.slice(2).split(",").map(Number) as [number, number]) as [
        [number, number],
        [number, number],
      ],
  )

  for (let i = 0; i < 100; i++) {
    rawRobots.forEach((robot, idx) => {
      if (idx == 0) console.log(robot)
      robot[0][0] += robot[1][0]
      if (robot[0][0] >= WIDTH) robot[0][0] -= WIDTH
      if (robot[0][0] < 0) robot[0][0] += WIDTH

      robot[0][1] += robot[1][1]
      if (robot[0][1] >= HEIGHT) robot[0][1] -= HEIGHT
      if (robot[0][1] < 0) robot[0][1] += HEIGHT
    })
  }

  const quadrants: number[] = [0, 0, 0, 0]
  rawRobots.forEach(([[x, y]]) => {
    if (x === Math.floor(WIDTH / 2) || y === Math.floor(HEIGHT / 2)) return

    let pos = x > WIDTH / 2 ? 1 : 0
    if (y > HEIGHT / 2) pos += 2
    ;(quadrants as any)[pos]++
  })

  return quadrants.reduce((a, b) => a * b)
}

const solution2 = async (lines: string[]) => {
  const rawRobots = lines.map(
    (line) =>
      line
        .split(" ")
        .map((x) => x.slice(2).split(",").map(Number) as [number, number]) as [
        [number, number],
        [number, number],
      ],
  )

  for (let i = 0; i < Infinity; i++) {
    const picture: string[][] = Array(HEIGHT)
      .fill(null)
      .map(() => Array(WIDTH).fill(" "))

    rawRobots.forEach((robot, idx) => {
      robot[0][0] += robot[1][0]
      if (robot[0][0] >= WIDTH) robot[0][0] -= WIDTH
      if (robot[0][0] < 0) robot[0][0] += WIDTH

      robot[0][1] += robot[1][1]
      if (robot[0][1] >= HEIGHT) robot[0][1] -= HEIGHT
      if (robot[0][1] < 0) robot[0][1] += HEIGHT

      picture[robot[0][1] as any][robot[0][0] as any] = "x"
    })

    let totalDistances = 0
    for (let y = 0; y < HEIGHT; y++) {
      for (let x = 0; x < WIDTH; x++) {
        if (picture[y][x] === " ") continue
        if (picture[y]?.[x - 1] === "x") totalDistances++
        if (picture[y]?.[x + 1] === "x") totalDistances++
        if (picture[y + 1]?.[x] === "x") totalDistances++
        if (picture[y - 1]?.[x] === "x") totalDistances++
      }
    }

    if (totalDistances > 250) {
      console.clear()
      console.log(picture.map((line) => line.join("")).join("\n"))
      console.log(i)

      await rl.question("")
    }
  }

  const quadrants: number[] = [0, 0, 0, 0]
  rawRobots.forEach(([[x, y]]) => {
    if (x === Math.floor(WIDTH / 2) || y === Math.floor(HEIGHT / 2)) return

    let pos = x > WIDTH / 2 ? 1 : 0
    if (y > HEIGHT / 2) pos += 2
    ;(quadrants as any)[pos]++
  })

  return quadrants.reduce((a, b) => a * b)
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
const lines = readFileSync("./input", { encoding: "utf8" })
solution2(getInput(lines) as any)
