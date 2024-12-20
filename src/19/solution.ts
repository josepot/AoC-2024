import add from "../utils/add"
import graphDistinctSearch from "../utils/graphDistinctSearch"
import graphSearch from "../utils/graphSearch"

const solution1 = (lines: string[]) => {
  const patterns = lines[0].split(", ").sort((a, b) => b.length - a.length)
  const needed = lines.slice(2)

  const isPossible = (pattern: string) => {
    try {
      graphDistinctSearch(
        {
          id: pattern,
        },
        ({ id }) => {
          if (id.length === 0) return true
          return patterns
            .map((pattern) => {
              return id.startsWith(pattern) ? id.slice(pattern.length) : null
            })
            .filter((x) => x !== null)
            .map((id) => ({ id })) as any[]
        },
        (a, b) => b.id.length - a.id.length,
      )
      return true
    } catch {
      return false
    }
  }

  return needed.filter(isPossible).length
}

const solution2 = (lines: string[]) => {
  const patterns = lines[0].split(", ").sort((a, b) => b.length - a.length)
  const needed = lines.slice(2)

  const cache = new Map<string, number>()
  const buildLine = (line: string): number => {
    if (cache.has(line)) return cache.get(line)!
    const result = patterns
      .map((pattern) => {
        if (!line.startsWith(pattern)) return 0
        return line === pattern ? 1 : buildLine(line.slice(pattern.length))
      })
      .reduce(add)

    cache.set(line, result)
    return result
  }

  return needed.map(buildLine).reduce(add)
}

export default [solution1, solution2]
