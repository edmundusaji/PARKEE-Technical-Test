const endpoint = 'https://api.api-onepiece.com/v2/characters/en'

const toNumber = (value) => Number(String(value ?? '0').replace(/\D/g, '')) || 0

describe('One Piece API validation', () => {
  let response
  let characters

  before(() => { //hooknya sebelum running 4 case
    cy.request({
      method: 'GET',
      url: endpoint,
      failOnStatusCode: false,
    }).then((apiResponse) => {
      response = apiResponse
      characters = apiResponse.body
    })
  })

  it('returns HTTP 200', () => {
    expect(response.status).to.eq(200)
    expect(characters).to.be.an('array')
  })

  it('has a unique ID for every character', () => {
    const ids = characters.map(({ id }) => id)
    const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index)

    expect([...new Set(duplicateIds)], 'duplicate character IDs').to.deep.equal([])
  })

  it('assigns Gum-Gum Fruit only to Monkey D. Luffy', () => {
    const invalidOwners = characters
      .filter(({ fruit }) => fruit?.name === 'Gum-Gum Fruit')
      .filter(({ name }) => name !== 'Monkey D. Luffy')
      .map(({ id, name }) => ({ id, name }))

    expect(invalidOwners, 'invalid Gum-Gum Fruit owners').to.deep.equal([])
  })

  it('matches each crew total_prime to the sum of member bounties', () => {
    const crews = new Map()

    characters.forEach((character) => {
      const crew = character.crew
      if (!crew || crew.id == null) return

      if (!crews.has(crew.id)) {
        crews.set(crew.id, {
          crewId: crew.id,
          crewName: crew.name,
          declaredTotals: new Set(),
          bountySum: 0,
        })
      }

      const group = crews.get(crew.id)
      group.declaredTotals.add(toNumber(crew.total_prime))
      group.bountySum += toNumber(character.bounty)
    })

    const mismatches = [...crews.values()]
      .filter(
        ({ declaredTotals, bountySum }) =>
          declaredTotals.size !== 1 || !declaredTotals.has(bountySum),
      )
      .map(({ crewId, crewName, declaredTotals, bountySum }) => ({
        crewId,
        crewName,
        totalPrime: [...declaredTotals],
        bountySum,
      }))

    expect(mismatches, 'crew bounty mismatches').to.deep.equal([])
  })
})