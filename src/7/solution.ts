import add from "../utils/add"

const getParts = (line: string) => {
  const [rawSolution, parts] = line.split(": ")
  return {
    solution: Number(rawSolution),
    parts: parts.split(" ").map(Number),
  }
}

const isValid =
  (isPart2: boolean) =>
  ({ solution, parts }: { solution: number; parts: number[] }) => {
    let candidates = [parts[0]]
    for (let p = 1; p < parts.length && candidates.length; p++) {
      const current = parts[p]
      const nextCandidates: number[] = []
      candidates.forEach((candidate) => {
        const options = [candidate + current, candidate * current]
        if (isPart2) options.push(Number(`${candidate}${current}`))
        nextCandidates.push(...options.filter((x) => x <= solution))
      })
      candidates = nextCandidates
    }
    return candidates.indexOf(solution) > -1
  }

const solution =
  (isPart2 = false) =>
  (lines: string[]) =>
    lines
      .map(getParts)
      .filter(isValid(isPart2))
      .map((x) => x.solution)
      .reduce(add)

export default [solution(), solution(true)]
