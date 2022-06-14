# [WIP] matrix-ts

A mathematics library with vectors, matricies, numerical linear algebra, associated algebraic constructions, and polynomials.

## Data types:

- `complex.ts` – Complex data type with typeclass instances
- `number.ts` – Typeclass instances for `number`
- `Computation.ts` – Either with logging
- `Expression.ts` – A summation of shared symbols with shared domain / codomain
- `FreeMonoid.ts` – Isomorphic to a List / Readonly Array type
- `MatrixC.ts` – A type-level constrained matrix type
- `MatrixU.ts` – An unconstrained matrix type
- `MatrixOps.ts` – Numerical Linear algebra, and some branded newtypes
- `Polynomial.ts` – A type of expression in the shape `Coefficient * (x) ^ (power)`
- `VectorC.ts` – A type-level constrained vector type

## HKT Typeclasses

- `Iso.ts` – Higher level isomorphisms
- `LinearMap.ts` – Linear Maps and composition

## Typeclasses

- `Logger.ts` – An effectful logger
- `AbelianGroup` – Commutative group
- `CommutativeRing` – A commutative ring
- `Conjugate` – any data-type with the idea of a conjugate
- `Exp` – any data type that can be raised to a `number`
- `InnerProductSpace` – A vector-space that has an idea of a dot product
- `LeftModule` – Left scalar multiplication
- `RightModule` – Right scalar multiplation
- `Bimodule` – Left and Right scalar multiplication
- `VectorSpace` – A left module over a field

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

### Linear maps of a Polynomial

```ts
import * as Poly from 'matrix-ts/Polynomial'
import * as LM from 'matrix-ts/LinearMap'

it('differentiates and integrates polynomials', () => {
  const { equals } = Poly.getPolynomialEq<number, number>(N.Field)

  const differentiateThenIntegrate = LM.compose2(
    N.DifferentialLinearMap,
    N.getDefiniteIntegralLinearMap(1)
  )
  const integrateThenDifferentiate = LM.compose2(
    N.getDefiniteIntegralLinearMap(1),
    N.DifferentialLinearMap
  )

  const a = Poly.fromCoefficientArray([1, 2, 3])

  expect(equals(differentiateThenIntegrate.mapL(a), a)).toBe(true)
  expect(equals(integrateThenDifferentiate.mapL(a), a)).toBe(true)
})
```

### Linear maps of matricies

```ts
import * as LM from 'matrix-ts/LinearMap'
import * as M from 'matrix-ts/MatrixC'
import * as V from 'matrix-ts/VectorC'

it('rotates a 2d vector 270 degrees', () => {
  const rotate90Degrees = N.getRotationMap2d(Math.PI / 2)
  const rotate180Degres = N.getRotationMap2d(Math.PI)

  const rotate270Degrees = LM.compose2(rotate90Degrees, rotate180Degres)

  const initial = V.fromTuple([1, 0])
  const rotated = rotate270Degrees.mapL(initial)
  const expected = V.fromTuple([0, -1])

  for (const [a, b] of V.zipVectors(rotated, expected)) {
    expect(a).toBeCloseTo(b)
  }
})
it('rotates a 3d vector along three axies', () => {
  const rotateX45 = N.getXRotationMap3d(Math.PI / 4)
  const rotateY180 = N.getYRotationMap3d(Math.PI)
  const rotateZ90 = N.getZRotationMap3d(Math.PI / 2)

  const rotate = LM.compose2(rotateX45, LM.compose2(rotateY180, rotateZ90))

  const initial = V.fromTuple([0, 0, 1])
  const rotated = rotate.mapL(initial)
  const expected = V.fromTuple([1 / Math.sqrt(2), 0, -1 / Math.sqrt(2)])

  for (const [a, b] of V.zipVectors(rotated, expected)) {
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
