export function compare (obj1, obj2) {
  let val1 = obj1.month
  let val2 = obj2.month
  if (val1 < val2) {
    return -1
  } else if (val1 > val2) {
    return 1
  } else {
    return 0
  }
}
