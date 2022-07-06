/**
 * Decompose matricies into various forms, such as `LUP`. Can be used in various
 * applications like solving a system of equations, or calculating the principle
 * components of a multivariate distribution (SVD)
 *
 * @since 1.0.0
 */
import * as B from 'fp-ts/boolean'
import * as O from 'fp-ts/Option'
import * as ChnR from 'fp-ts/ChainRec'
import * as IO from 'fp-ts/IO'
import * as E from 'fp-ts/Either'
import * as RA from 'fp-ts/ReadonlyArray'
import { tuple, pipe, unsafeCoerce, identity } from 'fp-ts/function'

import * as M from './Matrix'
import * as MatTypes from './MatrixTypes'
import * as N from './number'
import * as V from './Vector'
import * as C from './Computation'

// #############
// ### Model ###
// #############

/**
 * @since 1.0.0
 * @category Model
 */
export interface Decomposition<M, R, A> {
  input: M.Mat<M, M, R>
  result: A
}

/**
 * Represents the result of a computation that can solve:
 *
 * ```math
 * Ax = b
 * ```
 *
 * @since 1.0.4
 * @category Model
 */
export interface Solvable<M, R> {
  solve: (b: V.Vec<M, R>) => V.Vec<M, R>
}

/**
 * Represents the result of a computation that can be used to calculate the determinant
 *
 * @since 1.0.4
 * @category Model
 */
export interface Determinant {
  det: IO.IO<number>
}

/**
 * Represents a solution to an overdetermined system
 *
 * @since 1.1.0
 * @category Model
 */
export interface LeastSquares<N, R> {
  solve: (b: V.Vec<N, R>) => V.Vec<N, R>
}

/**
 * Determines if `A` is singular
 *
 * @since 1.1.0
 * @category Model
 */
export interface IsSingular {
  isSingular: IO.IO<boolean>
}

// ####################
// ### Constructors ###
// ####################

/**
 * Decomposition of a square matrix into a lower triangular matrix L and an upper
 * triangular matrix U, with a permutation matrix P, such that:
 *
 * ```math
 * PA = LU
 * ```
 *
 * @since 1.0.0
 * @category Constructors
 */
export const LUP = <M extends number>(
  m: M.Mat<M, M, number>
): C.Computation<
  string,
  Decomposition<
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
> => {
  type ComputationParams = {
    LU: M.Mat<M, M, number>
    P: M.Mat<M, M, number>
    numPivots: number
    i: number
  }

  type Computation = C.Computation<string, ComputationParams>

  const [, columns] = M.shape(m)

  const go = (computation: Computation): E.Either<Computation, Computation> => {
    const [result] = computation

    /*
     * Base case: computation has failed in prior iterations, or has reached the last row
     * ----------------------------------------------------------------------------------
     */
    if (E.isLeft(result) || result.right.i >= columns) {
      return E.right(computation)
    }

    return pipe(
      computation,
      C.bindTo('acc'),
      /*
       * Find pivot index
       * ----------------
       */
      C.bindW('maxI', ({ acc: { i, LU } }) => C.of(getMaxI(i, LU))),
      /*
       * Pivot A
       * -------
       */
      C.bindW('pivoted', ({ acc: { LU, i }, maxI }) =>
        pipe(
          O.isSome(maxI) ? pipe(LU, M.switchRows(i, maxI.value[1])) : O.some(LU),
          C.fromOption(() => '[01] Unreachable: index not found')
        )
      ),
      /*
       * Pivot P
       * -------
       */
      C.bind('P', ({ acc: { i, P }, maxI }) =>
        pipe(
          O.isSome(maxI) ? pipe(P, M.switchRows(i, maxI.value[1])) : O.some(P),
          C.fromOption(() => '[02] Unreachable: index not found')
        )
      ),
      C.bindW('numPivots', ({ acc: { numPivots }, maxI }) =>
        O.isSome(maxI) ? C.of(numPivots + 1) : C.of(numPivots)
      ),
      C.logOption(({ maxI, acc: { i } }) =>
        pipe(
          maxI,
          O.map(maxI => `Swapped ${i} and ${maxI[1]}, with max value: ${maxI[0]}`)
        )
      ),
      /*
       * Calculate multipliers, find next iteration of LU
       * ------------------------------------------------
       */
      C.bind('LU', ({ acc: { i }, pivoted }) =>
        pipe(
          subAndScale(i, pivoted),
          C.fromOption(() => '[10] Matrix is singular')
        )
      ),
      C.map(
        ({ LU, acc: { i }, P, numPivots }): ComputationParams => ({
          LU,
          i: i + 1,
          P,
          numPivots,
        })
      ),
      E.left
    )
  }

  const Id = pipe(
    m,
    M.mapWithIndex(([i, j]) => (i === j ? 1 : 0))
  )

  return pipe(
    ChnR.tailRec(C.of({ LU: m, i: 0, P: Id, numPivots: 0 }), go),
    C.bilog(
      () => '[1] Failed to decompose matrix',
      () => '[0] Successfully decomposed matrix'
    ),
    C.map(({ LU, P, numPivots }) => {
      const [L, U] = MatTypes.fromMatrix(N.Field)(LU)
      return {
        input: m,
        result: tuple(L, U, unsafeCoerce(P)),
        solve: b => backSub(U, forwardSub(L, N.linMap(P, b))),
        det: () =>
          (numPivots % 2 === 0 ? 1 : -1) *
          pipe(U, MatTypes.extractDiagonal(0), MatTypes.diagonalFoldMap(N.MonoidProduct)),
      }
    })
  )
}

/**
 * @since 1.0.0
 * @category Constructors
 */
export const QR = <N extends number>(
  m: M.Mat<N, N, number>
): C.Computation<
  string,
  Decomposition<
    N,
    number,
    [MatTypes.OrthogonalMatrix<N, number>, MatTypes.UpperTriangularMatrix<N, number>]
  > &
    IsSingular &
    Determinant
> => {
  type ComputationParams = {
    k: number
    A: M.Mat<N, N, number>
    γ: ReadonlyArray<number>
  }

  type Computation = C.Computation<string, ComputationParams>

  const [, n] = M.shape(m)

  /** Here, P is a free constraint that represents N - 1 */
  const go = <P extends number>(
    computation: Computation
  ): E.Either<Computation, Computation> => {
    const [result] = computation
    /*
     * Base case: computation has failed in prior iterations
     * -----------------------------------------------------
     */
    if (E.isLeft(result)) {
      return E.right(computation)
    }

    /*
     * Base case: Matrix reduction is complete
     * ---------------------------------------
     */
    if (result.right.k >= n) {
      return pipe(
        computation,
        C.chain(result =>
          pipe(
            result.A,
            M.get(n - 1, n - 1),
            C.fromOption(() => '[04] Unreachable: index not found'),
            C.map(ann => ({ ...result, γ: [...result.γ, ann] }))
          )
        ),
        E.right
      )
    }

    return pipe(
      computation,
      C.bindTo('acc'),
      C.bind('xi', ({ acc: { A, k } }) =>
        pipe(
          M.getSubColumn(k, k)<P, N, N, number>(A),
          O.chain(orthogonalize),
          C.fromOption(() => '[01] Unreachable: index not found')
        )
      ),
      C.bind('B', ({ acc: { A, k }, xi: [, γ, uk] }) =>
        pipe(
          A,
          M.getSubMatrix<P, P>(k + 1, k + 1),
          O.map(reflect([γ, uk])),
          C.fromOption(() => '[02] Unreachable: index not found')
        )
      ),
      C.bind('nextA', ({ acc: { A, k }, xi: [τ, , uk], B }) =>
        pipe(
          A,
          M.updateSubMatrix(k + 1, k + 1, B),
          O.chain(M.updateSubColumn<P, number>(k, k, uk)),
          O.chain(M.updateAt(k, k, -τ)),
          C.fromOption(() => '[03] Unreachable: index not found')
        )
      ),
      C.map(({ nextA, acc: { k, γ }, xi: [, γi] }) => ({
        A: nextA,
        k: k + 1,
        γ: [...γ, γi],
      })),
      E.left
    )
  }

  return pipe(
    ChnR.tailRec<Computation, Computation>(C.of({ k: 0, A: m, γ: [] }), acc =>
      go<N>(acc)
    ),
    C.bind('QR', ({ A, γ }) => {
      const [L, R] = MatTypes.fromMatrix(N.Field)(A)
      return pipe(
        assembleQ(L, γ),
        C.fromOption(() => '[05] Unreachable: index not found'),
        C.map(Q => tuple(Q, R))
      )
    }),
    C.map(({ QR, γ }) => ({
      input: m,
      result: QR,
      isSingular: () =>
        pipe(
          γ,
          RA.foldMap(B.MonoidAny)(a => a === 0)
        ),
      det: () =>
        pipe(
          QR[1],
          MatTypes.extractDiagonal(0),
          MatTypes.diagonalFoldMap(N.MonoidProduct)
        ),
    })),
    C.bilog(
      () => '[1] Failed to decompose matrix',
      () => '[0] Successfully decomposed matrix'
    )
  )
}

// ###########
// ### LUP ###
// ###########

/**
 * See: Fundamentals of Matrix Computation, David S. Watkins, page 26
 *
 * @since 1.0.0
 * @category Internal
 */
const forwardSub: <M>(
  L: MatTypes.LowerTriangularMatrix<M, number>,
  b: V.Vec<M, number>
) => V.Vec<M, number> = (L, b) => {
  const _: <A>(xs: ReadonlyArray<A>, i: number) => A = (xs, i) => unsafeCoerce(xs[i])
  const n = b.length
  const y: Array<number> = []
  for (let i = 0; i < n; ++i) {
    y[i] = _(b, i)
    for (let j = 0; j < i; ++j) {
      y[i] = _(y, i) - _(_(L, i), j) * _(y, j)
    }
    y[i] = _(y, i) / _(_(L, i), i)
  }
  return unsafeCoerce(y)
}

/**
 * See: Fundamentals of Matrix Computation, David S. Watkins, page 30
 *
 * @since 1.0.0
 * @category Internal
 */
const backSub = <M extends number>(
  U: MatTypes.UpperTriangularMatrix<M, number>,
  y: V.Vec<M, number>
): V.Vec<M, number> => {
  const _: <A>(xs: ReadonlyArray<A>, i: number) => A = (xs, i) => unsafeCoerce(xs[i])
  const n = y.length
  const x: Array<number> = []
  for (let i = n - 1; i > -1; --i) {
    x[i] = _(y, i)
    for (let j = i + 1; j < n; ++j) {
      x[i] = _(x, i) - _(_(U, i), j) * _(x, j)
    }
    x[i] = _(x, i) / _(_(U, i), i)
  }
  return unsafeCoerce(x)
}

/**
 * @since 1.0.0
 * @category Internal
 */
const getMaxI = <M, N>(
  i: number,
  m: M.Mat<M, N, number>
): O.Option<readonly [number, number]> => {
  const _: <A>(xs: ReadonlyArray<A>, i: number) => A = (xs, i) => unsafeCoerce(xs[i])
  const n = m.length
  const go: (
    acc: readonly [number, number, number]
  ) => E.Either<readonly [number, number, number], readonly [number, number]> = ([
    j,
    max,
    maxI,
  ]) => {
    if (j >= n) return E.right(tuple(max, maxI))
    const mc = _(_(m, j), i)
    return Math.abs(mc) > max
      ? E.left([j + 1, Math.abs(mc), j])
      : E.left([j + 1, max, maxI])
  }
  return pipe(
    ChnR.tailRec(tuple(i, 0, -1), go),
    O.fromPredicate(([max]) => max !== 0)
  )
}

/**
 * See: Fundamentals of Matrix Computation, David S. Watkins, page 100
 *
 * @since 1.0.0
 * @category Internal
 */
const subAndScale = <M, N>(
  k: number,
  m: M.Mat<M, N, number>
): O.Option<M.Mat<M, N, number>> => {
  const _: <A>(xs: ReadonlyArray<A>, i: number) => A = (xs, i) => unsafeCoerce(xs[i])
  const n = m.length
  const A = M.toNestedArrays(m)
  if (_(_(A, k), k) === 0) return O.none
  for (let i = k + 1; i < n; ++i) {
    _(A, i)[k] = _(_(A, i), k) / _(_(A, k), k)
  }
  for (let i = k + 1; i < n; ++i) {
    for (let j = k + 1; j < n; ++j) {
      _(A, i)[j] -= _(_(A, i), k) * _(_(A, k), j)
    }
  }
  if (_(_(A, k), k) === 0) return O.none
  return O.some(unsafeCoerce(A))
}

// ##########
// ### QR ###
// ##########

/**
 * See 3.2.35 in Fundamentals of Matrix Computation, David S. Watkins, page 201
 *
 * @since 1.1.0
 * @category Internal
 */
const orthogonalize: <N extends number>(
  x0: V.Vec<N, number>
) => O.Option<[number, number, V.Vec<N, number>]> = xs =>
  pipe(
    RA.head(xs),
    O.map(x0 =>
      pipe(
        N.lInfNorm(xs),
        O.fromPredicate(β => β !== 0),
        O.bindTo('β'),
        O.bind('x', ({ β }) =>
          pipe(
            xs,
            V.map(x => x / β),
            O.some
          )
        ),
        O.bind('τ', ({ x }) =>
          pipe(
            x,
            V.foldMap(N.MonoidSum)(x => Math.pow(x, 2)),
            Math.sqrt,
            τ => (x0 < 0 ? τ : -τ),
            O.some
          )
        ),
        O.bind('γ', ({ τ }) => O.some((τ + x0) / τ)),
        O.bind('u', ({ x, τ }) =>
          pipe(
            x,
            V.mapWithIndex((i, x) => (i === 0 ? 1 : x / (τ + x0))),
            O.some
          )
        ),
        O.fold(
          () =>
            tuple(
              0,
              0,
              pipe(
                xs,
                V.mapWithIndex(i => (i === 0 ? 1 : 0))
              )
            ),
          ({ β, τ, γ, u }) => tuple(τ * β, γ, u)
        )
      )
    )
  )

/**
 * See 3.2.38 in Fundamentals of Matrix Computation, David S. Watkins, page 202
 *
 * @since 1.1.0
 * @category Internal
 */
const reflect: <M extends number, N extends number>(
  gammaU: [number, V.Vec<N, number>]
) => (B: M.Mat<N, M, number>) => M.Mat<N, M, number> =
  ([γ, u]) =>
  B => {
    const [n, m] = M.shape(B)
    const vt = pipe(
      u,
      V.map(x => x * γ),
      vt => N.linMapR(vt, B)
    )
    const { inverse, concat } = N.AdditiveAbGrpMN(n, m)
    return concat(B, inverse(N.outerProduct(u, vt)))
  }

/**
 * @since 1.1.0
 * @category Internal
 */
const assembleQ = <M extends number>(
  L: MatTypes.LowerTriangularMatrix<M, number>,
  γ: ReadonlyArray<number>
): O.Option<MatTypes.OrthogonalMatrix<M, number>> => {
  type Params = {
    i: ReadonlyArray<V.Vec<M, number>>
    o: ReadonlyArray<M.Mat<M, M, number>>
    k: number
  }

  const [m] = M.shape(L)

  const go = <P extends number>(
    params: O.Option<Params>
  ): E.Either<O.Option<Params>, O.Option<ReadonlyArray<M.Mat<M, M, number>>>> => {
    if (O.isNone(params)) {
      return E.right(O.none)
    }

    const { k, i, o } = params.value

    if (k >= m) {
      return E.right(O.some(o))
    }

    return pipe(
      M.getSubColumn(k, k)<P, M, M, number>(L),
      O.bindTo('uk'),
      O.bind('γk', () => pipe(γ, RA.lookup(k))),
      O.chain(({ uk, γk }) => {
        const p = V.size(uk)
        const IdP = N.idMat(p)
        const IdN = N.idMat(m)
        const ukS = pipe(
          uk,
          V.map(a => a * γk)
        )
        const γUkUkt = N.outerProduct(ukS, uk)
        const { concat, inverse } = N.AdditiveAbGrpMN(p, p)
        const repl = concat(IdP, inverse(γUkUkt))
        return pipe(IdN, M.updateSubMatrix<P, P, number>(k + 1, k + 1, repl))
      }),
      O.map(Qk => ({ k: k + 1, i, o: [...o, Qk] })),
      E.left
    )
  }

  return pipe(
    ChnR.tailRec<O.Option<Params>, O.Option<Params['o']>>(
      O.some({ k: 0, i: L, o: [] }),
      acc => go<M>(acc)
    ),
    O.map(RA.foldMap(N.MonoidProductMM(m))(identity)),
    O.map(Q => unsafeCoerce(Q))
  )
}
