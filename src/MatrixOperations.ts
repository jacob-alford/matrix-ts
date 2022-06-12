import * as O from 'fp-ts/Option'
import * as B from 'fp-ts/boolean'
import * as Bnd from 'fp-ts/Bounded'
import * as ChnR from 'fp-ts/ChainRec'
import * as E from 'fp-ts/Either'
import * as Eq from 'fp-ts/Eq'
import * as IO from 'fp-ts/IO'
import * as RA from 'fp-ts/ReadonlyArray'
import * as Ord from 'fp-ts/Ord'
import * as Rng from 'fp-ts/Ring'
import * as Fld from 'fp-ts/Field'
import { Show } from 'fp-ts/Show'
import { flow, identity, tuple, pipe } from 'fp-ts/function'

import * as M from './MatrixC'
import * as M_ from './Matrix'
import * as V from './VectorC'
import { Abs } from './Abs'
import * as LFM from './LoggerFreeMonoid'
import * as C from './Computation'

const UpperTriangularSymbol = Symbol('UpperTriangular')
type UpperTriangularSymbol = typeof UpperTriangularSymbol

const LowerTriangularSymbol = Symbol('LowerTriangular')
type LowerTriangularSymbol = typeof LowerTriangularSymbol

const InvertibleMatrixSymbol = Symbol('LowerTriangular')
type InvertibleMatrixSymbol = typeof InvertibleMatrixSymbol

// #############
// ### Model ###
// #############

/**
 * Upper Triangular Matricies
 *
 * @since 1.0.0
 * @category Model
 */
export interface UpperTriangularMatrix<M, A> extends M.MatC<M, M, A> {
  _URI: UpperTriangularSymbol
}

/**
 * @since 1.0.0
 * @category Internal
 */
const wrapUpperTriangular: <M, A>(m: M.MatC<M, M, A>) => UpperTriangularMatrix<M, A> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  identity as any

/**
 * Lower Triangular Matricies
 *
 * @since 1.0.0
 * @category Model
 */
export interface LowerTriangularMatrix<M, A> extends M.MatC<M, M, A> {
  _URI: LowerTriangularSymbol
}

/**
 * @since 1.0.0
 * @category Internal
 */
const wrapLowerTriangular: <M, A>(m: M.MatC<M, M, A>) => LowerTriangularMatrix<M, A> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  identity as any

/**
 * Lower Triangular Matricies
 *
 * @since 1.0.0
 * @category Model
 */
export interface InvertibleMatrix<M, A> extends M.MatC<M, M, A> {
  _URI: InvertibleMatrixSymbol
}

/**
 * @since 1.0.0
 * @category Internal
 */
const wrapInvertible: <M, A>(m: M.MatC<M, M, A>) => InvertibleMatrix<M, A> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  identity as any

/**
 * @since 1.0.0
 * @category Model
 */
type RowInterchange = { tag: 'RowInterchange'; i: number; j: number }

/**
 * @since 1.0.0
 * @category Model
 */
type ScaleRow<A> = { tag: 'ScaleRow'; i: number; a: A }

/**
 * @since 1.0.0
 * @category Model
 */
type ScaleAndSubtractRows<A> = { tag: 'ScaleAndSubtractRows'; i: number; j: number; a: A }

/**
 * @since 1.0.0
 * @category Model
 */
export type GaussianEliminationStep<A> =
  | RowInterchange
  | ScaleRow<A>
  | ScaleAndSubtractRows<A>

// ####################
// ### Constructors ###
// ####################

/**
 * @since 1.0.0
 * @category Constructors
 */
export const ScaleRow = <A>(i: number, a: A): ScaleRow<A> => ({ tag: 'ScaleRow', i, a })

/**
 * @since 1.0.0
 * @category Constructors
 */
export const RowInterchange = (i: number, j: number): RowInterchange => ({
  tag: 'RowInterchange',
  i,
  j,
})

/**
 * @since 1.0.0
 * @category Constructors
 */
export const ScaleAndSubtractRows = <A>(
  i: number,
  j: number,
  a: A
): ScaleAndSubtractRows<A> => ({
  tag: 'ScaleAndSubtractRows',
  i,
  j,
  a,
})

/**
 * @since 1.0.0
 * @category Constructors
 */
export const upperFromSquareMatrix: <A>(
  eqR: Eq.Eq<A>,
  R: Rng.Ring<A>
) => <M>(mc: M.MatC<M, M, A>) => O.Option<UpperTriangularMatrix<M, A>> = (eqR, R) =>
  flow(
    O.fromPredicate(
      M.reduceWithIndex(true as boolean, ([i, j], b, a) =>
        i < j ? b && eqR.equals(a, R.zero) : b
      )
    ),
    O.map(wrapUpperTriangular)
  )

/**
 * @since 1.0.0
 * @category Constructors
 */
export const lowerFromSquareMatrix: <A>(
  eqR: Eq.Eq<A>,
  R: Rng.Ring<A>
) => <M>(mc: M.MatC<M, M, A>) => O.Option<LowerTriangularMatrix<M, A>> = (eqR, R) =>
  flow(
    O.fromPredicate(
      M.reduceWithIndex(true as boolean, ([i, j], b, a) =>
        i > j ? b && eqR.equals(a, R.zero) : b
      )
    ),
    O.map(wrapLowerTriangular)
  )

// #################
// ### Instances ###
// #################

/**
 * @since 1.0.0
 * @category Instances
 */
export const getShowEliminationStep: <A>(
  showA: Show<A>
) => Show<GaussianEliminationStep<A>> = showA => ({
  show: a => {
    switch (a.tag) {
      case 'RowInterchange':
        return `RowInterchange(${a.i}, ${a.j})`
      case 'ScaleRow':
        return `ScaleRow(${a.i}, ${showA.show(a.a)})`
      case 'ScaleAndSubtractRows':
        return `ScaleAndSubtractRows(${a.i}, ${a.j}, ${showA.show(a.a)})`
    }
  },
})

// #########################
// ### Matrix Operations ###
// #########################

/**
 * @since 1.0.0
 * @category Internal
 */
const getMaxRowIndex =
  <A>(Bnd: Bnd.Bounded<A>, { abs }: Abs<A>) =>
  <M, N>(pivotIndex: number, m: M.MatC<M, N, A>): [A, O.Option<number>] =>
    pipe(
      m,
      M.reduceWithIndex(
        tuple(Bnd.bottom, O.zero()),
        ([currentRow, currentColumn], [currentMax, maxIndex], next) =>
          currentColumn !== pivotIndex || currentRow <= pivotIndex
            ? tuple(currentMax, maxIndex)
            : Ord.gt(Bnd)(abs(next), currentMax)
            ? tuple(next, O.some(currentRow))
            : tuple(currentMax, maxIndex)
      )
    )

/**
 * @since 1.0.0
 * @category Internal
 */
const matrixRowIsZeroAtIndex =
  <A>(eqA: Eq.Eq<A>, R: Rng.Ring<A>) =>
  <M extends number, N extends number>(
    cIndex: number,
    m: M.MatC<M, N, A>
  ): O.Option<boolean> =>
    pipe(m, V.get(cIndex), O.map(V.foldMap(B.MonoidAll)(a => eqA.equals(a, R.zero))))

/**
 * @since 1.0.0
 * @category Internal
 */
const subtractAndScaleBelowPivotRow =
  <A>(eqA: Eq.Eq<A>, F: Fld.Field<A>) =>
  <M, N>(
    pivot: number,
    m: M.MatC<M, N, A>
  ): O.Option<[ReadonlyArray<GaussianEliminationStep<A>>, M.MatC<M, N, A>]> =>
    pipe(
      m,
      V.get(pivot),
      O.chain(pivotRow => {
        const scaleAndSubtractRow =
          (aii: A) =>
          (aji: A) =>
          (
            rowIndex: number,
            row: V.VecC<N, A>
          ): [V.VecC<N, A>, ReadonlyArray<GaussianEliminationStep<A>>] => {
            const multiplier = F.div(aji, aii)
            return eqA.equals(multiplier, F.zero)
              ? tuple(row, [])
              : pipe(
                  V.zipVectors(row, pivotRow),
                  V.map(([ajk, aik]) => F.sub(ajk, F.mul(aik, multiplier))),
                  resultingVector =>
                    tuple(resultingVector, [
                      ScaleAndSubtractRows(pivot, rowIndex, multiplier),
                    ])
                )
          }
        return pipe(
          m,
          M.get(pivot, pivot),
          O.chain(aii =>
            pipe(
              m,
              V.traverseWithIndex(O.Applicative)((j, row) =>
                j > pivot
                  ? pipe(
                      row,
                      V.get(pivot),
                      O.map(aji => scaleAndSubtractRow(aii)(aji)(j, row))
                    )
                  : O.some(tuple(row, []))
              ),
              O.map(vs =>
                pipe(
                  vs,
                  V.foldMap(RA.getMonoid<GaussianEliminationStep<A>>())(
                    ([, steps]) => steps
                  ),
                  steps =>
                    tuple(
                      steps,
                      pipe(
                        vs,
                        V.map(([v]) => v),
                        M.from2dVectors
                      )
                    )
                )
              )
            )
          )
        )
      })
    )

/**
 * @since 1.0.0
 * @category Constructors
 */
export const guassianEliminationWithPartialPivoting =
  <LO>(Log: LFM.Logger<string, LO>) =>
  <A>(BndA: Bnd.Bounded<A>, F: Fld.Field<A>, A: Abs<A>) =>
  <M extends number>(
    m: M.MatC<M, M, A>
  ): C.Computation<
    IO.IO<LO>,
    [
      ReadonlyArray<GaussianEliminationStep<A>>,
      UpperTriangularMatrix<M, A>,
      InvertibleMatrix<M, A>
    ]
  > => {
    type ComputationParams = {
      acc: M.MatC<M, M, A>
      pivotIndex: number
      steps: ReadonlyArray<GaussianEliminationStep<A>>
    }

    type Computation = C.Computation<IO.IO<LO>, ComputationParams>

    const [, columns] = M_.shape(M_.fromMatC(m))

    const go = (computation: Computation): E.Either<Computation, Computation> => {
      const [result] = computation

      /** Base case: computation has failed in prior iterations */
      if (E.isLeft(result)) return E.right(computation)

      /** Base case: Matrix reduction is complete */
      if (result.right.pivotIndex >= columns) return E.right(computation)

      return pipe(
        computation,
        C.chainFirst(
          flow(
            C.filterOptionK(
              ({ pivotIndex, acc }) => matrixRowIsZeroAtIndex(BndA, F)(pivotIndex, acc),
              () =>
                Log.failure(
                  'Unreachable case: cannot find pivot index during singularity check'
                )
            ),
            C.filter(identity, () => Log.failure('Matrix is singular'))
          )
        ),
        C.bindTo('computation'),
        C.bindW('maxRowIndex', ({ computation: { pivotIndex, acc } }) =>
          pipe(getMaxRowIndex(BndA, A)(pivotIndex, acc)[1], C.of)
        ),
        C.bind('mPivoted', ({ computation: { acc, pivotIndex }, maxRowIndex }) =>
          pipe(
            O.isSome(maxRowIndex)
              ? pipe(acc, M.switchRows(pivotIndex, maxRowIndex.value))
              : O.some(acc),
            C.fromOption(() => Log.failure('Unreachable case: unable to switch rows'))
          )
        ),
        C.bind('mPivotedScaled', ({ computation: { pivotIndex }, mPivoted }) =>
          pipe(
            subtractAndScaleBelowPivotRow(BndA, F)(pivotIndex, mPivoted),
            C.fromOption(() => Log.failure('Unreachable case: unable to pivot and scale'))
          )
        ),
        C.logOption(({ maxRowIndex, computation: { pivotIndex } }) =>
          pipe(
            maxRowIndex,
            O.map(maxRowIndex => Log.info(`Swapped ${pivotIndex} and ${maxRowIndex}`))
          )
        ),
        C.map(
          ({
            mPivotedScaled: [scaleSteps, pivotedScaled],
            computation: { pivotIndex, steps },
            maxRowIndex,
          }): ComputationParams => ({
            acc: pivotedScaled,
            pivotIndex: pivotIndex + 1,
            steps: [
              ...steps,
              ...scaleSteps,
              ...(O.isSome(maxRowIndex)
                ? [RowInterchange(maxRowIndex.value, pivotIndex)]
                : []),
            ],
          })
        ),
        E.left
      )
    }

    return pipe(
      ChnR.tailRec(C.of({ acc: m, steps: [], pivotIndex: 0 }), go),
      C.map(({ steps, acc }) => tuple(steps, wrapUpperTriangular(acc), wrapInvertible(m)))
    )
  }
