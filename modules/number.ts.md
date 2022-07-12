---
title: number.ts
nav_order: 12
parent: Modules
---

## number overview

Typeclass instances for Javascript's 64-bit floating point number type. **Note:**
instances are not strictly law abiding as floating point error violates particular
instance laws with more complex computation.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Aliases](#aliases)
  - [add](#add)
  - [degree](#degree)
  - [div](#div)
  - [mod](#mod)
  - [mul](#mul)
  - [sub](#sub)
- [Constructors](#constructors)
  - [one](#one)
  - [onesN](#onesn)
  - [randExp](#randexp)
  - [randNorm](#randnorm)
  - [randNumber](#randnumber)
  - [zero](#zero)
  - [zerosN](#zerosn)
- [Infix](#infix)
  - [$\_](#_)
  - [\_](#_)
  - [\_$](#_)
- [Instances](#instances)
  - [AdditiveAbGrpMN](#additiveabgrpmn)
  - [AdditiveAbGrpN](#additiveabgrpn)
  - [BiModMN](#bimodmn)
  - [BiModN](#bimodn)
  - [Bounded](#bounded)
  - [Eq](#eq)
  - [Field](#field)
  - [MagmaSub](#magmasub)
  - [MonoidProduct](#monoidproduct)
  - [MonoidProductMM](#monoidproductmm)
  - [MonoidSum](#monoidsum)
  - [Ord](#ord)
  - [PolynomialAdditiveAbelianGroup](#polynomialadditiveabeliangroup)
  - [PolynomialBimodule](#polynomialbimodule)
  - [PolynomialEuclidianRing](#polynomialeuclidianring)
  - [PolynomialRing](#polynomialring)
  - [SemigroupProduct](#semigroupproduct)
  - [SemigroupSum](#semigroupsum)
  - [Show](#show)
  - [get2dRotation](#get2drotation)
  - [get3dXRotation](#get3dxrotation)
  - [get3dYRotation](#get3dyrotation)
  - [get3dZRotation](#get3dzrotation)
  - [getDifferentialAutomorphism](#getdifferentialautomorphism)
- [Matrix Operations](#matrix-operations)
  - [addM](#addm)
  - [addV](#addv)
  - [idMat](#idmat)
  - [linMap](#linmap)
  - [linMapR](#linmapr)
  - [mulM](#mulm)
  - [subM](#subm)
  - [subV](#subv)
  - [trace](#trace)
- [Model](#model)
  - [Mat (type alias)](#mat-type-alias)
  - [Vec (type alias)](#vec-type-alias)
- [Polynomial Operations](#polynomial-operations)
  - [derivative](#derivative)
  - [evaluatePolynomial](#evaluatepolynomial)
  - [getAntiderivative](#getantiderivative)
  - [integrate](#integrate)
  - [polynomialInnerProduct](#polynomialinnerproduct)
  - [polynomialNorm](#polynomialnorm)
  - [polynomialProjection](#polynomialprojection)
- [Vector Operations](#vector-operations)
  - [cross](#cross)
  - [dot](#dot)
  - [l1Norm](#l1norm)
  - [l2Norm](#l2norm)
  - [lInfNorm](#linfnorm)
  - [lpNorm](#lpnorm)
  - [outerProduct](#outerproduct)
  - [projection](#projection)

---

# Aliases

## add

**Signature**

```ts
export declare const add: (x: number, y: number) => number
```

Added in v1.0.0

## degree

**Signature**

```ts
export declare const degree: (a: number) => number
```

Added in v1.0.0

## div

**Signature**

```ts
export declare const div: (x: number, y: number) => number
```

Added in v1.0.0

## mod

**Signature**

```ts
export declare const mod: (x: number, y: number) => number
```

Added in v1.0.0

## mul

**Signature**

```ts
export declare const mul: (x: number, y: number) => number
```

Added in v1.0.0

## sub

**Signature**

```ts
export declare const sub: (x: number, y: number) => number
```

Added in v1.0.0

# Constructors

## one

**Signature**

```ts
export declare const one: 1
```

Added in v1.0.0

## onesN

**Signature**

```ts
export declare const onesN: <N extends number>(n: N) => Vec<N>
```

Added in v1.1.0

## randExp

Exponential random variable with parameter `λ`

**Signature**

```ts
export declare const randExp: (λ: number) => IO.IO<number>
```

Added in v1.1.0

## randNorm

Normal random variable with mean `μ` and standard deviation `σ`. Uses the Box-Muller transform

**Signature**

```ts
export declare const randNorm: (μ?: number | undefined, σ?: number | undefined) => IO.IO<number>
```

Added in v1.1.0

## randNumber

Uniform random variable in the interval: `[low, high)`

**Signature**

```ts
export declare const randNumber: (low: number, high: number) => IO.IO<number>
```

Added in v1.0.0

## zero

**Signature**

```ts
export declare const zero: 0
```

Added in v1.0.0

## zerosN

**Signature**

```ts
export declare const zerosN: <N extends number>(n: N) => Vec<N>
```

Added in v1.1.0

# Infix

## $\_

**Signature**

```ts
export declare const $_: (s: Inf.FieldSymbol, x: number, y: number) => number
```

Added in v1.0.0

## \_

**Signature**

```ts
export declare const _: (a: number, s: Inf.FieldSymbol, b: number) => number
```

Added in v1.0.0

## \_$

**Signature**

```ts
export declare const _$: (a: number, b: number, s: Inf.FieldSymbol) => number
```

Added in v1.0.0

# Instances

## AdditiveAbGrpMN

**Signature**

```ts
export declare const AdditiveAbGrpMN: <M, N>(m: M, n: N) => AbelianGroup<M.Mat<M, N, number>>
```

Added in v1.0.0

## AdditiveAbGrpN

**Signature**

```ts
export declare const AdditiveAbGrpN: <N>(n: N) => AbelianGroup<V.Vec<N, number>>
```

Added in v1.0.0

## BiModMN

**Signature**

```ts
export declare const BiModMN: <M, N>(m: M, n: N) => Bimodule<M.Mat<M, N, number>, number, number>
```

Added in v1.0.0

## BiModN

**Signature**

```ts
export declare const BiModN: <N>(n: N) => Bimodule<V.Vec<N, number>, number, number>
```

Added in v1.0.0

## Bounded

**Signature**

```ts
export declare const Bounded: Bounded<number>
```

Added in v1.0.0

## Eq

**Signature**

```ts
export declare const Eq: Eq<number>
```

Added in v1.0.0

## Field

**Signature**

```ts
export declare const Field: Field<number>
```

Added in v1.0.0

## MagmaSub

**Signature**

```ts
export declare const MagmaSub: Magma<number>
```

Added in v1.0.0

## MonoidProduct

**Signature**

```ts
export declare const MonoidProduct: Monoid<number>
```

Added in v1.0.0

## MonoidProductMM

**Signature**

```ts
export declare const MonoidProductMM: <M>(m: M) => Monoid<M.Mat<M, M, number>>
```

Added in v1.1.0

## MonoidSum

**Signature**

```ts
export declare const MonoidSum: Monoid<number>
```

Added in v1.0.0

## Ord

**Signature**

```ts
export declare const Ord: Ord<number>
```

Added in v1.0.0

## PolynomialAdditiveAbelianGroup

**Signature**

```ts
export declare const PolynomialAdditiveAbelianGroup: AbelianGroup<Poly.Polynomial<number>>
```

Added in v1.0.0

## PolynomialBimodule

**Signature**

```ts
export declare const PolynomialBimodule: Bimodule<Poly.Polynomial<number>, number, number>
```

Added in v1.0.0

## PolynomialEuclidianRing

**Signature**

```ts
export declare const PolynomialEuclidianRing: EuclidianRing<Poly.Polynomial<number>>
```

Added in v1.0.0

## PolynomialRing

**Signature**

```ts
export declare const PolynomialRing: CommutativeRing<Poly.Polynomial<number>>
```

Added in v1.0.0

## SemigroupProduct

**Signature**

```ts
export declare const SemigroupProduct: Semigroup<number>
```

Added in v1.0.0

## SemigroupSum

**Signature**

```ts
export declare const SemigroupSum: Semigroup<number>
```

Added in v1.0.0

## Show

**Signature**

```ts
export declare const Show: Show<number>
```

Added in v1.0.0

## get2dRotation

**Signature**

```ts
export declare const get2dRotation: (theta: number) => Auto.Automorphism<V.Vec<2, number>>
```

Added in v1.0.0

## get3dXRotation

**Signature**

```ts
export declare const get3dXRotation: (theta: number) => Auto.Automorphism<V.Vec<3, number>>
```

Added in v1.0.0

## get3dYRotation

**Signature**

```ts
export declare const get3dYRotation: (theta: number) => Auto.Automorphism<V.Vec<3, number>>
```

Added in v1.0.0

## get3dZRotation

**Signature**

```ts
export declare const get3dZRotation: (theta: number) => Auto.Automorphism<V.Vec<3, number>>
```

Added in v1.0.0

## getDifferentialAutomorphism

**Signature**

```ts
export declare const getDifferentialAutomorphism: (constantTerm: number) => Auto.Automorphism<Poly.Polynomial<number>>
```

Added in v1.0.0

# Matrix Operations

## addM

Add two matricies

**Signature**

```ts
export declare const addM: <M, N>(x: M.Mat<M, N, number>, y: M.Mat<M, N, number>) => M.Mat<M, N, number>
```

Added in v1.1.0

## addV

Add two vectors

**Signature**

```ts
export declare const addV: <N>(x: V.Vec<N, number>, y: V.Vec<N, number>) => V.Vec<N, number>
```

Added in v1.1.0

## idMat

**Signature**

```ts
export declare const idMat: <M>(m: M) => M.Mat<M, M, number>
```

Added in v1.0.0

## linMap

Transform a column vector `x` into vector `b` by matrix `A`

```math
Ax = b
```

Efficiency: `2mn` flops

**Signature**

```ts
export declare const linMap: <M, N1, N2>(A: M.Mat<M, N1, number>, x: V.Vec<N2, number>) => V.Vec<M, number>
```

Added in v1.0.0

## linMapR

Transform a row-vector `x` into vector `b` by matrix `A`

```math
xA = b
```

Efficiency: `2mn` flops

**Signature**

```ts
export declare const linMapR: <M, N1, N2>(x: V.Vec<N1, number>, A: M.Mat<N2, M, number>) => V.Vec<M, number>
```

Added in v1.1.0

## mulM

Multiply two matricies with matching inner dimensions

```math
(A ∈ R_mn) (B ∈ R_np) = C ∈ R_mp
```

Efficiency: `2mpn` flops

**Signature**

```ts
export declare const mulM: <M, N1, N2, P>(x: M.Mat<M, N1, number>, y: M.Mat<N2, P, number>) => M.Mat<M, P, number>
```

Added in v1.0.0

## subM

Subtract two matricies

**Signature**

```ts
export declare const subM: <M, N>(x: M.Mat<M, N, number>, y: M.Mat<M, N, number>) => M.Mat<M, N, number>
```

Added in v1.1.0

## subV

Subtract two vectors

**Signature**

```ts
export declare const subV: <N>(x: V.Vec<N, number>, y: V.Vec<N, number>) => V.Vec<N, number>
```

Added in v1.1.0

## trace

The sum of the diagonal elements

Efficiency: `m` flops (for numeric Ring)

**Signature**

```ts
export declare const trace: <M>(fa: M.Mat<M, M, number>) => number
```

Added in v1.0.0

# Model

## Mat (type alias)

**Signature**

```ts
export type Mat<M, N> = M.Mat<M, N, number>
```

Added in v1.0.0

## Vec (type alias)

**Signature**

```ts
export type Vec<N> = V.Vec<N, number>
```

Added in v1.0.0

# Polynomial Operations

## derivative

**Signature**

```ts
export declare const derivative: (coeffs: Poly.Polynomial<number>) => Poly.Polynomial<number>
```

Added in v1.0.0

## evaluatePolynomial

**Signature**

```ts
export declare const evaluatePolynomial: (p: Poly.Polynomial<number>) => (x: number) => number
```

Added in v1.0.0

## getAntiderivative

**Signature**

```ts
export declare const getAntiderivative: (
  constantTerm: number
) => (p: Poly.Polynomial<number>) => Poly.Polynomial<number>
```

Added in v1.0.0

## integrate

**Signature**

```ts
export declare const integrate: (lower: number, upper: number) => (p: Poly.Polynomial<number>) => number
```

Added in v1.0.0

## polynomialInnerProduct

**Signature**

```ts
export declare const polynomialInnerProduct: (p: Poly.Polynomial<number>, q: Poly.Polynomial<number>) => number
```

Added in v1.0.0

## polynomialNorm

**Signature**

```ts
export declare const polynomialNorm: (p: Poly.Polynomial<number>) => number
```

Added in v1.0.0

## polynomialProjection

**Signature**

```ts
export declare const polynomialProjection: (
  p: Poly.Polynomial<number>,
  q: Poly.Polynomial<number>
) => Poly.Polynomial<number>
```

Added in v1.0.0

# Vector Operations

## cross

**Signature**

```ts
export declare const cross: (x: V.Vec<3, number>, y: V.Vec<3, number>) => V.Vec<3, number>
```

Added in v1.0.0

## dot

**Signature**

```ts
export declare const dot: <N>(x: V.Vec<N, number>, y: V.Vec<N, number>) => number
```

Added in v1.0.0

## l1Norm

**Signature**

```ts
export declare const l1Norm: <N>(x: V.Vec<N, number>) => number
```

Added in v1.0.0

## l2Norm

**Signature**

```ts
export declare const l2Norm: <N>(x: V.Vec<N, number>) => number
```

Added in v1.0.0

## lInfNorm

**Signature**

```ts
export declare const lInfNorm: <N>(x: V.Vec<N, number>) => number
```

Added in v1.0.0

## lpNorm

**Signature**

```ts
export declare const lpNorm: (p: number) => <N>(v: V.Vec<N, number>) => number
```

Added in v1.0.0

## outerProduct

**Signature**

```ts
export declare const outerProduct: <M, N>(v1: V.Vec<M, number>, v2: V.Vec<N, number>) => M.Mat<M, N, number>
```

Added in v1.0.0

## projection

**Signature**

```ts
export declare const projection: <N>(u: V.Vec<N, number>, v: V.Vec<N, number>) => V.Vec<N, number>
```

Added in v1.0.0
