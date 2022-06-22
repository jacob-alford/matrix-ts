import * as E from 'fp-ts/Either'

import { backSub, forwardSub, LUP } from '../Decomposition'
import * as M from '../Matrix'
import * as MatTypes from '../MatrixTypes'
import * as FM from '../FreeMonoid'
import * as N from '../number'
import * as V from '../Vector'

const mul = M.mul(N.Field)

describe('LUP Decomposition', () => {
  it('solves a system of equations', () => {
    const A = M.fromNestedTuples([
      [2, 4, 2],
      [4, -10, 2],
      [1, 2, 4],
    ])

    const [output] = LUP(A)

    if (E.isLeft(output)) {
      throw new Error('Unexpected result')
    }

    const { solve } = output.right

    const { mapL } = M.getLinearMap(N.Field)(A)

    const b = V.fromTuple([5, -8, 13])
    const x = solve(b)
    const Ax = mapL(x)

    for (const [Axi, bi] of V.zipVectors(Ax, b)) {
      expect(Axi).toBeCloseTo(bi)
    }
  })
  it('returns a factorized matrix', () => {
    const A = M.fromNestedTuples([
      [2, 4, 1, -3],
      [-1, -2, 2, 4],
      [4, 2, -3, 5],
      [5, -4, -3, 1],
    ])
    const [output, logs] = LUP(A)

    console.log(FM.toReadonlyArray(logs))

    if (E.isLeft(output)) {
      throw new Error('Unexpected result')
    }

    const {
      result: [L, U, P],
    } = output.right

    const expectedU = M.fromNestedTuples([
      [1, 2, 1, 0],
      [0, 1, 2, 1],
      [0, 0, 100, 200],
      [0, 0, 0, -0.05],
    ])

    console.log({ L, U, P })

    for (const [ra, rb] of V.zipVectors(expectedU, U)) {
      for (const [a, b] of V.zipVectors(ra, rb)) {
        expect(a).toBeCloseTo(b)
      }
    }
    for (const [ra, rb] of V.zipVectors(mul(L, U), mul(P, A))) {
      for (const [a, b] of V.zipVectors(ra, rb)) {
        expect(a).toBeCloseTo(b)
      }
    }
  })
  it('detects a singular matrix (i)', () => {
    const [result] = LUP(
      M.fromNestedTuples([
        [1, -2],
        [-3, 6],
      ])
    )
    if (E.isRight(result)) {
      throw new Error('Unexpected result')
    }

    expect(result.left).toBe('[11] Matrix is singular')
  })
  it('detects a singular matrix (ii)', () => {
    const [result] = LUP(
      M.fromNestedTuples([
        [1, 1, 1],
        [0, 1, 0],
        [1, 0, 1],
      ])
    )

    if (E.isRight(result)) {
      throw new Error('Unexpected result')
    }

    expect(result.left).toBe('[11] Matrix is singular')
  })
  it('detects a singular matrix (iii)', () => {
    const [result] = LUP(
      M.fromNestedTuples([
        [1, 2],
        [-2, -4],
      ])
    )

    if (E.isRight(result)) {
      throw new Error('Unexpected result')
    }

    expect(result.left).toBe('[11] Matrix is singular')
  })
  it('forward substitutes', () => {
    const [L] = MatTypes.fromMatrix(N.Field)(
      M.fromNestedTuples([
        [1, 0, 0, 0],
        [-1, 1, 0, 0],
        [0, 1 / 2, 1, 0],
        [6, 1, 14, 1],
      ])
    )
    const y = V.fromTuple([1, -1, 2, 1])
    const result = forwardSub(L, y)
    const expected = V.fromTuple([1, 0, 2, -33])
    for (const [a, b] of V.zipVectors(result, expected)) {
      expect(a).toBeCloseTo(b)
    }
  })
  it('backward substitutes', () => {
    const [, U] = MatTypes.fromMatrix(N.Field)(
      M.fromNestedTuples([
        [1, 2, 1, -1],
        [0, -4, 1, 7],
        [0, 0, -2, 1],
        [0, 0, 0, -1],
      ])
    )
    const y = V.fromTuple([5, 1, 1, 3])
    const result = backSub(U, y)
    const expected = V.fromTuple([16, -6, -2, -3])
    for (const [a, b] of V.zipVectors(result, expected)) {
      expect(a).toBeCloseTo(b)
    }
  })
})
