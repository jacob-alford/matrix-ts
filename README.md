# [WIP] matrix-ts

A mathematics library with vectors, matricies, numerical linear algebra, abstract algebra, polynomials, and multivariate statistics.

## Possible future additions:

- Add Cholesky Decomposition
- Add QR Decomposition
- Add SVD Decomposition
- Add linear interpolation
- Add regression / multi-regression
- Add PCA
- Add factor analysis
- Add CCA

## Data types:

- `integer.ts` – An integral data type with typeclass instances
- `rational.ts` – A fractional data type with typeclass instances
- `number.ts` – Typeclass instances for `number`
- `complex.ts` – Complex data type with typeclass instances
- `quaternion.ts` – Quaternion data type with typeclass instances
- `Computation.ts` – Either with logging
- `Matrix.ts` – A type-level constrained matrix type
- `Decomposition.ts` – Numerical Linear algebra
- `Polynomial.ts` – An array without trailing zeros
- `Vector.ts` – A type-level constrained vector type
- `infix.ts` – A constructor for polish/reverse polish and infix notation for particular typeclasses
- `Multivariate.ts` – Means / covariances / correlations of multivariable sampling
- `Univariate.ts` – Means variance / covariance / correlation of univariate and bivariate sampling

## HKT Typeclasses

- `Iso.ts` – Higher level isomorphisms
- `LinearMap.ts` – Linear Maps and composition
- `LinearIsomorphism.ts` – Linear Maps and composition

## Typeclasses

- `AbelianGroup` – Commutative group
- `CommutativeRing` – A commutative ring
- `LeftModule` – Left scalar multiplication
- `RightModule` – Right scalar multiplation
- `Bimodule` – Left and Right scalar multiplication

## Examples

### Add fractions

`src/__tests__/examples.test.ts`

```ts
import * as O from 'fp-ts/Option'
import * as Q from 'matrix-ts/rational'
import * as Int from 'matrix-ts/integer'

it('adds fractions', () => {
  const { _ } = Q

  const a = Q.of(Int.fromNumber(1), Int.fromNumber(2))
  const b = Q.of(Int.fromNumber(1), Int.fromNumber(3))

  const c = pipe(
    O.Do,
    O.apS('a', a),
    O.apS('b', b),
    O.map(({ a, b }) => _(a, '+', b))
  )

  const expected = Q.of(Int.fromNumber(5), Int.fromNumber(6))

  expect(c).toStrictEqual(expected)
})
```

### Vector dot product

`src/__tests__/examples.test.ts`

```ts
import * as N from 'matrix-ts/number'
import * as V from 'matrix-ts/Vector'

it('dots two vectors', () => {
  const a = V.fromTuple([1, 2, 3, 4, 5, 6])
  const b = V.fromTuple([4, 5, 6, 7, 8, 9])
  expect(N.dot(a, b)).toBe(154)
})
```

### Vector cross product

`src/__tests__/examples.test.ts`

```ts
import * as N from 'matrix-ts/number'
import * as V from 'matrix-ts/Vector'

it('crosses two vectors', () => {
  const a = V.fromTuple([0, 2, 1])
  const b = V.fromTuple([3, -1, 0])
  expect(N.cross(a, b)).toStrictEqual(V.fromTuple([1, 3, -6]))
})
```

### Multiplies two Integer Polynomials

`src/__tests__examples.test.ts`

```ts
import * as Poly from 'matrix-ts/Polynomial'
import * as Int from 'matrix-ts/integer'

it('multiples two polynomials', () => {
  const fromArr = Poly.fromCoefficientArray(Int.Eq, Int.EuclideanRing)
  const mul = Poly.mul(Int.Eq, Int.EuclideanRing)
  const _ = Int.fromNumber
  const { show } = Poly.getShow('x')(
    Int.Show,
    a => a === 0,
    a => a === 1
  )

  // x + x^2
  const p1 = fromArr([_(0), _(1), _(1)])
  // 1 + x^4
  const p2 = fromArr([_(1), _(0), _(0), _(0), _(1)])

  // Expected: x + x^2 + x^5 + x^6
  const result = mul(p1, p2)

  expect(show(result)).toBe('x + x^2 + x^5 + x^6')
})
```

## Advanced Examples

### LUP: Gaussian Elimination with Partial Pivoting

`src/__tests__/Decomposition.test.ts`

```ts
import * as D from 'matrix-ts/Decomposition'
import * as M from 'matrix-ts/Matrix'
import * as V from 'matrix-ts/Vector'

it('solves a system of equations', () => {
  const A = M.fromNestedTuples([
    [2, 10, 8, 8, 6],
    [1, 4, -2, 4, -1],
    [0, 2, 3, 2, 1],
    [3, 8, 3, 10, 9],
    [1, 4, 1, 2, 1],
  ])

  const [output] = D.LUP(A)

  if (E.isLeft(output)) {
    throw new Error('Unexpected result')
  }

  const { solve } = output.right

  const b = V.fromTuple([52, 14, 12, 51, 15])
  const c = V.fromTuple([50, 4, 12, 48, 12])
  const x_b = solve(b)
  const x_c = solve(c)

  const expectedX_b = V.fromTuple([1, 2, 1, 2, 1])
  const expectedX_c = V.fromTuple([2, 1, 2, 1, 2])

  for (const [Axi, bi] of V.zipVectors(x_b, expectedX_b)) {
    expect(Axi).toBeCloseTo(bi)
  }
  for (const [Axi, bi] of V.zipVectors(x_c, expectedX_c)) {
    expect(Axi).toBeCloseTo(bi)
  }
})
```

### Finding the covariance matrix of a data set

```ts
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
import * as V from 'matrix-ts/Vector'
import * as Stat from 'matrix-ts/Multivariate'

it('calculates a covariance matrix', () => {
  const sample: Stat.MultivariateSample<3> = [
    V.fromTuple([1, 2, 5]),
    V.fromTuple([4, 1, 6]),
    V.fromTuple([4, 0, 4]),
  ]

  const cov = Stat.covariance(sample)

  expect(cov).toStrictEqual([
    [3, -3 / 2, 0],
    [-3 / 2, 1, 1 / 2],
    [0, 1 / 2, 1],
  ])
})
```

### Linear Isomorphisms of a Polynomial

`src/__tests__/examples.test.ts`

```ts
import * as Poly from 'matrix-ts/Polynomial'
import * as LI from 'matrix-ts/LinearIsomorphism'

it('differentiates and integrates polynomials', () => {
  const { equals } = Poly.getPolynomialEq<number, number>(N.Field)

  const { mapL, reverseMapL } = N.getDifferentialLinearIsomorphism(1)

  const thereAndBack = flow(mapL, reverseMapL)
  const hereAndThere = flow(reverseMapL, mapL)

  const a = Poly.fromCoefficientArray([1, 2, 3])

  expect(equals(thereAndBack(a), a)).toBe(true)
  expect(equals(hereAndThere(a), a)).toBe(true)
})
```

### Linear Isomorphisms of matricies

`src/__tests__/examples.test.ts`

```ts
import * as LM from 'matrix-ts/LinearMap'
import * as LI from 'matrix-ts/LinearIsomorphism'
import * as M from 'matrix-ts/Matrix'
import * as V from 'matrix-ts/Vector'

it('rotates a 2d vector and back 270 degrees', () => {
  const rotate90Degrees = N.getRotationMap2d(Math.PI / 2)
  const rotate180Degres = N.getRotationMap2d(Math.PI)

  const rotate270Degrees = LI.compose(rotate90Degrees, rotate180Degres)

  const initial = V.fromTuple([1, 0])
  const rotated = rotate270Degrees.mapL(initial)
  const reversed = rotate270Degrees.reverseMapL(rotated)
  const expected = V.fromTuple([0, -1])

  for (const [a, b] of V.zipVectors(rotated, expected)) {
    expect(a).toBeCloseTo(b)
  }
  for (const [a, b] of V.zipVectors(reversed, initial)) {
    expect(a).toBeCloseTo(b)
  }
})
it('rotates a 3d vector and back along three axies', () => {
  const rotateX45 = N.getXRotationMap3d(Math.PI / 4)
  const rotateY180 = N.getYRotationMap3d(Math.PI)
  const rotateZ90 = N.getZRotationMap3d(Math.PI / 2)

  const rotate = LI.compose(rotateX45, LI.compose(rotateY180, rotateZ90))

  const initial = V.fromTuple([0, 0, 1])
  const rotated = rotate.mapL(initial)
  const reversed = rotate.reverseMapL(rotated)
  const expected = V.fromTuple([1 / Math.sqrt(2), 0, -1 / Math.sqrt(2)])

  for (const [a, b] of V.zipVectors(rotated, expected)) {
    expect(a).toBeCloseTo(b)
  }
  for (const [a, b] of V.zipVectors(reversed, initial)) {
    expect(a).toBeCloseTo(b)
  }
})
```

### Linear Isomorphisms of quaternion rotation

`src/__tests__/examples.test.ts`

```ts
import * as Poly from 'matrix-ts/Polynomial'
import * as LI from 'matrix-ts/LinearIsomorphism'

it('rotates a 3d vector using quaternions', () => {
  const { mapL, reverseMapL } = H.getRotationLinearIsomorpism(
    // Around axis:
    V.fromTuple([1, 1, 1]),
    // By angle:
    (2 * Math.PI) / 3
  )

  const initial = V.fromTuple([1, 0, 0])
  const rotated = mapL(initial)
  const reversed = reverseMapL(rotated)
  const expected = V.fromTuple([0, 1, 0])

  for (const [a, b] of V.zipVectors(rotated, expected)) {
    expect(a).toBeCloseTo(b)
  }
  for (const [a, b] of V.zipVectors(reversed, initial)) {
    expect(a).toBeCloseTo(b)
  }
})
```

---

## Install

Uses `fp-ts` as a peer dependency.

```bash
yarn add fp-ts matrix-ts
```

or

```bash
npm install fp-ts matrix-ts
```
