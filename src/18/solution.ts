import binarySearch from "../utils/binarySearch"
import { directionDeltas } from "../utils/directions"
import graphDistinctSearch from "../utils/graphDistinctSearch"
import graphSearch from "../utils/graphSearch"

const solution1 = (lines: string[]) => {
  const input = lines.slice(0, 1024)
  const corrupted = new Set<string>(input)
  const size = 71

  return graphDistinctSearch(
    {
      id: "0,0",
      x: 0,
      y: 0,
      nSteps: 0,
    },
    (node) => {
      if (node.x === size - 1 && node.y === size - 1) return true

      return Object.values(directionDeltas)
        .map(([xD, yD]) => {
          const x = node.x + xD
          const y = node.y + yD
          return { x, y, id: `${x},${y}`, nSteps: node.nSteps + 1 }
        })
        .filter((n) => {
          return (
            n.x >= 0 &&
            n.x < size &&
            n.y >= 0 &&
            n.y < size &&
            !corrupted.has(n.id)
          )
        })
    },
    (a, b) => b.nSteps - a.nSteps,
  ).nSteps
}

const hasPath = (lines: string[], len: number) => {
  const input = lines.slice(0, len)
  const corrupted = new Set<string>(input)
  const size = 71

  try {
    graphDistinctSearch(
      {
        id: "0,0",
        x: 0,
        y: 0,
        nSteps: 0,
      },
      (node) => {
        if (node.x === size - 1 && node.y === size - 1) return true

        return Object.values(directionDeltas)
          .map(([xD, yD]) => {
            const x = node.x + xD
            const y = node.y + yD
            return { x, y, id: `${x},${y}`, nSteps: node.nSteps + 1 }
          })
          .filter((n) => {
            return (
              n.x >= 0 &&
              n.x < size &&
              n.y >= 0 &&
              n.y < size &&
              !corrupted.has(n.id)
            )
          })
      },
      (a, b) => b.nSteps - a.nSteps,
    )
    return true
  } catch {
    return false
  }
}

const solution2 = (lines: string[]) => {
  return lines[
    binarySearch(
      (idx) => (hasPath(lines, idx) ? -1 : 1),
      0,
      lines.length - 1,
      false,
    )
  ]
}

export default [solution1, solution2]
