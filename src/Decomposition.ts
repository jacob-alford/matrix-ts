import * as O from 'fp-ts/Option'
import * as B from 'fp-ts/boolean'
import * as ChnR from 'fp-ts/ChainRec'
import * as E from 'fp-ts/Either'
import * as Pred from 'fp-ts/Predicate'
import * as RTup from 'fp-ts/ReadonlyTuple'
import { flow, identity as id, tuple, pipe, unsafeCoerce } from 'fp-ts/function'

import * as M from './Matrix'
import * as MatTypes from './MatrixTypes'
import * as M_ from './MatrixU'
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
  solve: (b: V.Vec<M, R>) => V.Vec<M, R>
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
      M.Mat<M, M, number>
    ]
  >
> => {
  type ComputationParams = {
    LU: M.Mat<M, M, number>
    P: M.Mat<M, M, number>
    i: number
  }

  type Computation = C.Computation<string, ComputationParams>

  const [, columns] = M_.shape(M_.fromMat(m))

  const go = (computation: Computation): E.Either<Computation, Computation> => {
    const [result] = computation

    /*
     * Base case: computation has failed in prior iterations
     * -----------------------------------------------------
     */
    if (E.isLeft(result)) {
      return E.right(pipe(computation, C.log('[0] Failed to decompose matrix')))
    }

    /*
     * Base case: Matrix reduction is complete
     * ---------------------------------------
     */
    if (result.right.i >= columns) {
      return E.right(pipe(computation, C.log('[1] Successfully decomposed matrix')))
    }

    return pipe(
      computation,
      /*
       * Filter singular matricies
       * -------------------------
       */
      C.chainFirst(
        flow(
          C.filterOptionK(
            ({ i, LU }) => checkSingular(i, LU),
            () => '[00] Unreachable: index not found'
          ),
          C.filter(Pred.not(id), () => '[10] Matrix is singular')
        )
      ),
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
          O.isSome(maxI) ? partialSwap(i, maxI.value, LU) : O.some(LU),
          C.fromOption(() => '[01] Unreachable: index not found')
        )
      ),
      /*
       * Pivot P
       * -------
       */
      C.bind('P', ({ acc: { i, P }, maxI }) =>
        pipe(
          O.isSome(maxI) ? pipe(P, M.switchRows(i, maxI.value)) : O.some(P),
          C.fromOption(() => '[02] Unreachable: index not found')
        )
      ),
      /*
       * Calculate multipliers, find next iteration of LU
       * ------------------------------------------------
       */
      C.bind('LU', ({ acc: { i }, pivoted }) =>
        pipe(
          subAndScale(i, pivoted),
          C.fromOption(() => '[11] Matrix is singular')
        )
      ),
      C.logOption(({ maxI, acc: { i } }) =>
        pipe(
          maxI,
          O.map(maxI => `Swapped ${i} and ${maxI}`)
        )
      ),
      C.map(
        ({ LU, acc: { i }, P }): ComputationParams => ({
          LU,
          i: i + 1,
          P,
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
    ChnR.tailRec(C.of({ LU: m, i: 0, P: Id }), go),
    C.map(({ LU, P }) => {
      const [L, U] = MatTypes.fromMatrix(N.Field)(LU)
      const { mapL } = M.getLinearMap(N.Field)(P)
      return {
        input: m,
        result: tuple(L, U, P),
        solve: b => backSub(U, forwardSub(L, mapL(b))),
      }
    })
  )
}

// #################
// ### Utilities ###
// #################

/**
 * @since 1.0.0
 * @category Utilities
 */
export const forwardSub: <M>(
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
 * @since 1.0.0
 * @category Utilities
 */
export const backSub = <M extends number>(
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

// ################
// ### Internal ###
// ################

/**
 * @since 1.0.0
 * @category Internal
 */
const getMaxI = <M, N>(pivotI: number, m: M.Mat<M, N, number>): O.Option<number> =>
  pipe(
    m,
    M.reduceWithIndex(tuple(-Infinity, O.zero<number>()), ([i, j], [max, maxI], aij) =>
      j !== pivotI || i < pivotI
        ? tuple(max, maxI)
        : Math.abs(aij) > max
        ? tuple(aij, O.some(i))
        : tuple(max, maxI)
    ),
    RTup.snd
  )

/**
 * @since 1.0.0
 * @category Internal
 */
const checkSingular = <M, N>(i: number, m: M.Mat<M, N, number>): O.Option<boolean> =>
  pipe(m, V.get(i), O.map(V.foldMap(B.MonoidAll)(a => a === 0)))

/**
 * Swap pivotI with maxI if after pivot column
 *
 * @since 1.0.0
 * @category Internal
 */
const partialSwap = <M, N>(pivotI: number, maxI: number, m: M.Mat<M, N, number>) =>
  pipe(
    m,
    M.traverseWithIndex(O.Applicative)(([i, j], a) =>
      j < pivotI
        ? O.some(a)
        : i === pivotI
        ? pipe(m, M.get(maxI, j))
        : i === maxI
        ? pipe(m, M.get(pivotI, j))
        : O.some(a)
    )
  )

/**
 * @since 1.0.0
 * @category Internal
 */
const subAndScale = <M, N>(
  i: number,
  m: M.Mat<M, N, number>
): O.Option<M.Mat<M, N, number>> =>
  pipe(
    m,
    /*
     * Get the pivot row as index i in Ai
     * --------------------------------
     */
    V.get(i),
    O.chain(Ai =>
      pipe(
        m,
        /*
         * Get aii (pivot position along the diagonal)
         * -------------------------------------------
         */
        M.get(i, i),
        /*
         * Check if matrix is singular
         * ---------------------------
         */
        O.filter(aii => aii !== 0),
        O.chain(aii =>
          pipe(
            m,
            /*
             * Traverse over the rows of m as index j in Aj
             * --------------------------------------------
             */
            V.traverseWithIndex(O.Applicative)((j, Aj) =>
              j <= i
                ? /*
                   * Only change Aj if it is below the pivot row
                   * --------------------------------------------
                   */
                  O.some(Aj)
                : pipe(
                    /*
                     * Get the ith column of the jth row (aji)
                     * ----------------------------------------
                     */
                    Aj,
                    V.get(i),
                    O.map(aji =>
                      pipe(
                        /*
                         * Iterate over [Jth, Ith] as index k in A[j,i]k
                         * --------------------------------------------------
                         */
                        V.zipVectors(Aj, Ai),
                        V.mapWithIndex((k, [ajk, aik]) =>
                          /*
                           * Store multiplier in the pivot column below aii, and
                           * Scale and subtract the remainder by the multiplier
                           * -----------------------------------------------------------------
                           */
                          k === i ? aji / aii : k > i ? ajk - aik * (aji / aii) : ajk
                        )
                      )
                    )
                  )
            )
          )
        )
      )
    ),
    O.map(M.from2dVectors)
  )
