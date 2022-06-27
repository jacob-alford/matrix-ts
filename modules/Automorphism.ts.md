---
title: Automorphism.ts
nav_order: 1
parent: Modules
---

## Automorphism overview

An Automorphism is an endomorphic isomorphism. It's used in this library as a
structure-preserving linear isomorphism.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Instance Operations](#instance-operations)
  - [compose](#compose)
  - [identity](#identity)
- [Typeclasses](#typeclasses)
  - [Automorphism (interface)](#automorphism-interface)

---

# Instance Operations

## compose

**Signature**

```ts
export declare const compose: <A>(a: Automorphism<A>, b: Automorphism<A>) => Automorphism<A>
```

Added in v1.0.0

## identity

**Signature**

```ts
export declare const identity: <A>() => Automorphism<A>
```

Added in v1.0.0

# Typeclasses

## Automorphism (interface)

**Signature**

```ts
export interface Automorphism<A> extends Iso.Iso<A, A> {}
```

Added in v1.0.0
