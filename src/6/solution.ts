import {
  getDirectionWheel,
  getPositionFromKey,
  movePosition,
  type Position,
} from "../utils/directions"
import { readGrid } from "../utils/readGrid"

const getSharedInfo = (lines: string[]) => {
  let initialGuardPos: Position = { x: 0, y: 0, key: "0,0" }
  const grid = readGrid(lines, (x, pos) => {
    if (x === "^") initialGuardPos = { ...pos, key: `${pos.x},${pos.y}` }
    return x === "#"
  })

  const getCandidates = () => {
    const guard = {
      direction: getDirectionWheel(),
      position: initialGuardPos,
    }

    const visited = new Set<string>()
    do {
      visited.add(guard.position.key)
      const nextPosition = movePosition(guard.position, guard.direction.value)
      if (grid.getCell(nextPosition.x, nextPosition.y))
        guard.direction = guard.direction.right
      else guard.position = nextPosition
    } while (
      guard.position.x > 0 &&
      guard.position.y > 0 &&
      guard.position.x < grid.N_COLS &&
      guard.position.y < grid.N_ROWS
    )
    return visited
  }

  return {
    candidates: getCandidates(),
    grid,
    initialGuard: {
      direction: getDirectionWheel(),
      position: initialGuardPos,
    },
  }
}

const solution1 = (lines: string[]) => getSharedInfo(lines).candidates.size
const solution2 = (lines: string[]) => {
  const { grid, candidates, initialGuard } = getSharedInfo(lines)
  const isLoop = (position: Position) => {
    const guard = { ...initialGuard }

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
  return [...candidates].map(getPositionFromKey).filter(isLoop).length
}

export default [solution1, solution2]
