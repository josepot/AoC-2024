import add from "../utils/add"

const solution1 = (line: string) => {
  const entries: Array<number> = line.split("").map(Number)

  const mapped: Array<number | null> = entries
    .map((value, idx) => Array(value).fill(idx % 2 === 0 ? idx / 2 : null))
    .filter((x) => x.length > 0)
    .flat()

  let startIdx = 0
  while (mapped[startIdx] !== null) startIdx++

  let endIdx = mapped.length - 1
  while (mapped[endIdx] === null) endIdx--

  do {
    mapped[startIdx] = mapped[endIdx]
    mapped[endIdx] = null
    while (mapped[endIdx] === null) endIdx--
    while (mapped[startIdx] !== null) startIdx++
  } while (startIdx < endIdx)

  return mapped
    .filter((x) => x !== null)
    .map((x, idx) => x * idx)
    .reduce(add)
}

type Data = { type: "data"; data: number[] }
type Gap = {
  type: "gap"
  len: number
}
const solution2 = (line: string) => {
  const entries: Array<number> = line.split("").map(Number)

  const mapped: Array<Data | Gap> = entries.map((value, idx) =>
    idx % 2 === 0
      ? ({
          type: "data" as "data",
          data: Array(value).fill(idx / 2),
        } as const)
      : ({ type: "gap" as "gap", len: value } as const),
  )

  let currentGroupIdx = mapped.length - 1
  while (mapped[currentGroupIdx].type === "gap") currentGroupIdx--

  do {
    const currentGroup = mapped[currentGroupIdx] as Data

    let winner = mapped[0]
    let i = 0
    while (
      i < currentGroupIdx &&
      (winner.type === "data" || winner.len < currentGroup.data.length)
    ) {
      winner = mapped[++i]
    }

    if (i < currentGroupIdx && winner.type === "gap") {
      mapped.splice(i, 0, currentGroup)
      ;(winner as Gap).len -= currentGroup.data.length

      let gap = mapped[currentGroupIdx]
      if (gap.type !== "gap") gap = mapped[currentGroupIdx + 2]
      if (gap?.type === "gap") {
        gap.len += currentGroup.data.length
        mapped.splice(currentGroupIdx + 1, 1)
      } else {
        mapped[currentGroupIdx + 1] = {
          type: "gap",
          len: currentGroup.data.length,
        }
      }
    }

    do currentGroupIdx--
    while (currentGroupIdx > 0 && mapped[currentGroupIdx].type === "gap")

    if (currentGroupIdx === 0) break
  } while (true)

  return mapped
    .map((x) => (x.type === "gap" ? Array(x.len).fill(0) : x.data))
    .flat()
    .map((x, idx) => x * idx)
    .reduce(add)
}

export default [solution1, solution2]
