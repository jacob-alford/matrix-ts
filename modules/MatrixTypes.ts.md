---
title: MatrixTypes.ts
nav_order: 10
parent: Modules
---

## MatrixTypes overview

Various Matrix sub-types that are guarded by various constructors and branded-newtypes.
Allows for convenient inverses if the inverse need be applied to the diagonal of a
particular matrix, such as with the Pearson Correlation Matrix for multivariate samples.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Constructors](#constructors)
  - [extractDiagonal](#extractdiagonal)
  - [fromMatrix](#frommatrix)
  - [toMatrix](#tomatrix)
- [Isomorphisms](#isomorphisms)
  - [getTransposeIso](#gettransposeiso)
- [Matrix Operations](#matrix-operations)
  - [backSub](#backsub)
  - [diagonalFoldMap](#diagonalfoldmap)
  - [diagonalInverse](#diagonalinverse)
  - [diagonalMap](#diagonalmap)
  - [forwardSub](#forwardsub)
  - [orthogonalInverse](#orthogonalinverse)
- [Model](#model)
  - [DiagonalMatrix (interface)](#diagonalmatrix-interface)
  - [LowerTriangularMatrix (interface)](#lowertriangularmatrix-interface)
  - [OrthogonalMatrix (interface)](#orthogonalmatrix-interface)
  - [UpperTriangularMatrix (interface)](#uppertriangularmatrix-interface)

---

# Constructors

## extractDiagonal

**Signature**

```ts
export declare const extractDiagonal: <A>(zero: A) => <M>(m: M.Mat<M, M, A>) => DiagonalMatrix<M, A>
```

Added in v1.0.0

## fromMatrix

**Signature**

```ts
export declare const fromMatrix: <A>(
  R: Rng.Ring<A>
) => <M>(m: M.Mat<M, M, A>) => [LowerTriangularMatrix<M, A>, UpperTriangularMatrix<M, A>]
```

Added in v1.0.0

## toMatrix

**Signature**

```ts
export declare const toMatrix: <M, A>([l, u]: [LowerTriangularMatrix<M, A>, UpperTriangularMatrix<M, A>]) => M.Mat<
  M,
  M,
  A
>
```

Added in v1.0.0

# Isomorphisms

## getTransposeIso

**Signature**

```ts
export declare const getTransposeIso: <M extends number, A>() => Iso.Iso<
  LowerTriangularMatrix<M, A>,
  UpperTriangularMatrix<M, A>
>
```

Added in v1.0.0

# Matrix Operations

## backSub

See: Fundamentals of Matrix Computation, David S. Watkins, page 30. Returns O.none if
matrix is singular

**Signature**

```ts
export declare const backSub: <M extends number>(
  U: UpperTriangularMatrix<M, number>,
  y: V.Vec<M, number>
) => O.Option<V.Vec<M, number>>
```

Added in v1.1.0

## diagonalFoldMap

**Signature**

```ts
export declare const diagonalFoldMap: <A>(Mn: Mon.Monoid<A>) => <M>(as: DiagonalMatrix<M, A>) => A
```

Added in v1.0.4

## diagonalInverse

**Signature**

```ts
export declare const diagonalInverse: <A>(F: Fld.Field<A>) => <M>(m: DiagonalMatrix<M, A>) => DiagonalMatrix<M, A>
```

Added in v1.0.0

## diagonalMap

**Signature**

```ts
export declare const diagonalMap: <A>(f: (a: A) => A) => <M>(m: DiagonalMatrix<M, A>) => DiagonalMatrix<M, A>
```

Added in v1.0.0

## forwardSub

See: Fundamentals of Matrix Computation, David S. Watkins, page 26. Returns O.none if
matrix is singular

**Signature**

```ts
export declare const forwardSub: <M>(
  L: LowerTriangularMatrix<M, number>,
  b: V.Vec<M, number>
) => O.Option<V.Vec<M, number>>
```

Added in v1.1.0

## orthogonalInverse

**Signature**

```ts
export declare const orthogonalInverse: <M extends number, A>(m: OrthogonalMatrix<M, A>) => OrthogonalMatrix<M, A>
```

Added in v1.1.0

# Model

## DiagonalMatrix (interface)

Diagonal Matricies

**Signature**

```ts
export interface DiagonalMatrix<M, A> extends M.Mat<M, M, A> {
  _URI: DiagonalSymbol
}
```

Added in v1.0.0

## LowerTriangularMatrix (interface)

Lower Triangular Matricies

**Signature**

```ts
export interface LowerTriangularMatrix<M, A> extends M.Mat<M, M, A> {
  _URI: LowerTriangularSymbol
}
```

Added in v1.0.0

## OrthogonalMatrix (interface)

Orthogonal Matricies

**Signature**

```ts
export interface OrthogonalMatrix<M, A> extends M.Mat<M, M, A> {
  _URI: OrthogonalSymbol
}
```

Added in v1.1.0

## UpperTriangularMatrix (interface)

Upper Triangular Matricies

**Signature**

```ts
export interface UpperTriangularMatrix<M, A> extends M.Mat<M, M, A> {
  _URI: UpperTriangularSymbol
}
```

Added in v1.0.0
