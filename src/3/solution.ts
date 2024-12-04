import add from "../utils/add"

const solution1 = (lines: string[]) =>
  lines
    .map((x) =>
      x
        .match(/mul\(\d\d?\d?,\d\d?\d?\)/gm)!
        .map((i) =>
          i
            .slice(4)
            .slice(0, -1)
            .split(",")
            .map(Number)
            .reduce((a, b) => a * b),
        )
        .flat(),
    )
    .flat()
    .reduce(add)

const solution2 = (lines: string[]) => {
  let enabled = true
  return lines
    .map((line) => {
      let res = 0
      line
        .match(/(mul\(\d\d?\d?,\d\d?\d?\))|(do\(\))|(don't\(\))/gm)!
        .map((m) => {
          if (m.startsWith("do")) {
            return m === "do()"
          } else {
            return m
              .slice(4)
              .slice(0, -1)
              .split(",")
              .map(Number)
              .reduce((a, b) => a * b)
          }
        })
        .forEach((x) => {
          if (typeof x === "boolean") enabled = x
          else if (enabled) res += x
        })
      return res
    })
    .reduce(add)
}

export default [solution1, solution2]
