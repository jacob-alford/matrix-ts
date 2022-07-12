---
title: Decomposition.ts
nav_order: 4
parent: Modules
---

## Decomposition overview

Decompose matricies into various forms, such as `LUP`. Can be used in various
applications like solving a system of equations, or calculating the principle
components of a multivariate distribution (SVD)

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Constructors](#constructors)
  - [LUP](#lup)
  - [QR](#qr)
- [Model](#model)
  - [Decomposition (interface)](#decomposition-interface)
  - [Determinant (interface)](#determinant-interface)
  - [IsSingular (interface)](#issingular-interface)
  - [LeastSquares (interface)](#leastsquares-interface)
  - [Rank (interface)](#rank-interface)
  - [Solvable (interface)](#solvable-interface)

---

# Constructors

## LUP

Decomposition of a square matrix into a lower triangular matrix L and an upper
triangular matrix U, with a permutation matrix P, such that:

```math
PA = LU
```

**Signature**

```ts
export declare const LUP: <M extends number>(
  m: M.Mat<M, M, number>
) => C.Computation<
  string,
  Decomposition<
    M,
    M,
    number,
    [
      MatTypes.LowerTriangularMatrix<M, number>,
      MatTypes.UpperTriangularMatrix<M, number>,
      MatTypes.OrthogonalMatrix<M, number>
    ]
  > &
    Solvable<M, number> &
    Determinant
>
```

Added in v1.0.0

## QR

QR decomposition with column pivoting using Householder Reflections. Based on an
algorithm described in Fundamentals of Matrix Computations, David S. Watkins.

Can be used to calculate a matrix's:

- Singularity
- Rank
- Least Square Solution for overdetermined systems

Efficiency: `O(n^3)`

Returns a tuple with:

- `A'`: The assembled matrix R with lower triangular components being orthogonal vectors
  collectively used to construct the reflector `Q`.
- `Q`: An IO that returns a constructed reflector `Q`. This has the same efficiency as QR
  decomposition itself, so evaluation is deferred.
- `R`: The upper triangular matrix extracted from `A'`.
- `P`: The permutation matrix used to permute the columns of `A`

QR decomposes a matrix A into a matrix `Q`, a matrix `R`, and a matrix `P` such that:

```math
AP = QR
```

**Signature**

```ts
export declare function QR<N extends number, M extends number>(
  mat: M.Mat<N, M, number>
): C.Computation<
  string,
  Decomposition<
    N,
    M,
    number,
    [
      M.Mat<N, M, number>,
      IO.IO<MatTypes.OrthogonalMatrix<N, number>>,
      M.Mat<N, M, number>,
      MatTypes.OrthogonalMatrix<M, number>
    ]
  > &
    IsSingular &
    Rank &
    LeastSquares<N, M, number>
>
```

Added in v1.1.0

# Model

## Decomposition (interface)

**Signature**

```ts
export interface Decomposition<N, M, R, A> {
  input: M.Mat<N, M, R>
  result: A
}
```

Added in v1.0.0

## Determinant (interface)

Represents the result of a computation that can be used to calculate the determinant

**Signature**

```ts
export interface Determinant {
  det: IO.IO<number>
}
```

Added in v1.0.4

## IsSingular (interface)

Determines if `A` is singular

**Signature**

```ts
export interface IsSingular {
  isSingular: boolean
}
```

Added in v1.1.0

## LeastSquares (interface)

Represents a solution to an overdetermined system. Returns O.none if the `rank(A) < m`
(the number of columns). Returns a tuple with the residual, and solution vector

**Signature**

```ts
export interface LeastSquares<N, M, R> {
  solve: (b: V.Vec<N, R>) => C.Computation<string, [number, V.Vec<M, R>]>
}
```

Added in v1.1.0

## Rank (interface)

Returns the Rank of A

**Signature**

```ts
export interface Rank {
  rank: number
}
```

Added in v1.1.0

## Solvable (interface)

Represents the result of a computation that can solve:

```math
Ax = b
```

**Signature**

```ts
export interface Solvable<M, R> {
  solve: (b: V.Vec<M, R>) => V.Vec<M, R>
}
```

Added in v1.0.4
