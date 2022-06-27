import * as E from 'fp-ts/Either'

import { LUP } from '../src/Decomposition'
import * as M from '../src/Matrix'
import * as N from '../src/number'
import * as V from '../src/Vector'

describe('LUP Decomposition', () => {
  const A = M.fromNestedTuples([
    [2, 10, 8, 8, 6],
    [1, 4, -2, 4, -1],
    [0, 2, 3, 2, 1],
    [3, 8, 3, 10, 9],
    [1, 4, 1, 2, 1],
  ])
  it('solves a system of equations', () => {
    const [output] = LUP(A)

    if (E.isLeft(output)) {
      throw new Error('Unexpected result')
    }

    const { solve } = output.right

    const b = V.fromTuple([52, 14, 12, 51, 15])
    const c = V.fromTuple([50, 4, 12, 48, 12])
    const x_b = solve(b)
    const x_c = solve(c)

    const expectedX_b = V.fromTuple([1, 2, 1, 2, 1])
    const expectedX_c = V.fromTuple([2, 1, 2, 1, 2])

    for (const [Axi, bi] of V.zipVectors(x_b, expectedX_b)) {
      expect(Axi).toBeCloseTo(bi)
    }
    for (const [Axi, bi] of V.zipVectors(x_c, expectedX_c)) {
      expect(Axi).toBeCloseTo(bi)
    }
  })
  it('returns a factorized matrix', () => {
    const [output] = LUP(A)

    if (E.isLeft(output)) {
      throw new Error('Unexpected result')
    }

    const {
      result: [L, U, P],
    } = output.right

    const expectedL = M.fromNestedTuples([
      [1, 0, 0, 0, 0],
      [2 / 3, 1, 0, 0, 0],
      [1 / 3, 2 / 7, 1, 0, 0],
      [1 / 3, 2 / 7, 4 / 11, 1, 0],
      [0, 3 / 7, -1 / 11, -4 / 5, 1],
    ])
    const expectedU = M.fromNestedTuples([
      [3, 8, 3, 10, 9],
      [0, 14 / 3, 6, 4 / 3, 0],
      [0, 0, -33 / 7, 2 / 7, -4],
      [0, 0, 0, -20 / 11, -6 / 11],
      [0, 0, 0, 0, 1 / 5],
    ])

    for (const [ra, rb] of V.zipVectors(L, expectedL)) {
      for (const [a, b] of V.zipVectors(ra, rb)) {
        expect(a).toBeCloseTo(b)
      }
    }
    for (const [ra, rb] of V.zipVectors(U, expectedU)) {
      for (const [a, b] of V.zipVectors(ra, rb)) {
        expect(a).toBeCloseTo(b)
      }
    }
    for (const [ra, rb] of V.zipVectors(M.mul(N.Field)(L, U), M.mul(N.Field)(P, A))) {
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

    expect(result.left).toBe('[10] Matrix is singular')
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

    expect(result.left).toBe('[10] Matrix is singular')
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

    expect(result.left).toBe('[10] Matrix is singular')
  })
})
