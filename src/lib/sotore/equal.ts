export const equal = (a: any, b: any) => {
  if (Object.is(a, b)) {
    return true
  }

  if (
    typeof a !== 'object' ||
    typeof b !== 'object' ||
    a === null ||
    b === null
  ) {
    return false
  }

  const keysA = Object.keys(a)
  if (keysA.length !== Object.keys(b).length) {
    return false
  }

  for (const prop of keysA) {
    if (!Object.is(a[prop], b[prop])) {
      return false
    }
  }

  return true
}
