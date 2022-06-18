# [WIP] matrix-ts

A mathematics library with vectors, matricies, numerical linear algebra, associated algebraic constructions, and polynomials.

## TODO:

- Add property tests for Polynomial
- General cleanup / Sized vector instances?
- Refactor Gaussian Elimination to LUP
- Add `VecU` with useful methods

## Data types:

- `integer.ts` – An integral data type with typeclass instances
- `rational.ts` – A fractional data type with typeclass instances
- `number.ts` – Typeclass instances for `number`
- `complex.ts` – Complex data type with typeclass instances
- `quaternion.ts` – Quaternion data type with typeclass instances
- `Computation.ts` – Either with logging
- `FreeMonoid.ts` – Isomorphic to a List / Readonly Array type
- `MatrixC.ts` – A type-level constrained matrix type
- `MatrixU.ts` – An unconstrained matrix type
- `MatrixOps.ts` – Numerical Linear algebra, and some branded newtypes
- `Polynomial.ts` – An array without trailing zeros
- `VectorC.ts` – A type-level constrained vector type

## HKT Typeclasses

- `Iso.ts` – Higher level isomorphisms
- `LinearMap.ts` – Linear Maps and composition
- `LinearIsomorphism.ts` – Linear Maps and composition

## Typeclasses

- `Logger.ts` – An effectful logger
- `AbelianGroup` – Commutative group
- `CommutativeRing` – A commutative ring
- `LeftModule` – Left scalar multiplication
- `RightModule` – Right scalar multiplation
- `Bimodule` – Left and Right scalar multiplication

## Examples

Find the following examples in `src/__tests__/examples.test.ts`

### Vector dot product

```ts
import * as N from 'matrix-ts/number'
import * as V from 'matrix-ts/VectorC'

it('dots two vectors', () => {
  const a = V.fromTuple([1, 2, 3, 4, 5, 6])
  const b = V.fromTuple([4, 5, 6, 7, 8, 9])
  expect(N.InnerProductSpace6d.dot(a, b)).toBe(154)
})
```

### Vector cross product

```ts
import * as N from 'matrix-ts/number'
import * as V from 'matrix-ts/VectorC'

it('crosses two vectors', () => {
  const a = V.fromTuple([0, 2, 1])
  const b = V.fromTuple([3, -1, 0])
  expect(N.cross(a, b)).toStrictEqual(V.fromTuple([1, 3, -6]))
})
```

### Linear Isomprohisms of a Polynomial

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

### Linear Isomorpisms of matricies

```ts
import * as LM from 'matrix-ts/LinearMap'
import * as LI from 'matrix-ts/LinearIsomorphism'
import * as M from 'matrix-ts/MatrixC'
import * as V from 'matrix-ts/VectorC'

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

### Linear Isomorpisms of quaternion rotation

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

Note: This is still a WIP, and will be uploaded to NPM once it's in a stable state

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
