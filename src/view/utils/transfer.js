export function contains (arr, obj) {
  let i = arr.length
  while (i--) {
    if (arr[i].id === obj) {
      console.log(arr[i].id, 4444)
      return true
    }
  }
  return false
}
