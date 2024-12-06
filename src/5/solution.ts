import add from "../utils/add"

const processLines = (
  lines: string[],
): {
  rules: Array<[number, number]>
  instructions: Array<number[]>
} => {
  const rules: Array<[number, number]> = []
  const instructions: Array<number[]> = []

  let rulesOn = true
  lines.forEach((x) => {
    if (!x) {
      rulesOn = false
      return
    }

    if (rulesOn) {
      rules.push(x.split("|").map(Number) as any)
    } else {
      instructions.push(x.split(",").map(Number))
    }
  })

  return {
    rules,
    instructions,
  }
}

const solution1 = (lines: string[]) => {
  const { rules, instructions: allInstructions } = processLines(lines)
  const rulesMap: Map<
    number,
    {
      before: Set<number>
      after: Set<number>
    }
  > = new Map()

  rules.forEach(([first, second]) => {
    if (!rulesMap.has(first))
      rulesMap.set(first, { before: new Set(), after: new Set() })

    if (!rulesMap.has(second))
      rulesMap.set(second, { before: new Set(), after: new Set() })

    rulesMap.get(first)!.before.add(second)
    rulesMap.get(second)!.after.add(first)
  })

  const isInstructionValid = (instructions: Array<number>) =>
    instructions.every((x, idx, arr) => {
      if (idx < arr.length - 1)
        if (!rulesMap.get(x)!.before.has(arr[idx + 1])) return false
      if (idx > 0) if (!rulesMap.get(x)!.after.has(arr[idx - 1])) return false
      return true
    })

  return allInstructions
    .filter(isInstructionValid)
    .map((x) => {
      return x[Math.floor(x.length / 2)]
    })
    .reduce(add)
}

const solution2 = (lines: string[]) => {
  const { rules, instructions: allInstructions } = processLines(lines)
  const rulesMap: Map<
    number,
    {
      before: Set<number>
      after: Set<number>
    }
  > = new Map()

  rules.forEach(([first, second]) => {
    if (!rulesMap.has(first))
      rulesMap.set(first, { before: new Set(), after: new Set() })

    if (!rulesMap.has(second))
      rulesMap.set(second, { before: new Set(), after: new Set() })

    rulesMap.get(first)!.before.add(second)
    rulesMap.get(second)!.after.add(first)
  })

  const isInstructionValid = (instructions: Array<number>) =>
    instructions.every((x, idx, arr) => {
      if (idx < arr.length - 1)
        if (!rulesMap.get(x)!.before.has(arr[idx + 1])) return false
      if (idx > 0) if (!rulesMap.get(x)!.after.has(arr[idx - 1])) return false
      return true
    })

  return allInstructions
    .filter((x) => !isInstructionValid(x))
    .map((x) => {
      return x.sort((a, b) => {
        if (rulesMap.get(a)!.after.has(b)) return 1
        if (rulesMap.get(a)!.before.has(b)) return -1
        return 0
      })
    })
    .map((x) => x[Math.floor(x.length / 2)])
    .reduce(add)
}

export default [solution1, solution2]
