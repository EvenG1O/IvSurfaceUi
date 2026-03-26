export function interpolateRow(row: (number | null)[]): number[] {
  const result = [...row]

  const firstKnown = result.findIndex(v => v !== null)
  if (firstKnown === -1) return result.map(() => 0)

  for (let i = 0; i < result.length; i++) {
    if (result[i] === null) {
      let nextKnown = -1
      for (let j = i + 1; j < result.length; j++) {
        if (result[j] !== null) { nextKnown = j; break }
      }

      if (nextKnown === -1) {
        result[i] = result[i - 1]
      } else if (i === 0 || result[i - 1] === null) {
        result[i] = result[nextKnown]
      } else {
        const prev = result[i - 1] as number;
        const next = result[nextKnown] as number;
        const steps = nextKnown - (i - 1);
        result[i] = prev + (next - prev) * (1 / steps);
      }
    }
  }

  return result as number[]
}
