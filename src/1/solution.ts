const solution1 = (lines: string[]) => {
  const mappedLines = lines.map(
    (line) => line.split("   ").map(Number) as [number, number],
  )
  const arr1: number[] = []
  const arr2: number[] = []
  mappedLines.forEach((x) => {
    arr1.push(x[0])
    arr2.push(x[1])
  })

  arr1.sort((a, b) => a - b)
  arr2.sort((a, b) => a - b)

  return arr1.map((x, idx) => Math.abs(x - arr2[idx])).reduce((a, b) => a + b)
}

const solution2 = (lines: string[]) => {
  const mappedLines = lines.map(
    (line) => line.split("   ").map(Number) as [number, number],
  )
  const left: Record<number, number> = {}
  const right: Record<number, number> = {}
  const numbers = new Set<number>()
  mappedLines.forEach(([id0, id1]) => {
    if (id0 in left) left[id0]++
    else left[id0] = 1
    if (!(id1 in left)) left[id1] = 0

    if (id1 in right) right[id1]++
    else right[id1] = 1
    if (!(id0 in right)) right[id0] = 0

    numbers.add(id0)
    numbers.add(id1)
  })

  return [...numbers].map((x) => x * left[x] * right[x]).reduce((a, b) => a + b)
}

export default [solution1, solution2]
