import { readGrid } from "../utils/readGrid"
import {
  Direction,
  directionDeltas,
  getDirectionWheel,
  type Position,
  type NextDirection,
} from "../utils/directions"
import graphDistinctSearch from "../utils/graphDistinctSearch"
import graphSearch from "../utils/graphSearch"

const directionIds: Record<Direction, string> = {
  [Direction.RIGHT]: ",R",
  [Direction.LEFT]: ",L",
  [Direction.UP]: ",U",
  [Direction.DOWN]: ",D",
}

const solution1 = (lines: string[]) => {
  const toKey = ({ x, y }: { x: number; y: number }) => `${x},${y}`

  let start: Position
  let end: Position
  const grid = readGrid(lines, (x, p) => {
    if (x === "#") return "#" as const
    if (x === "S") {
      start = { ...p, key: toKey(p) }
    }
    if (x === "E") {
      end = { ...p, key: toKey(p) }
    }
    return "." as const
  })

  const directionWheel = getDirectionWheel()

  type Node = {
    id: string
    pos: Position
    score: number
    direction: NextDirection
  }

  return graphDistinctSearch<Node>(
    {
      id: start!.key + ",R",
      pos: start!,
      score: 0,
      direction: directionWheel.right,
    },
    (current) => {
      if (current.pos.key === end!.key) return true
      const result: Array<Node> = []

      const { x, y } = current.pos
      let [xDelta, yDelta] = directionDeltas[current.direction.value]
      let nextPos = {
        x: x + xDelta,
        y: y + yDelta,
        key: toKey({ x: x + xDelta, y: y + yDelta }),
      }

      if (grid.getCell(nextPos.x, nextPos.y) === ".")
        result.push({
          ...current,
          id: nextPos.key + directionIds[current.direction.value],
          pos: nextPos,
          score: current.score + 1,
        })

        // RIGHT
      ;[xDelta, yDelta] = directionDeltas[current.direction.right.value]
      nextPos = {
        x: x + xDelta,
        y: y + yDelta,
        key: toKey({ x: x + xDelta, y: y + yDelta }),
      }
      if (grid.getCell(nextPos.x, nextPos.y) === ".")
        result.push({
          id: nextPos.key + directionIds[current.direction.right.value],
          pos: nextPos,
          score: current.score + 1001,
          direction: current.direction.right,
        })

        // LEFT
      ;[xDelta, yDelta] = directionDeltas[current.direction.left.value]
      nextPos = {
        x: x + xDelta,
        y: y + yDelta,
        key: toKey({ x: x + xDelta, y: y + yDelta }),
      }
      if (grid.getCell(nextPos.x, nextPos.y) === ".")
        result.push({
          id: nextPos.key + directionIds[current.direction.left.value],
          pos: nextPos,
          score: current.score + 1001,
          direction: current.direction.left,
        })

      return result
    },
    (a, b) => b.score - a.score,
  ).score
}

const solution2 = (lines: string[]) => {
  const toKey = ({ x, y }: { x: number; y: number }) => `${x},${y}`

  let start: Position
  let end: Position
  const grid = readGrid(lines, (x, p) => {
    if (x === "#") return "#" as const
    if (x === "S") {
      start = { ...p, key: toKey(p) }
    }
    if (x === "E") {
      end = { ...p, key: toKey(p) }
    }
    return "." as const
  })

  const directionWheel = getDirectionWheel()

  type Node = {
    id: string
    pos: Position
    score: number
    direction: NextDirection
    prev?: Node
  }

  const getNext = (current: Node): Node[] => {
    if (current.score > targetScore) {
      return []
    }

    if (current.pos.key === end!.key) {
      targetScore = current.score
      return []
    }

    const result: Array<Node> = []
    const { x, y } = current.pos
    let [xDelta, yDelta] = directionDeltas[current.direction.value]
    let nextPos = {
      x: x + xDelta,
      y: y + yDelta,
      key: toKey({ x: x + xDelta, y: y + yDelta }),
    }

    if (grid.getCell(nextPos.x, nextPos.y) === ".")
      result.push({
        ...current,
        id: nextPos.key + directionIds[current.direction.value],
        pos: nextPos,
        score: current.score + 1,
        prev: current,
      })

      // RIGHT
    ;[xDelta, yDelta] = directionDeltas[current.direction.right.value]
    nextPos = {
      x: x + xDelta,
      y: y + yDelta,
      key: toKey({ x: x + xDelta, y: y + yDelta }),
    }
    if (grid.getCell(nextPos.x, nextPos.y) === ".")
      result.push({
        id: nextPos.key + directionIds[current.direction.right.value],
        pos: nextPos,
        score: current.score + 1001,
        direction: current.direction.right,
        prev: current,
      })

      // LEFT
    ;[xDelta, yDelta] = directionDeltas[current.direction.left.value]
    nextPos = {
      x: x + xDelta,
      y: y + yDelta,
      key: toKey({ x: x + xDelta, y: y + yDelta }),
    }
    if (grid.getCell(nextPos.x, nextPos.y) === ".")
      result.push({
        id: nextPos.key + directionIds[current.direction.left.value],
        pos: nextPos,
        score: current.score + 1001,
        direction: current.direction.left,
        prev: current,
      })

    return result
  }

  let targetScore = Infinity
  const initial: Node = {
    id: start!.key + ",R",
    pos: start!,
    score: 0,
    direction: directionWheel.right,
  }
  const analyzed = new Map<string, Node[]>([[initial.id, [initial]]])

  try {
    graphSearch<Node>(
      initial,
      (node) => {
        const result = getNext(node)
        let actualResult: Node[] = []
        result.forEach((n) => {
          if (!analyzed.has(n.id)) {
            analyzed.set(n.id, [n])
            actualResult.push(n)
          } else {
            const current = analyzed.get(n.id)!
            if (current[0].score === n.score) current.push(n)
          }
        })
        return actualResult
      },
      (a, b) => b.score - a.score,
    )
  } catch {}

  const result = new Set<string>()
  const traverse = (n: Node) => {
    result.add(n.pos.key)
    if (!n.prev) return
    const others = analyzed.get(n.prev.id) ?? []
    others.forEach(traverse)
  }

  analyzed.get(end!.key + ",R")?.forEach(traverse)
  analyzed.get(end!.key + ",L")?.forEach(traverse)
  analyzed.get(end!.key + ",U")?.forEach(traverse)
  analyzed.get(end!.key + ",D")?.forEach(traverse)

  return result.size
}

export default [solution1, solution2]
