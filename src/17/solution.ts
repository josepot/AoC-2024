const getInput = (lines: string[]) => {
  const a = Number(lines[0].split(": ")[1])
  const b = Number(lines[1].split(": ")[1])
  const c = Number(lines[2].split(": ")[1])
  const program = lines[4].split(": ")[1].split(",").map(Number)
  return { a, b, c, program }
}

function runProgram(
  a: number,
  b: number,
  c: number,
  program: number[],
): number[] {
  let pointer = 0
  const outputs: number[] = []

  const getComboValue = (value: number) => {
    if (value > 6) throw "Invalid Operand"
    return [0, 1, 2, 3, a, b, c][value]
  }

  while (program[pointer] !== undefined) {
    const opcode = program[pointer]
    const operand = program[pointer + 1]

    let advance = true
    switch (opcode) {
      case 0: {
        a = Math.floor(a / Math.pow(2, getComboValue(operand)))
        break
      }
      case 1: {
        b = b ^ operand
        break
      }
      case 2: {
        b = getComboValue(operand) % 8
        break
      }
      case 3: {
        if (a > 0) {
          pointer = operand
          advance = false
        }
        break
      }
      case 4: {
        b = b ^ c
        break
      }
      case 5: {
        outputs.push(getComboValue(operand) & 7)
        break
      }
      case 6: {
        b = Math.floor(a / Math.pow(2, getComboValue(operand)))
        break
      }
      case 7: {
        c = Math.floor(a / Math.pow(2, getComboValue(operand)))
        break
      }
      default:
        throw null
    }

    pointer += advance ? 2 : 0
  }

  return outputs
}

const solution1 = (lines: string[]) => {
  let { a, b, c, program } = getInput(lines)
  return runProgram(a, b, c, program).join(",")
}

const solution2 = (lines: string[]) => {
  let { b, c, program } = getInput(lines)
  const getFirstOutput = (a: number) => runProgram(a, b, c, program)[0]

  const getFirstA = (nextA: number, targetIdx: number): number | null => {
    for (let a = nextA; a < nextA + 8; a++) {
      if (program[targetIdx] !== getFirstOutput(a)) continue
      const result = targetIdx > 0 ? getFirstA(a * 8, targetIdx - 1) : a
      if (result !== null) return result
    }
    return null
  }
  return getFirstA(0, program.length - 1)
}

export default [solution1, solution2]
