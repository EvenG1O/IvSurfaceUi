export function interpolateRow(row: (number | null)[]): number[] {

  const result = [...row];

  const hasAnyknown = result.some(v => v !== null);
  if (!hasAnyknown) return result.map(() => 0);

  const firstKnownIndex = result.findIndex(v => v !== null);


  for (let i = 0; i < firstKnownIndex; i++) {
    result[i] = result[firstKnownIndex];
  }

  for (let i = firstKnownIndex + 1; i < result.length; i++) {
    if (result[i] !== null) continue

    let t1 = i - 1;
    while (t1 >= 0 && result[t1] === null) t1--
    const R1 = result[t1] as number

    let t2 = i + 1

    while (t2 < result.length && result[t2] === null) t2++;

    if (t2 >= result.length) {
      result[i] = R1;
    } else {
      const R2 = result[t2] as number
      const tn = i;

      result[i] = R1 + ((R2 - R1) / (t2 - t1)) * (tn - t1)

    }

  }
  return result as number[]

}

export function interpolateSurface(matrix: (number | null)[][]) : number[][] {
  const rowFilled = matrix.map(row => interpolateRow(row));

  const numCols = rowFilled[0].length;
  const result = rowFilled.map(r => [...r]);

  for(let col = 0; col < numCols; col++ ){
    const column = result.map(row => row[col] as number | null)
    const filled = interpolateRow(column);
    filled.forEach((val,row) => {result[row][col] = val});
  }

  return result;

}