---
title: Iso.ts
nav_order: 8
parent: Modules
---

## Iso overview

Constrained isomorphisms. Compatible with `Iso` found in `monocle-ts`.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Instance Operations](#instance-operations)
  - [compose](#compose)
  - [identity](#identity)
- [Typeclasses](#typeclasses)
  - [Iso (interface)](#iso-interface)

---

# Instance Operations

## compose

**Signature**

```ts
export declare const compose: <A, B, C>(a: Iso<A, B>, b: Iso<B, C>) => Iso<A, C>
```

Added in v1.0.0

## identity

**Signature**

```ts
export declare const identity: <A>() => Iso<A, A>
```

Added in v1.0.0

# Typeclasses

## Iso (interface)

**Signature**

```ts
export interface Iso<A, B> {
  get: (a: A) => B
  reverseGet: (b: B) => A
}
```

Added in v1.0.0
