export function genNonDuplicateId(randomLength: number | undefined = 10) {
  let idStr = Date.now().toString(36)
  idStr += Math.random().toString(36).substr(3, randomLength)
  return idStr
}
