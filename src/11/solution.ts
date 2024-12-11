const cache = new Map<string, number>()
const countStonesCached = (stone: bigint, nLeft: number): number => {
  const key = `${stone}-${nLeft}`
  if (cache.has(key)) return cache.get(key)!
  const res = countStones(stone, nLeft)
  cache.set(key, res)
  return res
}

const countStones = (stone: bigint, nLeft: number): number => {
  if (nLeft === 0) return 1
  const countNextStone = (x: bigint) => countStonesCached(x, nLeft - 1)

  if (stone === 0n) return countNextStone(1n)
  const str = stone.toString()

  return str.length % 2 === 1
    ? countNextStone(stone * 2024n)
    : countNextStone(BigInt(str.slice(0, str.length / 2))) +
        countNextStone(BigInt(str.slice(str.length / 2)))
}

const solution = (nIterations: number) => (line: string) => {
  return line
    .split(" ")
    .map(BigInt)
    .map((x) => countStonesCached(x, nIterations))
    .reduce((a, b) => a + b)
}

export default [solution(25), solution(75)]
