import { readGrid } from "../utils/readGrid"
import { Direction, directionDeltas, type Position } from "../utils/directions"

const toKey = ({ x, y }: { x: number; y: number }) => `${x},${y}`

const solution1 = (lines: string[]) => {
  const raw0 = lines.slice(0, 50)
  const raw1 = lines.slice(51)

  let me: Position = { x: 0, y: 0, key: "0,0" }
  const grid = readGrid(raw0, (i, pos) => {
    if (i === "@") me = { ...pos, key: toKey(pos) }
    if (i === "#") return "#" as const
    if (i === "O") return "O" as const
    return "." as const
  })

  const moves = raw1
    .join("")
    .split("")
    .map((x) => {
      const d =
        x === ">"
          ? Direction.RIGHT
          : x === "<"
            ? Direction.LEFT
            : x === "^"
              ? Direction.UP
              : Direction.DOWN
      return directionDeltas[d]
    })

  const moveBox = (boxPos: Position, [x, y]: [number, number]): boolean => {
    let nextPos = { x: boxPos.x + x, y: boxPos.y + y, key: "" }
    let next = grid.getCell(nextPos.x, nextPos.y)
    if (next === "O") {
      if (moveBox(nextPos, [x, y])) {
        grid.data[nextPos.y][nextPos.x] = "O"
        grid.data[boxPos.y][boxPos.x] = "."
        return true
      }
      return false
    }
    if (next === ".") {
      grid.data[nextPos.y][nextPos.x] = "O"
      grid.data[boxPos.y][boxPos.x] = "."
      return true
    }
    return false
  }

  const move = ([x, y]: [number, number]) => {
    let nextPos = { x: me.x + x, y: me.y + y, key: "" }
    nextPos.key = toKey(nextPos)

    let next = grid.getCell(nextPos.x, nextPos.y)
    if (next === ".") {
      me = nextPos
      return
    }
    if (next === "#") return
    if (moveBox(nextPos, [x, y])) {
      me = nextPos
    }
  }

  moves.forEach(move)

  // console.log(grid.data.map((x) => x.join("")).join("\n"))

  let result = 0
  grid.data.forEach((line, y) =>
    line.forEach((b, x) => {
      if (b === "O") {
        result += y * 100 + x
      }
    }),
  )
  return result
}

const solution2 = (lines: string[]) => {
  const _raw0 = lines.slice(0, 50)
  const raw1 = lines.slice(51)
  const raw0 = _raw0.map((line) => {
    const parts = line.split("")
    const result: Array<string> = []
    parts.forEach((p) => {
      if (p === "#") result.push("#", "#")
      else if (p === ".") result.push(".", ".")
      else if (p === "@") result.push("@", ".")
      else result.push("[", "]")
    })
    return result.join("")
  })

  let me: Position = { x: 0, y: 0, key: "0,0" }
  const grid = readGrid(raw0, (i, pos) => {
    if (i === "@") me = { ...pos, key: toKey(pos) }
    if (i === "#") return "#" as const
    if (i === "[") return "[" as const
    if (i === "]") return "]" as const
    return "." as const
  })

  const movesRaw = raw1.join("").split("")
  const moves = movesRaw.map((x) => {
    const d =
      x === ">"
        ? Direction.RIGHT
        : x === "<"
          ? Direction.LEFT
          : x === "^"
            ? Direction.UP
            : Direction.DOWN
    return directionDeltas[d]
  })

  const moveBoxH = (boxPos: Position, x: number) => {
    const nextPos = { ...boxPos, x: boxPos.x + x }
    let nextVal = grid.getCell(nextPos.x, nextPos.y)

    if (nextVal === "]" || nextVal === "[") moveBoxH(nextPos, x)

    if (grid.getCell(nextPos.x, nextPos.y) === ".") {
      grid.data[nextPos.y][nextPos.x] = grid.getCell(boxPos.x, boxPos.y)
      grid.data[boxPos.y][boxPos.x] = "."
    }
  }

  const canMoveV = (fromLeft: Position, yDelta: number): boolean => {
    const nextL = { ...fromLeft, y: fromLeft.y + yDelta }
    let nextLv = grid.getCell(nextL.x, nextL.y)
    let nextRv = grid.getCell(nextL.x + 1, nextL.y)

    if (nextLv === "." && nextRv === ".") return true
    if (nextLv === "#" || nextRv === "#") return false

    if (nextLv === "[") return canMoveV(nextL, yDelta)

    if (nextLv === "]" && nextRv === "[") {
      return (
        canMoveV(
          {
            x: nextL.x - 1,
            y: nextL.y,
            key: "",
          },
          yDelta,
        ) &&
        canMoveV(
          {
            x: nextL.x + 1,
            y: nextL.y,
            key: "",
          },
          yDelta,
        )
      )
    }

    if (nextLv === "]") {
      return canMoveV({ ...nextL, x: nextL.x - 1 }, yDelta)
    }
    if (nextRv === "[") return canMoveV({ ...nextL, x: nextL.x + 1 }, yDelta)

    return false
  }

  const moveVerticalRecursive = (fromLeft: Position, yDelta: number): void => {
    const nextL = { ...fromLeft, y: fromLeft.y + yDelta }
    let nextLv = grid.getCell(nextL.x, nextL.y)
    let nextRv = grid.getCell(nextL.x + 1, nextL.y)

    if (nextLv === "[") moveVerticalRecursive(nextL, yDelta)
    else if (nextLv === "]" && nextRv === "[") {
      moveVerticalRecursive(
        {
          x: nextL.x - 1,
          y: nextL.y,
          key: "",
        },
        yDelta,
      )
      moveVerticalRecursive(
        {
          x: nextL.x + 1,
          y: nextL.y,
          key: "",
        },
        yDelta,
      )
    } else if (nextLv === "]")
      moveVerticalRecursive({ ...nextL, x: nextL.x - 1 }, yDelta)
    else if (nextRv === "[")
      moveVerticalRecursive({ ...nextL, x: nextL.x + 1 }, yDelta)

    grid.data[nextL.y][nextL.x] = "["
    grid.data[nextL.y][nextL.x + 1] = "]"
    grid.data[fromLeft.y][fromLeft.x] = "."
    grid.data[fromLeft.y][fromLeft.x + 1] = "."
    return
  }

  const move = ([x, y]: [number, number]) => {
    let nextPos = { x: me.x + x, y: me.y + y, key: "" }
    nextPos.key = toKey(nextPos)

    let next = grid.getCell(nextPos.x, nextPos.y)
    if (next === ".") {
      me = nextPos
      return
    }
    if (next === "#") return

    if (x !== 0) {
      moveBoxH(nextPos, x)
      next = grid.getCell(nextPos.x, nextPos.y)
      if (next === ".") me = nextPos
    } else if (x === 0) {
      if (next === "[" && canMoveV(nextPos, y)) {
        moveVerticalRecursive(nextPos, y)
        me = nextPos
      }
      if (next === "]" && canMoveV({ ...nextPos, x: nextPos.x - 1 }, y)) {
        moveVerticalRecursive({ ...nextPos, x: nextPos.x - 1 }, y)
        me = nextPos
      }
    }
  }

  moves.forEach((m, idx) => {
    move(m)

    /*
    console.log(movesRaw[idx])
    console.log(
      grid.data
        .map((line, y) =>
          line.map((v, x) => (x === me.x && y === me.y ? "@" : v)).join(""),
        )
        .join("\n"),
    )
    */
  })

  let result = 0
  grid.data.forEach((line, y) =>
    line.forEach((b, x) => {
      if (b === "[") {
        result += y * 100 + x
      }
    }),
  )
  return result
}

export default [solution1, solution2]
