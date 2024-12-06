// 'XMAS'

const TARGET = "XMAS"
const solution1 = (lines: string[]) => {
  const chars = lines.map((line) => line.split(""))
  const findXmasDirection = (
    from: {
      x: number
      y: number
    },
    deltas: {
      x: 0 | 1 | -1
      y: 0 | 1 | -1
    },
    pos: number = 0,
  ) => {
    if (pos === TARGET.length) return true
    if (from.y === undefined || from.x === undefined) return false
    if (chars[from.y]?.[from.x] === TARGET[pos])
      return findXmasDirection(
        {
          x: from.x + deltas.x,
          y: from.y + deltas.y,
        },
        deltas,
        pos + 1,
      )
  }
  const DELTAS: Array<{
    x: 0 | 1 | -1
    y: 0 | 1 | -1
  }> = [
    { x: 0, y: 1 },
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 1, y: -1 },
    { x: -1, y: 0 },
    { x: -1, y: 1 },
    { x: -1, y: -1 },
  ]

  const findXmas = (x: number, y: number) => {
    return DELTAS.map((deltas) => findXmasDirection({ x, y }, deltas)).filter(
      Boolean,
    ).length
  }

  let total = 0
  for (let y = 0; y < chars.length; y++) {
    for (let x = 0; x < chars[y].length; x++) {
      total += findXmas(x, y)
    }
  }

  return total
}

const solution2 = (lines: string[]) => {
  const chars = lines.map((line) => line.split(""))

  const findXmas = (x: number, y: number) => {
    const char = chars[y]?.[x]
    if (char !== "A") return 0

    const left: [string, string] = [
      chars[y - 1]?.[x - 1],
      chars[y + 1]?.[x - 1],
    ]
    const right: [string, string] = [
      chars[y - 1]?.[x + 1],
      chars[y + 1]?.[x + 1],
    ]
    const top: [string, string] = [chars[y - 1]?.[x - 1], chars[y - 1]?.[x + 1]]
    const bottom: [string, string] = [
      chars[y + 1]?.[x + 1],
      chars[y + 1]?.[x - 1],
    ]

    if (![left, right, top, bottom].flat().every((x) => x === "S" || x === "M"))
      return 0

    let total = 0
    if (left[0] === left[1] && right[0] === right[1] && left[0] !== right[0])
      total++
    if (top[0] === top[1] && bottom[0] === bottom[1] && top[0] !== bottom[0])
      total++
    return total
  }

  let total = 0
  for (let y = 0; y < chars.length; y++) {
    for (let x = 0; x < chars[y].length; x++) {
      total += findXmas(x, y)
    }
  }

  return total
}

export default [solution1, solution2]
