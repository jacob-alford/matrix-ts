---
title: Computation.ts
nav_order: 3
parent: Modules
---

## Computation overview

A Computation is a way to chain consecutive operations while collecting logs. It's
useful for guarding against unwanted input conditions, and is used in this libary for
matrix decomposition.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Combinators](#combinators)
  - [apFirst](#apfirst)
  - [apSecond](#apsecond)
  - [chainEitherK](#chaineitherk)
  - [chainFirst](#chainfirst)
  - [chainOptionK](#chainoptionk)
- [Constructors](#constructors)
  - [of](#of)
- [Do Notation](#do-notation)
  - [Do](#do)
  - [apS](#aps)
  - [bind](#bind)
  - [bindTo](#bindto)
  - [bindW](#bindw)
- [Instance Operations](#instance-operations)
  - [Apply](#apply)
  - [ap](#ap)
  - [bimap](#bimap)
  - [chain](#chain)
  - [fromEither](#fromeither)
  - [map](#map)
  - [mapLeft](#mapleft)
  - [throwError](#throwerror)
- [Instances](#instances)
  - [Applicative](#applicative)
  - [Bifunctor](#bifunctor)
  - [Chain](#chain)
  - [FromEither](#fromeither)
  - [Functor](#functor)
  - [Monad](#monad)
  - [MonadThrow](#monadthrow)
  - [URI](#uri)
  - [URI (type alias)](#uri-type-alias)
- [Model](#model)
  - [Computation (type alias)](#computation-type-alias)
- [Natural Transformations](#natural-transformations)
  - [fromOption](#fromoption)
- [Refinements](#refinements)
  - [isLeft](#isleft)
  - [isRight](#isright)
- [Utilities](#utilities)
  - [filter](#filter)
  - [filterOptionK](#filteroptionk)
  - [log](#log)
  - [logOption](#logoption)
  - [tell](#tell)

---

# Combinators

## apFirst

**Signature**

```ts
export declare const apFirst: <E, B>(second: Computation<E, B>) => <A>(first: Computation<E, A>) => Computation<E, A>
```

Added in v1.0.0

## apSecond

**Signature**

```ts
export declare const apSecond: <E, B>(second: Computation<E, B>) => <A>(first: Computation<E, A>) => Computation<E, B>
```

Added in v1.0.0

## chainEitherK

**Signature**

```ts
export declare const chainEitherK: <A, E, B>(
  f: (a: A) => E.Either<E, B>
) => (ma: Computation<E, A>) => Computation<E, B>
```

Added in v1.0.0

## chainFirst

**Signature**

```ts
export declare const chainFirst: <A, E, B>(
  f: (a: A) => Computation<E, B>
) => (first: Computation<E, A>) => Computation<E, A>
```

Added in v1.0.0

## chainOptionK

**Signature**

```ts
export declare const chainOptionK: <E>(
  onNone: Lazy<E>
) => <A, B>(f: (a: A) => O.Option<B>) => (ma: Computation<E, A>) => Computation<E, B>
```

Added in v1.0.0

# Constructors

## of

**Signature**

```ts
export declare const of: <A>(value: A) => Computation<never, A>
```

Added in v1.0.0

# Do Notation

## Do

**Signature**

```ts
export declare const Do: Computation<never, {}>
```

Added in v1.0.0

## apS

**Signature**

```ts
export declare const apS: <N, A, E, B>(
  name: Exclude<N, keyof A>,
  fb: Computation<E, B>
) => (fa: Computation<E, A>) => Computation<E, { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
```

Added in v1.0.0

## bind

**Signature**

```ts
export declare const bind: <N, A, E, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => Computation<E, B>
) => (ma: Computation<E, A>) => Computation<E, { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
```

Added in v1.0.0

## bindTo

**Signature**

```ts
export declare const bindTo: <N>(name: N) => <E, A>(fa: Computation<E, A>) => Computation<E, { readonly [K in N]: A }>
```

Added in v1.0.0

## bindW

**Signature**

```ts
export declare const bindW: <N extends string, A, E2, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => Computation<E2, B>
) => <E1>(fa: Computation<E1, A>) => Computation<E2 | E1, { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
```

Added in v1.0.0

# Instance Operations

## Apply

**Signature**

```ts
export declare const Apply: Ap.Apply2<'Computation'>
```

Added in v1.0.0

## ap

**Signature**

```ts
export declare const ap: <E, A, B>(fab: Computation<E, (a: A) => B>) => (fa: Computation<E, A>) => Computation<E, B>
```

Added in v1.0.0

## bimap

**Signature**

```ts
export declare const bimap: <E, G, A, B>(f: (e: E) => G, g: (a: A) => B) => (fa: Computation<E, A>) => Computation<G, B>
```

Added in v1.0.0

## chain

**Signature**

```ts
export declare const chain: <E, A, B>(f: (a: A) => Computation<E, B>) => (fa: Computation<E, A>) => Computation<E, B>
```

Added in v1.0.0

## fromEither

**Signature**

```ts
export declare const fromEither: NaturalTransformation22<'Either', 'Computation'>
```

Added in v1.0.0

## map

**Signature**

```ts
export declare const map: <A, B>(f: (a: A) => B) => <E>(fa: Computation<E, A>) => Computation<E, B>
```

Added in v1.0.0

## mapLeft

**Signature**

```ts
export declare const mapLeft: <E, G>(f: (e: E) => G) => <A>(fa: Computation<E, A>) => Computation<G, A>
```

Added in v1.0.0

## throwError

**Signature**

```ts
export declare const throwError: <E, A>(e: E) => Computation<E, A>
```

Added in v1.0.0

# Instances

## Applicative

**Signature**

```ts
export declare const Applicative: Apl.Applicative2<'Computation'>
```

Added in v1.0.0

## Bifunctor

**Signature**

```ts
export declare const Bifunctor: BiFun.Bifunctor2<'Computation'>
```

Added in v1.0.0

## Chain

**Signature**

```ts
export declare const Chain: Chn.Chain2<'Computation'>
```

Added in v1.0.0

## FromEither

**Signature**

```ts
export declare const FromEither: FE.FromEither2<'Computation'>
```

Added in v1.0.0

## Functor

**Signature**

```ts
export declare const Functor: Fun.Functor2<'Computation'>
```

Added in v1.0.0

## Monad

**Signature**

```ts
export declare const Monad: Mon.Monad2<'Computation'>
```

Added in v1.0.0

## MonadThrow

**Signature**

```ts
export declare const MonadThrow: MonThrow.MonadThrow2<'Computation'>
```

Added in v1.0.0

## URI

**Signature**

```ts
export declare const URI: 'Computation'
```

Added in v1.0.0

## URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v1.0.0

# Model

## Computation (type alias)

**Signature**

```ts
export type Computation<E, A> = readonly [E.Either<E, A>, ReadonlyArray<E>]
```

Added in v1.0.0

# Natural Transformations

## fromOption

**Signature**

```ts
export declare const fromOption: <E>(onNone: Lazy<E>) => NaturalTransformation12C<'Option', 'Computation', E>
```

Added in v1.0.0

# Refinements

## isLeft

**Signature**

```ts
export declare const isLeft: <E, A>(e: Computation<E, A>) => e is readonly [E.Left<E>, readonly E[]]
```

Added in v1.0.0

## isRight

**Signature**

```ts
export declare const isRight: <E, A>(e: Computation<E, A>) => e is readonly [E.Right<A>, readonly E[]]
```

Added in v1.0.0

# Utilities

## filter

**Signature**

```ts
export declare const filter: <E, A>(
  predicate: (a: A) => boolean,
  onFalse: (a: A) => E
) => (fa: Computation<E, A>) => Computation<E, A>
```

Added in v1.0.0

## filterOptionK

**Signature**

```ts
export declare const filterOptionK: <E, A, B>(
  test: (a: A) => O.Option<B>,
  onFalse: (a: A) => E
) => (a: A) => Computation<E, B>
```

Added in v1.0.0

## log

**Signature**

```ts
export declare const log: <E>(message: E) => <A>(fa: Computation<E, A>) => Computation<E, A>
```

Added in v1.0.0

## logOption

**Signature**

```ts
export declare const logOption: <E, A>(
  getOptionalMesasge: (a: A) => O.Option<E>
) => (fa: Computation<E, A>) => Computation<E, A>
```

Added in v1.0.0

## tell

**Signature**

```ts
export declare const tell: <E>(message: E) => Computation<E, void>
```

Added in v1.0.0
