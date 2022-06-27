---
title: typeclasses.ts
nav_order: 16
parent: Modules
---

## typeclasses overview

A collection of typeclasses that add additional laws to existing fp-ts typeclasses.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Type classes](#type-classes)
  - [AbelianGroup (interface)](#abeliangroup-interface)
  - [Bimodule (interface)](#bimodule-interface)
  - [CommutativeRing (interface)](#commutativering-interface)
  - [DivisionRing (interface)](#divisionring-interface)
  - [EuclidianRing (interface)](#euclidianring-interface)
  - [LeftModule (interface)](#leftmodule-interface)
  - [RightModule (interface)](#rightmodule-interface)

---

# Type classes

## AbelianGroup (interface)

An `AbelianGroup` is a `Group` that abides the following laws:

- Commutativity: `a * b = b * a`

**Signature**

```ts
export interface AbelianGroup<A> extends Grp.Group<A> {}
```

Added in v1.0.0

## Bimodule (interface)

**Signature**

```ts
export interface Bimodule<A, L, R = L> extends LeftModule<A, L>, RightModule<A, R> {}
```

Added in v1.0.0

## CommutativeRing (interface)

Adapted from:
https://pursuit.purescript.org/packages/purescript-prelude/6.0.0/docs/Data.CommutativeRing

A Ring structure with commutativity of multiplcation

- Commutativity: `a * b = b * a`

**Signature**

```ts
export interface CommutativeRing<A> extends Rng.Ring<A> {}
```

Added in v1.0.0

## DivisionRing (interface)

Adapted from:
https://pursuit.purescript.org/packages/purescript-prelude/6.0.0/docs/Data.DivisionRing

A ring structure with division

- One != zero
- Nonzero multiplicative inverse

**Signature**

```ts
export interface DivisionRing<A> extends Rng.Ring<A> {
  readonly recip: (x: A) => A
}
```

Added in v1.0.0

## EuclidianRing (interface)

Adapted from:
https://pursuit.purescript.org/packages/purescript-prelude/6.0.0/docs/Data.EuclideanRing

**Signature**

```ts
export interface EuclidianRing<A> extends CommutativeRing<A> {
  readonly degree: (a: A) => number
  readonly div: (x: A, y: A) => A
  readonly mod: (x: A, y: A) => A
}
```

Added in v1.0.0

## LeftModule (interface)

A `Module` over a Ring R extends an Abelian Group A follows all the laws for an Abelian
Group and the following:

- Distributivity over the Abelian Group: `r * (x + y) = r * x + r * y`
- Distributivity over the Ring R: `(r + s) * x = r * x + s * x`
- Associativity over the Ring R: `(r * s) * x = r * (s * x)`
- Unital element over the Ring R: `1 * x = x`

**Signature**

```ts
export interface LeftModule<A, L> extends AbelianGroup<A> {
  readonly leftScalarMul: (r: L, x: A) => A
}
```

Added in v1.0.0

## RightModule (interface)

See `LeftModule` for Module laws

**Signature**

```ts
export interface RightModule<A, R> extends AbelianGroup<A> {
  readonly rightScalarMul: (x: A, r: R) => A
}
```

Added in v1.0.0
