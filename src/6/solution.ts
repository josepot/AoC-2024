import {
  Direction,
  getDirectionWheel,
  getPositionFromKey,
  movePosition,
  turnWheel,
  type Position,
} from "../utils/directions"
import { readGrid } from "../utils/readGrid"

interface Point {
  x: number
  y: number
}

const solution1 = (lines: string[]) => {
  let guardPos: Position = { x: 0, y: 0, key: "0-0" }
  const grid = readGrid(lines, (x, pos) => {
    if (x === "^") guardPos = { ...pos, key: `${pos.x}-${pos.y}` }
    return x === "#"
  })

  const guard = {
    direction: getDirectionWheel(),
    position: guardPos,
  }

  const visited = new Set<string>()
  while (
    guard.position.x > 0 &&
    guard.position.y > 0 &&
    guard.position.x < grid.N_COLS &&
    guard.position.y < grid.N_ROWS
  ) {
    visited.add(guard.position.key)

    const nextPosition = movePosition(guard.position, guard.direction.value)
    if (grid.getCell(nextPosition.x, nextPosition.y)) {
      guard.direction = guard.direction.right
    } else {
      guard.position = nextPosition
    }
  }
  visited.delete(guard.position.key)

  return visited.size
}

const solution2 = (lines: string[]) => {
  let initialGuardPos: Position = { x: 0, y: 0, key: "0-0" }
  const grid = readGrid(lines, (x, pos) => {
    if (x === "^") initialGuardPos = { ...pos, key: `${pos.x}-${pos.y}` }
    return x === "#"
  })

  const getCandidates = () => {
    const guard = {
      direction: getDirectionWheel(),
      position: initialGuardPos,
    }

    const visited = new Set<string>()
    while (
      guard.position.x > 0 &&
      guard.position.y > 0 &&
      guard.position.x < grid.N_COLS &&
      guard.position.y < grid.N_ROWS
    ) {
      visited.add(guard.position.key)

      const nextPosition = movePosition(guard.position, guard.direction.value)
      if (grid.getCell(nextPosition.x, nextPosition.y)) {
        guard.direction = guard.direction.right
      } else {
        guard.position = nextPosition
      }
    }
    visited.delete(guard.position.key)
    return visited
  }

  const isLoop = (position: Position) => {
    const guard = {
      direction: getDirectionWheel(),
      position: initialGuardPos,
    }

    const visited = new Set<string>()
    do {
      const key = guard.position.key + "-" + guard.direction.value
      if (visited.has(key)) return true
      visited.add(key)

      const nextPosition = movePosition(guard.position, guard.direction.value)
      if (
        nextPosition.key === position.key ||
        grid.getCell(nextPosition.x, nextPosition.y)
      )
        guard.direction = guard.direction.right
      else guard.position = nextPosition

      if (
        guard.position.x < 0 ||
        guard.position.y < 0 ||
        guard.position.x >= grid.N_COLS ||
        guard.position.y >= grid.N_ROWS
      )
        return false
    } while (true)
  }

  return [...getCandidates()].map(getPositionFromKey).filter(isLoop).length
}

export default [solution1, solution2]
