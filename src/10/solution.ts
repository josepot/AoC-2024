import { readGrid } from "../utils/readGrid"
import {
  directionDeltas,
  getPositionFromKey,
  type Position,
} from "../utils/directions"
import add from "../utils/add"

const toKey = ({ x, y }: Omit<Position, "key">) => `${x},${y}`

const solution1 = (lines: string[]) => {
  let starts = new Map<string, Set<string>>()
  const grid = readGrid(lines, (pos, { x, y }) => {
    const res = Number(pos)
    const key = toKey({ x, y })
    if (res === 0) starts.set(key, new Set([key]))
    return res
  })

  for (let target = 1; target < 10; target++) {
    const nextStarts = new Map<string, Set<string>>()
    starts.forEach((options, innerKey) => {
      const pos = getPositionFromKey(innerKey)
      Object.values(directionDeltas)
        .map((delta) => {
          const x = delta[0] + pos.x
          const y = delta[1] + pos.y
          const posId = toKey({ x, y })
          return { key: posId, value: grid.getCell(x, y) }
        })
        .filter((x) => x.value === target)
        .forEach((x) => {
          if (nextStarts.has(x.key)) {
            options.forEach((option) => {
              nextStarts.get(x.key)!.add(option)
            })
          } else {
            nextStarts.set(x.key, new Set([...options]))
          }
        })
    })
    starts = nextStarts
  }

  return [...starts.values()].map((x) => x.size).reduce(add)
}

const solution2 = (lines: string[]) => {
  let starts = new Map<string, number>()
  const grid = readGrid(lines, (pos, { x, y }) => {
    const res = Number(pos)
    const key = toKey({ x, y })
    if (res === 0) starts.set(key, 1)
    return res
  })

  for (let target = 1; target < 10; target++) {
    const nextStarts = new Map<string, number>()
    starts.forEach((options, innerKey) => {
      const pos = getPositionFromKey(innerKey)
      Object.values(directionDeltas)
        .map((delta) => {
          const x = delta[0] + pos.x
          const y = delta[1] + pos.y
          const posId = toKey({ x, y })
          return { key: posId, value: grid.getCell(x, y) }
        })
        .filter((x) => x.value === target)
        .forEach((x) => {
          if (nextStarts.has(x.key))
            nextStarts.set(x.key, nextStarts.get(x.key)! + options)
          else nextStarts.set(x.key, options)
        })
    })
    starts = nextStarts
  }

  return [...starts.values()].reduce(add)
}

export default [solution1, solution2]
