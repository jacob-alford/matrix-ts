import * as O from 'fp-ts/Option'
import * as B from 'fp-ts/boolean'
import * as Eq from 'fp-ts/Eq'
import * as RA from 'fp-ts/ReadonlyArray'
import * as Ord from 'fp-ts/Ord'
import * as Rng from 'fp-ts/Ring'
import * as RTup from 'fp-ts/ReadonlyTuple'
import * as Fld from 'fp-ts/Field'
import { IO } from 'fp-ts/IO'
import { flow, identity, tuple, pipe } from 'fp-ts/function'

import * as M from './MatrixC'
import * as M_ from './Matrix'
import * as V from './VectorC'
import { Abs } from './Abs'
import * as LFM from './LoggerFreeMonoid'

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
type ScaleAndSubtractRows<A> = { tag: 'ScaleAndAddRows'; i: number; j: number; a: A }

/**
 * @since 1.0.0
 * @category Model
 */
export type GaussianEliminationStep<A> =
  | RowInterchange
  | ScaleRow<A>
  | ScaleAndSubtractRows<A>

/**
 * @since 1.0.0
 * @category Model
 */
type MatrixIsSingular = { tag: 'MatrixIsSingular' }

/**
 * @since 1.0.0
 * @category Model
 */
type ColumnValuesAreEquivalentAndNonZero<A> = {
  tag: 'ColumnValuesAreEquivalentAndNonZero'
  value: A
}

/**
 * @since 1.0.0
 * @category Model
 */
type IndexIsOutOfBounds = { tag: 'IndexIsOutOfBounds' }

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
  tag: 'ScaleAndAddRows',
  i,
  j,
  a,
})

/**
 * @since 1.0.0
 * @category Constructors
 */
const IndexIsOutOfBounds = (): IndexIsOutOfBounds => ({ tag: 'IndexIsOutOfBounds' })

/**
 * @since 1.0.0
 * @category Constructors
 */
const MatrixIsSingular = (): MatrixIsSingular => ({ tag: 'MatrixIsSingular' })

/**
 * @since 1.0.0
 * @category Constructors
 */
const ColumnValuesAreEquivalentAndNonZero = <A>(
  value: A
): ColumnValuesAreEquivalentAndNonZero<A> => ({
  tag: 'ColumnValuesAreEquivalentAndNonZero',
  value,
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

// #########################
// ### Matrix Operations ###
// #########################

/**
 * @since 1.0.0
 * @category Internal
 */
const getMaxRowIndex =
  <A>(ordA: Ord.Ord<A>, { abs }: Abs<A>) =>
  <M, N>(cIndex: number, m: M.MatC<M, N, A>): O.Option<[number, A]> => {
    const [, columns] = M_.shape(M_.fromMatC(m))
    return pipe(
      m,
      O.fromPredicate(() => cIndex < columns),
      O.chain(
        V.reduceWithIndex(O.zero<[number, A]>(), (i, acc, a) =>
          pipe(
            a,
            V.get(cIndex),
            O.map(ai =>
              pipe(
                acc,
                O.fold(
                  () => tuple(i, abs(ai)),
                  ([maxIndex, bi]) =>
                    Ord.gt(ordA)(abs(ai), bi) ? tuple(i, abs(ai)) : tuple(maxIndex, bi)
                )
              )
            )
          )
        )
      )
    )
  }

/**
 * @since 1.0.0
 * @category Internal
 */
const matrixColumnIsZeroAtIndex =
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
  <A>(F: Fld.Field<A>) =>
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
            return pipe(
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
  <LO = string>(Log: LFM.Logger<string, LO>) =>
  <A>(ordA: Ord.Ord<A>, F: Fld.Field<A>, A: Abs<A>) =>
  <M extends number>(
    m: M.MatC<M, M, A>
  ): readonly [
    O.Option<
      [
        ReadonlyArray<GaussianEliminationStep<A>>,
        UpperTriangularMatrix<M, A>,
        InvertibleMatrix<M, A>
      ]
    >,
    LFM.FreeMonoid<IO<LO>>
  ] => {
    const [, columns] = M_.shape(M_.fromMatC(m))
    const go = (
      steps: ReadonlyArray<GaussianEliminationStep<A>>,
      pivotIndex: number,
      acc: M.MatC<M, M, A>,
      logs: LFM.FreeMonoid<IO<LO>>
    ): [
      O.Option<[ReadonlyArray<GaussianEliminationStep<A>>, UpperTriangularMatrix<M, A>]>,
      LFM.FreeMonoid<IO<LO>>
    ] => {
      /** Acc is now reduced */
      if (pivotIndex >= columns)
        return [
          O.some(tuple(steps, wrapUpperTriangular(acc))),
          LFM.concat(logs, Log.success('Successfully reduced matrix')),
        ]

      const matrixIsSingular = matrixColumnIsZeroAtIndex(ordA, F)(pivotIndex, acc)

      /** This case should be unreachable */
      if (O.isNone(matrixIsSingular))
        return [
          O.none,
          LFM.concat(
            logs,
            Log.failure(
              'Unreachable case: cannot find pivot index during singularity check'
            )
          ),
        ]

      /** Matrix is singular */
      if (matrixIsSingular.value)
        return [O.none, LFM.concat(logs, Log.failure('Matrix is singular'))]

      const maxIndex = getMaxRowIndex(ordA, A)(pivotIndex, acc)

      /** This case should be unreachable */
      if (O.isNone(maxIndex))
        return [
          O.none,
          LFM.concat(logs, Log.failure('Unreachable case: cannot find max row index')),
        ]

      const [maxRowIndex] = maxIndex.value

      const willPivot = maxRowIndex !== pivotIndex

      const mPivoted = pipe(acc, M.switchRows(pivotIndex, maxRowIndex))

      /** This case should be unreachable */
      if (O.isNone(mPivoted))
        return [
          O.none,
          LFM.concat(logs, Log.failure('Unreachable case: unable to switch rows')),
        ]

      const mPivotedScaled = subtractAndScaleBelowPivotRow(F)(pivotIndex, mPivoted.value)

      /** This case should be unreachable */
      if (O.isNone(mPivotedScaled))
        return [
          O.none,
          LFM.concat(logs, Log.failure('Unreachable case: unable to pivot and scale')),
        ]

      const [stepsScaledAndAdded, newMatrix] = mPivotedScaled.value

      const newSteps = [
        ...steps,
        ...(willPivot ? [RowInterchange(maxRowIndex, pivotIndex)] : []),
        ...stepsScaledAndAdded,
      ]

      return go(
        newSteps,
        pivotIndex + 1,
        newMatrix,
        LFM.concat(
          logs,
          willPivot ? Log.info(`Swapped ${pivotIndex} and ${maxRowIndex}`) : LFM.nil
        )
      )
    }
    return pipe(
      go([], 0, m, LFM.nil),
      RTup.mapFst(O.map(([steps, reduced]) => tuple(steps, reduced, wrapInvertible(m))))
    )
  }
