---
title: Home
permalink: /
has_children: false
nav_order: 1
---

# matrix-ts

fp-ts style mathematics library featuring: linear algebra, numerical methods, polynomials, and statistics

## Table of Contents

<!-- AUTO-GENERATED-CONTENT:START (TOC) -->

- [Install](#install)
  - [Yarn](#yarn)
  - [NPM](#npm)
- [Typescript Compatibility](#typescript-compatibility)
- [Documentation](#documentation)
- [Possible future additions](#possible-future-additions)
- [Data types](#data-types)
- [Typeclasses](#typeclasses)
- [Examples](#examples)
  - [Add fractions](#add-fractions)
  - [Vector dot product](#vector-dot-product)
  - [Vector cross product](#vector-cross-product)
  - [Multiplies two Integer Polynomials](#multiplies-two-integer-polynomials)
- [Advanced Examples](#advanced-examples)
  - [Gaussian Elimination with Partial Pivoting (LUP)](#gaussian-elimination-with-partial-pivoting-lup)
  - [Covariance matrix of a multivariate sample](#covariance-matrix-of-a-multivariate-sample)
  - [Automorphisms of polynomials](#automorphisms-of-polynomials)
  - [Automorphisms of matricies](#automorphisms-of-matricies)
  - [Quaternion automorphisms](#quaternion-automorphisms)
  <!-- AUTO-GENERATED-CONTENT:END -->

## Install

Uses `fp-ts` as a peer dependency. Read more about peer dependencies at [nodejs.org](https://nodejs.org/en/blog/npm/peer-dependencies/).

### Yarn

```bash
yarn add fp-ts @jacob-alford/matrix-ts
```

### NPM

```bash
npm install fp-ts @jacob-alford/matrix-ts
```

## Typescript Compatibility

This library depends on fp-ts version `^2.9.6` (or major versions above `2.9.6`, and below `3.0.0`), and thus requires typescript version 3.5+.

## Documentation

- [Docs](https://jacob-alford.github.io/matrix-ts/modules/)
- [fp-ts](https://gcanti.github.io/fp-ts/modules/)

## Possible future additions

- Add Cholesky Decomposition
- Add QR Decomposition
- Add SVD Decomposition
- Add linear interpolation
- Add regression / multi-regression
- Add PCA
- Add factor analysis
- Add CCA

## Data types

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

## Typeclasses

- `Iso.ts` – Generic isomorphisms with composition
- `Automorphism.ts` – Generic automorphisms with composition
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
import * as Q from '@jacob-alford/matrix-ts/rational'
import * as Int from '@jacob-alford/matrix-ts/integer'

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
import * as N from '@jacob-alford/matrix-ts/number'
import * as V from '@jacob-alford/matrix-ts/Vector'

it('dots two vectors', () => {
  const a = V.fromTuple([1, 2, 3, 4, 5, 6])
  const b = V.fromTuple([4, 5, 6, 7, 8, 9])
  expect(N.dot(a, b)).toBe(154)
})
```

### Vector cross product

`src/__tests__/examples.test.ts`

```ts
import * as N from '@jacob-alford/matrix-ts/number'
import * as V from '@jacob-alford/matrix-ts/Vector'

it('crosses two vectors', () => {
  const a = V.fromTuple([0, 2, 1])
  const b = V.fromTuple([3, -1, 0])
  expect(N.cross(a, b)).toStrictEqual(V.fromTuple([1, 3, -6]))
})
```

### Multiplies two Integer Polynomials

`src/__tests__examples.test.ts`

```ts
import * as Poly from '@jacob-alford/matrix-ts/Polynomial'
import * as Int from '@jacob-alford/matrix-ts/integer'

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

### Gaussian Elimination with Partial Pivoting (LUP)

`src/__tests__/Decomposition.test.ts`

```ts
import * as D from '@jacob-alford/matrix-ts/Decomposition'
import * as M from '@jacob-alford/matrix-ts/Matrix'
import * as V from '@jacob-alford/matrix-ts/Vector'

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

  // ... assertions
})
it('returns a factorized matrix', () => {
  const [output] = D.LUP(A)

  if (E.isLeft(output)) {
    throw new Error('Unexpected result')
  }

  const {
    result: [L, U, P],
  } = output.right

  const expectedL = M.fromNestedTuples([
    [1, 0, 0, 0, 0],
    [2 / 3, 1, 0, 0, 0],
    [1 / 3, 2 / 7, 1, 0, 0],
    [1 / 3, 2 / 7, 4 / 11, 1, 0],
    [0, 3 / 7, -1 / 11, -4 / 5, 1],
  ])
  const expectedU = M.fromNestedTuples([
    [3, 8, 3, 10, 9],
    [0, 14 / 3, 6, 4 / 3, 0],
    [0, 0, -33 / 7, 2 / 7, -4],
    [0, 0, 0, -20 / 11, -6 / 11],
    [0, 0, 0, 0, 1 / 5],
  ])

  // ... assertions
})
```

### Covariance matrix of a multivariate sample

```ts
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
import * as V from '@jacob-alford/matrix-ts/Vector'
import * as Stat from '@jacob-alford/matrix-ts/Multivariate'

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

### Automorphisms of polynomials

`src/__tests__/examples.test.ts`

```ts
import * as Poly from '@jacob-alford/matrix-ts/Polynomial'
import * as N from '@jacob-alford/matrix-ts/number'

it('differentiates and integrates polynomials', () => {
  const { equals } = Poly.getPolynomialEq<number>(N.Eq)

  const L = N.getDifferentialAutomorphism(1)

  const thereAndBack = flow(L.get, L.reverseGet)
  const hereAndThere = flow(L.reverseGet, L.get)

  const a = Poly.fromCoefficientArray(N.Eq, N.Field)([1, 2, 3])

  expect(equals(thereAndBack(a), a)).toBe(true)
  expect(equals(hereAndThere(a), a)).toBe(true)
})
```

### Automorphisms of matricies

`src/__tests__/examples.test.ts`

```ts
import * as Auto from '@jacob-alford/matrix-ts/Automorphism'
import * as N from '@jacob-alford/matrix-ts/number'
import * as V from '@jacob-alford/matrix-ts/Vector'

it('rotates a 2d vector and back 270 degrees', () => {
  const rotate90Degrees = N.get2dRotation(Math.PI / 2)
  const rotate180Degres = N.get2dRotation(Math.PI)

  const T = Auto.compose(rotate90Degrees, rotate180Degres)

  const initial = V.fromTuple([1, 0])
  const rotated = T.get(initial)
  const expected = V.fromTuple([0, -1])
  const reversed = T.reverseGet(rotated)

  // ... assertions
})
it('rotates a 3d vector and back along three axies', () => {
  const rotateX45 = N.get3dXRotation(Math.PI / 4)
  const rotateY180 = N.get3dYRotation(Math.PI)
  const rotateZ90 = N.get3dZRotation(Math.PI / 2)

  const T = Auto.compose(rotateX45, Auto.compose(rotateY180, rotateZ90))

  const initial = V.fromTuple([0, 0, 1])
  const rotated = T.get(initial)
  const reversed = T.reverseGet(rotated)
  const expected = V.fromTuple([1 / Math.sqrt(2), 0, -1 / Math.sqrt(2)])

  // ... assertions
})
```

### Quaternion automorphisms

`src/__tests__/examples.test.ts`

```ts
import * as H from '@jacob-alford/matrix-ts/quaternion'
import * as V from '@jacob-alford/matrix-ts/Vector'

it('rotates a 3d vector using quaternions', () => {
  const T = H.getRotationAutomorphism(
    // Around axis:
    V.fromTuple([1, 1, 1]),
    // By angle:
    (2 * Math.PI) / 3
  )

  const initial = V.fromTuple([1, 0, 0])
  const rotated = T.get(initial)
  const reversed = T.reverseGet(rotated)
  const expected = V.fromTuple([0, 1, 0])

  // ... assertions
})
```
