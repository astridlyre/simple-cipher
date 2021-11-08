/*
 * Utils
 */
const getIn = curry((key, obj) => obj && obj[key])
const setIn = curry((key, val, obj) => obj && ((obj[key] = val), obj))
const map = curry((fn, arr) => arr.map(fn))
const reduce = curry((fn, init, arr) => arr.reduce(fn, init))
const pluck = compose(map, getIn)
const charCodeAt = str => str.charCodeAt(0)
const fromCharCode = code => String.fromCharCode(code)
const split = str => [...str]
const join = arr => arr.join('')
const add = curry((x, y) => x + y)
const subtract = curry((x, y) => x - y)
const flip = f => (x, y) => f(y, x)
const sum = (...args) => reduce(add, 0)(args)
const toCharCodes = compose(map(charCodeAt), split)
const fromCharCodes = compose(join, map(fromCharCode))
const trunc = curry((len, str) => {
  if (len <= str.length) return str.substring(0, len)
  return ''.padEnd(str, len)
})
const len = x => (x && x.length) || 0

function zip(zipper, ...iterables) {
  return range(0, Math.min(...pluck('length')(iterables))).reduce(
    (result, i) => (result.push(zipper(...pluck(i)(iterables))), result),
    []
  )
}

function range(start, end) {
  return Array.from(
    { length: Math.abs(end - start) },
    (_, i) => i + start * Math.sign(end - start)
  )
}

function compose2(f, g) {
  return x => f.call(this, g.call(this, x))
}

function compose(...fns) {
  return fns.reduce(compose2)
}

function pipe(...fns) {
  return fns.reduceRight(compose2)
}

function curry(f) {
  return function innerCurry(...args) {
    return args.length >= f.length
      ? f.apply(this, args)
      : (...args2) =>
          args.length + args2.length >= f.length
            ? f.call(this, ...args, ...args2)
            : curry(f)(...args, ...args2)
  }
}

function partial(fn) {
  return (...args) =>
    (...args2) =>
      fn.call(this, ...args, ...args2)
}

module.exports = {
  add,
  compose,
  flip,
  fromCharCodes,
  getIn,
  len,
  partial,
  pipe,
  range,
  reduce,
  setIn,
  subtract,
  sum,
  toCharCodes,
  trunc,
  zip,
}
