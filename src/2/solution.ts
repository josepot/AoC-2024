const isSafe = (list: number[]) => {
  let setDirection: boolean | null = null
  return list.every((x, idx) => {
    if (!idx) return true
    const prev = list[idx - 1]
    const diff = x - prev
    if (diff === 0) return false
    const direction = diff > 0
    if (setDirection === null) setDirection = direction
    return direction === setDirection && Math.abs(diff) < 4
  })
}

const isSafe2 = (list: number[]) => {
  if (isSafe(list)) return true

  for (let i = 0; i < list.length; i++) {
    const copyList = [...list]
    copyList.splice(i, 1)
    if (isSafe(copyList)) return true
  }
  return false
}

const solution1 = (lines: string[]) =>
  lines.map((line) => line.split(" ").map(Number)).filter(isSafe).length

const solution2 = (lines: string[]) =>
  lines.map((line) => line.split(" ").map(Number)).filter(isSafe2).length

export default [solution1, solution2]
