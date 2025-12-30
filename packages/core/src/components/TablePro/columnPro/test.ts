type NoInfer<T> = T & { __noinfer?: never }

function makePair<T>(a: NoInfer<T>, b: NoInfer<T>): [T, T] {
  return [a, b]
}
// function makePair<T>(a: T, b: T): [T, T] {
//   return [a, b]
// }

const pair1 = makePair(1, 2)           // ❌ 不能推断
const pair2 = makePair<number>(1, 2)   // ✅ 手动指定
