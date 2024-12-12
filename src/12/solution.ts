import { readGrid } from "../utils/readGrid"
import { getPositionFromKey, type Position } from "../utils/directions"
import Queue from "../utils/Queue"
import add from "../utils/add"

const solution1 = (lines: string[]) => {
  const toProcess = new Set<string>()
  const grid = readGrid(lines, (c, { x, y }) => {
    toProcess.add(`${x},${y}`)
    return c
  })

  const groups = new Map<number, Map<string, number>>()
  const posToGroup = new Map<string, number>()

  const createGroup = (id: number, start: Position) => {
    const positions = new Map<string, number>()
    groups.set(id, positions)

    const celType = grid.getCell(start.x, start.y)
    const queue = new Queue(start)
    const inQueue = new Set([start.key])

    while (queue.peek()) {
      const current = queue.pop()!
      toProcess.delete(current.key)
      const { key } = current
      inQueue.delete(key)
      let nFences = 4
      grid.getCrossNeighboursPos(current.x, current.y).forEach((n) => {
        const isSameType = grid.getCell(...n) === celType
        if (!isSameType) return
        nFences--

        const key = n.join(",")
        if (!positions.has(key) && !inQueue.has(key)) {
          inQueue.add(key)
          queue.push({ x: n[0], y: n[1], key })
        }
      })

      posToGroup.set(key, id)
      positions.set(key, nFences)
    }
  }

  let nextGroupId = 0
  while (toProcess.size) {
    createGroup(
      nextGroupId++,
      getPositionFromKey(toProcess.keys().next().value!),
    )
  }

  return [...groups.values()]
    .map((g) => {
      const totalFences = [...g.values()].reduce(add, 0)
      const size = g.size
      return totalFences * size
    })
    .reduce(add)
}

const solution2 = (lines: string[]) => {
  const toProcess = new Set<string>()
  const grid = readGrid(lines, (c, { x, y }) => {
    toProcess.add(`${x},${y}`)
    return c
  })

  const createGroup = (start: Position) => {
    const positions = new Set<string>()

    const celType = grid.getCell(start.x, start.y)
    const queue = new Queue(start)
    const inQueue = new Set([start.key])

    let nAngles = 0
    while (queue.peek()) {
      const current = queue.pop()!
      toProcess.delete(current.key)
      const { key } = current
      inQueue.delete(key)

      const top = grid.getCell(current.x, current.y - 1)
      const bottom = grid.getCell(current.x, current.y + 1)
      const left = grid.getCell(current.x - 1, current.y)
      const right = grid.getCell(current.x + 1, current.y)

      if (
        (top !== celType && left !== celType) ||
        (top === celType &&
          left === celType &&
          grid.getCell(current.x - 1, current.y - 1) !== celType)
      )
        nAngles++
      if (
        (top !== celType && right !== celType) ||
        (top === celType &&
          right === celType &&
          grid.getCell(current.x + 1, current.y - 1) !== celType)
      )
        nAngles++
      if (
        (bottom !== celType && left !== celType) ||
        (bottom === celType &&
          left === celType &&
          grid.getCell(current.x - 1, current.y + 1) !== celType)
      )
        nAngles++
      if (
        (bottom !== celType && right !== celType) ||
        (bottom === celType &&
          right === celType &&
          grid.getCell(current.x + 1, current.y + 1) !== celType)
      )
        nAngles++

      grid.getCrossNeighboursPos(current.x, current.y).forEach((n) => {
        const isSameType = grid.getCell(...n) === celType
        if (!isSameType) return

        const key = n.join(",")
        if (!positions.has(key) && !inQueue.has(key)) {
          inQueue.add(key)
          queue.push({ x: n[0], y: n[1], key })
        }
      })

      positions.add(key)
    }
    return positions.size * nAngles
  }

  let total = 0
  while (toProcess.size) {
    total += createGroup(getPositionFromKey(toProcess.keys().next().value!))
  }
  return total
}

export default [solution1, solution2]
