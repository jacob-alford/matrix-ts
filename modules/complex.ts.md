---
title: complex.ts
nav_order: 2
parent: Modules
---

## complex overview

A complex data of the shape: `a + bi` which has a real component, and an imaginary
component. Both are represented with Javascript's 64-bit floating point numbers.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Aliases](#aliases)
  - [add](#add)
  - [div](#div)
  - [mul](#mul)
  - [sub](#sub)
- [Complex Ops](#complex-ops)
  - [conj](#conj)
  - [pow](#pow)
  - [sqrt](#sqrt)
- [Constructors](#constructors)
  - [fromPolarDegrees](#frompolardegrees)
  - [fromPolarRadians](#frompolarradians)
  - [fromVector](#fromvector)
  - [of](#of)
  - [one](#one)
  - [randComplex](#randcomplex)
  - [scalar](#scalar)
  - [zero](#zero)
- [Destructors](#destructors)
  - [argumentDegrees](#argumentdegrees)
  - [argumentRadians](#argumentradians)
  - [modulus](#modulus)
  - [toVector](#tovector)
- [Infix](#infix)
  - [$\_](#_)
  - [\_](#_)
  - [\_$](#_)
- [Instances](#instances)
  - [AdditiveAbGrpMN](#additiveabgrpmn)
  - [AdditiveAbGrpN](#additiveabgrpn)
  - [BiModMN](#bimodmn)
  - [BiModN](#bimodn)
  - [ComplexAdditiveAbelianGroup](#complexadditiveabeliangroup)
  - [ComplexBimodule](#complexbimodule)
  - [Eq](#eq)
  - [Field](#field)
  - [MagmaSub](#magmasub)
  - [MonoidProduct](#monoidproduct)
  - [MonoidSum](#monoidsum)
  - [PolynomialAdditiveAbelianGroup](#polynomialadditiveabeliangroup)
  - [PolynomialBimodule](#polynomialbimodule)
  - [PolynomialEuclidianRing](#polynomialeuclidianring)
  - [PolynomialRing](#polynomialring)
  - [SemigroupProduct](#semigroupproduct)
  - [SemigroupSum](#semigroupsum)
  - [Show](#show)
  - [getDifferentialAutomorphism](#getdifferentialautomorphism)
- [Isomorphisms](#isomorphisms)
  - [IsoVector](#isovector)
- [Matrix Operations](#matrix-operations)
  - [idMat](#idmat)
  - [linMap](#linmap)
  - [mulM](#mulm)
  - [trace](#trace)
- [Model](#model)
  - [Complex (interface)](#complex-interface)
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
  - [lpNorm](#lpnorm)
  - [outerProduct](#outerproduct)
  - [projection](#projection)

---

# Aliases

## add

**Signature**

```ts
export declare const add: (x: Complex, y: Complex) => Complex
```

Added in v1.0.0

## div

**Signature**

```ts
export declare const div: (x: Complex, y: Complex) => Complex
```

Added in v1.0.0

## mul

**Signature**

```ts
export declare const mul: (x: Complex, y: Complex) => Complex
```

Added in v1.0.0

## sub

**Signature**

```ts
export declare const sub: (x: Complex, y: Complex) => Complex
```

Added in v1.0.0

# Complex Ops

## conj

**Signature**

```ts
export declare const conj: (c: Complex) => Complex
```

Added in v1.0.0

## pow

**Signature**

```ts
export declare const pow: (c: Complex, n: number) => Complex
```

Added in v1.0.0

## sqrt

**Signature**

```ts
export declare const sqrt: (c: Complex) => Complex
```

Added in v1.0.0

# Constructors

## fromPolarDegrees

Converts a polar-form complex tuple to `Complex`

Note, theta here is in degrees

**Signature**

```ts
export declare const fromPolarDegrees: (r: number, theta: number) => Complex
```

Added in v1.0.0

## fromPolarRadians

Converts a polar-form complex tuple to `Complex`

Note, psi here is in radians

**Signature**

```ts
export declare const fromPolarRadians: (r: number, psi: number) => Complex
```

Added in v1.0.0

## fromVector

**Signature**

```ts
export declare const fromVector: (v: V.Vec<2, number>) => Complex
```

Added in v1.0.0

## of

**Signature**

```ts
export declare const of: (Re: number, Im: number) => Complex
```

Added in v1.0.0

## one

**Signature**

```ts
export declare const one: Complex
```

Added in v1.0.0

## randComplex

**Signature**

```ts
export declare const randComplex: (min: number, max: number) => IO.IO<Complex>
```

Added in v1.0.0

## scalar

**Signature**

```ts
export declare const scalar: (a: number) => Complex
```

Added in v1.0.0

## zero

**Signature**

```ts
export declare const zero: Complex
```

Added in v1.0.0

# Destructors

## argumentDegrees

**Signature**

```ts
export declare const argumentDegrees: (c: Complex) => O.Option<number>
```

Added in v1.0.0

## argumentRadians

**Signature**

```ts
export declare const argumentRadians: (c: Complex) => O.Option<number>
```

Added in v1.0.0

## modulus

**Signature**

```ts
export declare const modulus: (c: Complex) => number
```

Added in v1.0.0

## toVector

**Signature**

```ts
export declare const toVector: (c: Complex) => V.Vec<2, number>
```

Added in v1.0.0

# Infix

## $\_

**Signature**

```ts
export declare const $_: (s: Inf.FieldSymbol, x: Complex, y: Complex) => Complex
```

Added in v1.0.0

## \_

**Signature**

```ts
export declare const _: (a: Complex, s: Inf.FieldSymbol, b: Complex) => Complex
```

Added in v1.0.0

## \_$

**Signature**

```ts
export declare const _$: (a: Complex, b: Complex, s: Inf.FieldSymbol) => Complex
```

Added in v1.0.0

# Instances

## AdditiveAbGrpMN

**Signature**

```ts
export declare const AdditiveAbGrpMN: <M, N>(m: M, n: N) => TC.AbelianGroup<M.Mat<M, N, Complex>>
```

Added in v1.0.0

## AdditiveAbGrpN

**Signature**

```ts
export declare const AdditiveAbGrpN: <N>(n: N) => TC.AbelianGroup<V.Vec<N, Complex>>
```

Added in v1.0.0

## BiModMN

**Signature**

```ts
export declare const BiModMN: <M, N>(m: M, n: N) => TC.Bimodule<M.Mat<M, N, Complex>, Complex, Complex>
```

Added in v1.0.0

## BiModN

**Signature**

```ts
export declare const BiModN: <N>(n: N) => TC.Bimodule<V.Vec<N, Complex>, Complex, Complex>
```

Added in v1.0.0

## ComplexAdditiveAbelianGroup

**Signature**

```ts
export declare const ComplexAdditiveAbelianGroup: TC.AbelianGroup<Complex>
```

Added in v1.0.0

## ComplexBimodule

**Signature**

```ts
export declare const ComplexBimodule: TC.Bimodule<Complex, number, number>
```

Added in v1.0.0

## Eq

**Signature**

```ts
export declare const Eq: Eq_.Eq<Complex>
```

Added in v1.0.0

## Field

**Signature**

```ts
export declare const Field: Fld.Field<Complex>
```

Added in v1.0.0

## MagmaSub

**Signature**

```ts
export declare const MagmaSub: Mg.Magma<Complex>
```

Added in v1.0.0

## MonoidProduct

**Signature**

```ts
export declare const MonoidProduct: Mn.Monoid<Complex>
```

Added in v1.0.0

## MonoidSum

**Signature**

```ts
export declare const MonoidSum: Mn.Monoid<Complex>
```

Added in v1.0.0

## PolynomialAdditiveAbelianGroup

**Signature**

```ts
export declare const PolynomialAdditiveAbelianGroup: TC.AbelianGroup<Poly.Polynomial<Complex>>
```

Added in v1.0.0

## PolynomialBimodule

**Signature**

```ts
export declare const PolynomialBimodule: TC.Bimodule<Poly.Polynomial<Complex>, Complex, Complex>
```

Added in v1.0.0

## PolynomialEuclidianRing

**Signature**

```ts
export declare const PolynomialEuclidianRing: TC.EuclidianRing<Poly.Polynomial<Complex>>
```

Added in v1.0.0

## PolynomialRing

**Signature**

```ts
export declare const PolynomialRing: TC.CommutativeRing<Poly.Polynomial<Complex>>
```

Added in v1.0.0

## SemigroupProduct

**Signature**

```ts
export declare const SemigroupProduct: Sg.Semigroup<Complex>
```

Added in v1.0.0

## SemigroupSum

**Signature**

```ts
export declare const SemigroupSum: Sg.Semigroup<Complex>
```

Added in v1.0.0

## Show

**Signature**

```ts
export declare const Show: Sh.Show<Complex>
```

Added in v1.0.0

## getDifferentialAutomorphism

**Signature**

```ts
export declare const getDifferentialAutomorphism: (constantTerm: Complex) => Auto.Automorphism<Poly.Polynomial<Complex>>
```

Added in v1.0.0

# Isomorphisms

## IsoVector

**Signature**

```ts
export declare const IsoVector: Iso.Iso<Complex, V.Vec<2, number>>
```

Added in v1.0.0

# Matrix Operations

## idMat

**Signature**

```ts
export declare const idMat: <M>(m: M) => M.Mat<M, M, Complex>
```

Added in v1.0.0

## linMap

Map a vector with length `N`, with a matrix A with size `MxN`, to a vector of length `M`.

**Signature**

```ts
export declare const linMap: <M, N>(A: M.Mat<M, N, Complex>, x: V.Vec<N, Complex>) => V.Vec<M, Complex>
```

Added in v1.0.0

## mulM

Compose two matricies: `A`, and `B` with Matrix multiplication.

For A in `MxN`, and B in `NxP` returns `AB` in `MxP`.

**Signature**

```ts
export declare const mulM: <M, N, P>(x: M.Mat<M, N, Complex>, y: M.Mat<N, P, Complex>) => M.Mat<M, P, Complex>
```

Added in v1.0.0

## trace

**Signature**

```ts
export declare const trace: <M>(fa: M.Mat<M, M, Complex>) => Complex
```

Added in v1.0.0

# Model

## Complex (interface)

**Signature**

```ts
export interface Complex {
  readonly Re: number
  readonly Im: number
}
```

Added in v1.0.0

## Mat (type alias)

**Signature**

```ts
export type Mat<M, N> = M.Mat<M, N, Complex>
```

Added in v1.0.0

## Vec (type alias)

**Signature**

```ts
export type Vec<N> = V.Vec<N, Complex>
```

Added in v1.0.0

# Polynomial Operations

## derivative

**Signature**

```ts
export declare const derivative: (coeffs: Poly.Polynomial<Complex>) => Poly.Polynomial<Complex>
```

Added in v1.0.0

## evaluatePolynomial

**Signature**

```ts
export declare const evaluatePolynomial: (p: Poly.Polynomial<Complex>) => (x: Complex) => Complex
```

Added in v1.0.0

## getAntiderivative

**Signature**

```ts
export declare const getAntiderivative: (
  constantTerm: Complex
) => (p: Poly.Polynomial<Complex>) => Poly.Polynomial<Complex>
```

Added in v1.0.0

## integrate

**Signature**

```ts
export declare const integrate: (lower: Complex, upper: Complex) => (p: Poly.Polynomial<Complex>) => Complex
```

Added in v1.0.0

## polynomialInnerProduct

**Signature**

```ts
export declare const polynomialInnerProduct: (p: Poly.Polynomial<Complex>, q: Poly.Polynomial<Complex>) => Complex
```

Added in v1.0.0

## polynomialNorm

**Signature**

```ts
export declare const polynomialNorm: (p: Poly.Polynomial<Complex>) => Complex
```

Added in v1.0.0

## polynomialProjection

**Signature**

```ts
export declare const polynomialProjection: (
  p: Poly.Polynomial<Complex>,
  q: Poly.Polynomial<Complex>
) => Poly.Polynomial<Complex>
```

Added in v1.0.0

# Vector Operations

## cross

**Signature**

```ts
export declare const cross: (x: V.Vec<3, Complex>, y: V.Vec<3, Complex>) => V.Vec<3, Complex>
```

Added in v1.0.0

## dot

**Signature**

```ts
export declare const dot: <N>(x: V.Vec<N, Complex>, y: V.Vec<N, Complex>) => Complex
```

Added in v1.0.0

## l1Norm

**Signature**

```ts
export declare const l1Norm: <N>(x: V.Vec<N, Complex>) => Complex
```

Added in v1.0.0

## l2Norm

**Signature**

```ts
export declare const l2Norm: <N>(x: V.Vec<N, Complex>) => Complex
```

Added in v1.0.0

## lpNorm

**Signature**

```ts
export declare const lpNorm: (p: number) => <N>(v: V.Vec<N, Complex>) => Complex
```

Added in v1.0.0

## outerProduct

**Signature**

```ts
export declare const outerProduct: <M, N>(v1: V.Vec<M, Complex>, v2: V.Vec<N, Complex>) => M.Mat<M, N, Complex>
```

Added in v1.0.0

## projection

**Signature**

```ts
export declare const projection: <N>(u: V.Vec<N, Complex>, v: V.Vec<N, Complex>) => V.Vec<N, Complex>
```

Added in v1.0.0
