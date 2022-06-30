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
- [Model](#model)
  - [Decomposition (interface)](#decomposition-interface)
  - [Determinant (interface)](#determinant-interface)
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
    number,
    [MatTypes.LowerTriangularMatrix<M, number>, MatTypes.UpperTriangularMatrix<M, number>, M.Mat<M, M, number>]
  > &
    Solvable<M, number> &
    Determinant
>
```

Added in v1.0.0

# Model

## Decomposition (interface)

**Signature**

```ts
export interface Decomposition<M, R, A> {
  input: M.Mat<M, M, R>
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
