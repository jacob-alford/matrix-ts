---
title: quaternion.ts
nav_order: 14
parent: Modules
---

## quaternion overview

A quaternion is a 4-component analog to complex numbers. Useful in a handful of cases
like the effecient and safe rotation of a 3-dimensional vector

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Aliases](#aliases)
  - [add](#add)
  - [div](#div)
  - [mul](#mul)
  - [sub](#sub)
- [Constructors](#constructors)
  - [fromVector3](#fromvector3)
  - [fromVector4](#fromvector4)
  - [i](#i)
  - [j](#j)
  - [k](#k)
  - [of](#of)
  - [one](#one)
  - [randQuaternion](#randquaternion)
  - [scalar](#scalar)
  - [zero](#zero)
- [Destructors](#destructors)
  - [IsoVector4](#isovector4)
  - [norm](#norm)
  - [toVector3](#tovector3)
  - [toVector4](#tovector4)
- [Infix](#infix)
  - [$\_](#_)
  - [\_](#_)
  - [\_$](#_)
- [Instance Operations](#instance-operations)
  - [recip](#recip)
  - [rotateVector](#rotatevector)
- [Instances](#instances)
  - [AdditiveAbelianGroup](#additiveabeliangroup)
  - [Bimodule](#bimodule)
  - [DivisionRing](#divisionring)
  - [Eq](#eq)
  - [MagmaSub](#magmasub)
  - [MonoidProduct](#monoidproduct)
  - [MonoidSum](#monoidsum)
  - [SemigroupProduct](#semigroupproduct)
  - [SemigroupSum](#semigroupsum)
  - [Show](#show)
  - [getRotationAutomorphism](#getrotationautomorphism)
- [Model](#model)
  - [Quaternion (interface)](#quaternion-interface)
- [Quaternion Ops](#quaternion-ops)
  - [asUnit](#asunit)
  - [conj](#conj)
  - [getRotationQuaternion](#getrotationquaternion)

---

# Aliases

## add

**Signature**

```ts
export declare const add: (x: Quaternion, y: Quaternion) => Quaternion
```

Added in v1.0.0

## div

**Signature**

```ts
export declare const div: (x: Quaternion, y: Quaternion) => Quaternion
```

Added in v1.0.0

## mul

**Signature**

```ts
export declare const mul: (x: Quaternion, y: Quaternion) => Quaternion
```

Added in v1.0.0

## sub

**Signature**

```ts
export declare const sub: (x: Quaternion, y: Quaternion) => Quaternion
```

Added in v1.0.0

# Constructors

## fromVector3

**Signature**

```ts
export declare const fromVector3: (v: V.Vec<3, number>) => Quaternion
```

Added in v1.0.0

## fromVector4

**Signature**

```ts
export declare const fromVector4: (v: V.Vec<4, number>) => Quaternion
```

Added in v1.0.0

## i

**Signature**

```ts
export declare const i: Quaternion
```

Added in v1.0.0

## j

**Signature**

```ts
export declare const j: Quaternion
```

Added in v1.0.0

## k

**Signature**

```ts
export declare const k: Quaternion
```

Added in v1.0.0

## of

**Signature**

```ts
export declare const of: (a: number, b: number, c: number, d: number) => Quaternion
```

Added in v1.0.0

## one

**Signature**

```ts
export declare const one: Quaternion
```

Added in v1.0.0

## randQuaternion

**Signature**

```ts
export declare const randQuaternion: (min: number, max: number) => IO.IO<Quaternion>
```

Added in v1.0.0

## scalar

**Signature**

```ts
export declare const scalar: (a: number) => Quaternion
```

Added in v1.0.0

## zero

**Signature**

```ts
export declare const zero: Quaternion
```

Added in v1.0.0

# Destructors

## IsoVector4

**Signature**

```ts
export declare const IsoVector4: Iso.Iso<Quaternion, V.Vec<4, number>>
```

Added in v1.0.0

## norm

**Signature**

```ts
export declare const norm: (q: Quaternion) => number
```

Added in v1.0.0

## toVector3

**Note:** Disregards the real part of a quaternion

**Signature**

```ts
export declare const toVector3: (q: Quaternion) => V.Vec<3, number>
```

Added in v1.0.0

## toVector4

**Signature**

```ts
export declare const toVector4: (q: Quaternion) => V.Vec<4, number>
```

Added in v1.0.0

# Infix

## $\_

**Signature**

```ts
export declare const $_: (s: Inf.DivisionRingSymbol, x: Quaternion, y: Quaternion) => Quaternion
```

Added in v1.0.0

## \_

**Signature**

```ts
export declare const _: (a: Quaternion, s: Inf.DivisionRingSymbol, b: Quaternion) => Quaternion
```

Added in v1.0.0

## \_$

**Signature**

```ts
export declare const _$: (a: Quaternion, b: Quaternion, s: Inf.DivisionRingSymbol) => Quaternion
```

Added in v1.0.0

# Instance Operations

## recip

**Signature**

```ts
export declare const recip: (q: Quaternion) => Quaternion
```

Added in v1.0.0

## rotateVector

**Signature**

```ts
export declare const rotateVector: (axis: V.Vec<3, number>, theta: number) => (v: V.Vec<3, number>) => V.Vec<3, number>
```

Added in v1.0.0

# Instances

## AdditiveAbelianGroup

**Signature**

```ts
export declare const AdditiveAbelianGroup: TC.AbelianGroup<Quaternion>
```

Added in v1.0.0

## Bimodule

**Signature**

```ts
export declare const Bimodule: TC.Bimodule<Quaternion, number, number>
```

Added in v1.0.0

## DivisionRing

**Signature**

```ts
export declare const DivisionRing: TC.DivisionRing<Quaternion>
```

Added in v1.0.0

## Eq

**Signature**

```ts
export declare const Eq: Eq_.Eq<Quaternion>
```

Added in v1.0.0

## MagmaSub

**Signature**

```ts
export declare const MagmaSub: Mg.Magma<Quaternion>
```

Added in v1.0.0

## MonoidProduct

**Signature**

```ts
export declare const MonoidProduct: Mn.Monoid<Quaternion>
```

Added in v1.0.0

## MonoidSum

**Signature**

```ts
export declare const MonoidSum: Mn.Monoid<Quaternion>
```

Added in v1.0.0

## SemigroupProduct

**Signature**

```ts
export declare const SemigroupProduct: Sg.Semigroup<Quaternion>
```

Added in v1.0.0

## SemigroupSum

**Signature**

```ts
export declare const SemigroupSum: Sg.Semigroup<Quaternion>
```

Added in v1.0.0

## Show

**Signature**

```ts
export declare const Show: Sh.Show<Quaternion>
```

Added in v1.0.0

## getRotationAutomorphism

**Signature**

```ts
export declare const getRotationAutomorphism: (
  axis: V.Vec<3, number>,
  theta: number
) => Auto.Automorphism<V.Vec<3, number>>
```

Added in v1.0.0

# Model

## Quaternion (interface)

**Signature**

```ts
export interface Quaternion {
  a: number
  b: number
  c: number
  d: number
}
```

Added in v1.0.0

# Quaternion Ops

## asUnit

**Signature**

```ts
export declare const asUnit: (q: Quaternion) => Quaternion
```

Added in v1.0.0

## conj

**Signature**

```ts
export declare const conj: (q: Quaternion) => Quaternion
```

Added in v1.0.0

## getRotationQuaternion

**Signature**

```ts
export declare const getRotationQuaternion: (axis: V.Vec<3, number>) => (theta: number) => Quaternion
```

Added in v1.0.0
