import { readGrid } from "../utils/readGrid"
import { type Position } from "../utils/directions"

const getSharedInfo = (lines: string[]) => {
  const antenas = new Map<string, Position[]>()
  const grid = readGrid(lines, (x, pos) => {
    if (x !== ".") {
      const positions = antenas.get(x) ?? []
      positions.push({ ...pos, key: `${pos.x},${pos.y}` })
      antenas.set(x, positions)
    }
    return x === "#"
  })

  return { grid, antenas }
}

const solution =
  (isSecond = false) =>
  (lines: string[]) => {
    const { antenas, grid } = getSharedInfo(lines)

    const frequencies = new Set<string>()
    antenas.forEach((positions) => {
      if (positions.length < 2) return
      if (isSecond)
        positions.forEach(({ key }) => {
          frequencies.add(key)
        })

      for (let i = 0; i < positions.length - 1; i++) {
        for (let z = i + 1; z < positions.length; z++) {
          let xDelta = positions[i].x - positions[z].x
          let yDelta = positions[i].y - positions[z].y

          let x = positions[i].x + xDelta
          let y = positions[i].y + yDelta
          while (x >= 0 && x < grid.N_COLS && y >= 0 && y < grid.N_ROWS) {
            frequencies.add(`${x},${y}`)
            if (!isSecond) break
            x += xDelta
            y += yDelta
          }

          x = positions[z].x - xDelta
          y = positions[z].y - yDelta
          while (x >= 0 && x < grid.N_COLS && y >= 0 && y < grid.N_ROWS) {
            frequencies.add(`${x},${y}`)
            if (!isSecond) break
            x -= xDelta
            y -= yDelta
          }
        }
      }
    })
    return frequencies.size
  }

export default [solution(), solution(true)]
