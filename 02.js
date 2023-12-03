const fs = require('fs')
const input = fs.readFileSync('./02-input.txt').toString().split('\n')
// Sample Input
// Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
// Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
// Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
// Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
// Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green

function formatGames(records) {
  // Converts a record string to an array of objects tracking the game, set, and cube color count.
  // In: [
  // 'Game 1: 1 blue, 1 yellow; 2 blue, 1 yellow; 3 blue 2 yellow',
  // 'Game 2: 2 blue, 1 yellow; 1 blue, 1 yellow; 1 red 3 blue',
  // ]
  // Out: [
  // {
  //   game: 1,
  //   set1: {
  //     blue: 1, 
  //     yellow: 1,
  //   },
  //   set2: {
  //     blue: 1,
  //     yellow: 1
  //   },
  //   set3: {
  //     blue: 3,
  //     yellow: 2
  //   }
  // },
  // {
  //   game: 2,
  //   set1: {
  //     blue: 2, 
  //     yellow: 1,
  //   },
  //   set2: {
  //     blue: 1,
  //     yellow: 1
  //   },
  //   set3: {
  //     red: 1,
  //     blue: 3
  //   }
  // }
  // ]
  return records.reduce((accum, record) => {
    const [gameStr, cubeStr] = record.split(': ')
    const game = { count: Number(gameStr.split(' ')[gameStr.split(' ').length - 1]) }
    const cubeSets = cubeStr.split('; ')
    const gameSets = cubeSets.reduce((accum, cubeSet, index) => {
      const cubes = cubeSet.split(', ')
      const cubesMap = cubes.reduce((accum, cube) => {
        const [count, color] = cube.split(' ')
        return {
          ...accum,
          [color]: count
        }
      }, {})
      return {
        ...accum,
        [`set${index + 1}`]: cubesMap
      }
    }, [])
    return [
      ...accum,
      {
        ...game,
        ...gameSets
      }
    ]
  }, [])
}

function getSetKeys(game) {
  return Object.keys(game).filter(k => k.includes('set'))
}

function getGameSets(game) {
  const setKeys = getSetKeys(game)
  return setKeys.map(k => game[k])
}

function getPossibleGames(records, gameBag) {
  // Returns a list of records that are compatible with items in a gameBag.
  // records: [
  // 'Game 1: 1 blue, 1 yellow; 2 blue, 1 yellow; 3 blue 2 yellow',
  // 'Game 2: 2 blue, 1 yellow; 1 blue, 1 yellow; 1 red 13 blue',
  // ]
  // gameBag: {
  //   red: 12,
  //   green: 13,
  //   blue: 14
  // }
  // OUT: [{
  //   game: 1,
  //   set1: {
  //     blue: 1, 
  //     yellow: 1,
  //   },
  //   set2: {
  //     blue: 1,
  //     yellow: 1
  //   },
  //   set3: {
  //     blue: 3,
  //     yellow: 2
  //   }
  // }]
  const games = formatGames(records)
  const possibleGames = games.reduce((accum, game) => {
    const gameSets = getGameSets(game)
    const possibleSets = gameSets.filter(gameSet => {
      let isPossible = true
      Object.keys(gameSet).forEach(color => {
        if (isPossible) { isPossible = gameSet[color] <= gameBag[color] } // Only check if game is stil possible.
      })
      return isPossible
    })
    return gameSets.length !== possibleSets.length
      ? accum
      : [
        ...accum,
        {
          count: game.count,
          possibleSets,
        }
      ]
  }, [])
  return possibleGames
}

function possibleCubeGameSum(records, gameBag) {
  const possibleGames = getPossibleGames(records, gameBag)
  return possibleGames.reduce((accum, game) => {
    return accum + game.count
  }, 0)
}

function updateMinSet(minSet, newGameSet) {
  if (!Object.keys(minSet).length) return newGameSet
  const colors = new Set([...Object.keys(minSet), ...Object.keys(newGameSet)])
  const newMinSet = {}
  colors.forEach((accum, color) => {
    newMinSet[color] = minSet[color] && newGameSet[color] 
      ? Math.max(minSet[color], newGameSet[color]) 
      : !minSet[color] ? newGameSet[color] : minSet[color]
  })
  return newMinSet
}

function getMinCubes(gameSets) {
  // In: [
  // {
  //   set1: {
  //     blue: 1, 
  //     yellow: 1,
  //   },
  //   set2: {
  //     blue: 1,
  //     yellow: 1
  //   },
  //   set3: {
  //     blue: 3,
  //     yellow: 2
  //   }
  // },
  // {
  //   game: 2,
  //   set1: {
  //     blue: 2, 
  //     yellow: 1,
  //   },
  //   set2: {
  //     blue: 1,
  //     yellow: 1
  //   },
  //   set3: {
  //     red: 1,
  //     blue: 3
  //   }
  // }]
  // Out: [
  //   {
  //     game: 1,
  //     powerSet: 6,
  //     minCubes: {
  //       blue: 3,
  //       yellow: 2
  //     }
  //   },
  //   {
  //     game: 2,
  //     powerSet: 3,
  //     minCubes: {
  //       blue: 3,
  //       yellow: 1,
  //       red: 1
  //     }
  //   }
  // ]
  return gameSets.reduce((accum, gameSet) => {
    return updateMinSet(accum, gameSet)
  }, {})
}

function getPowerMinCubes(minCubes) {
  return Object.keys(minCubes).reduce((accum, color) => {
    return accum * minCubes[color]
  }, 1)
}

function powerMinCubeSet(records) {
  const games = formatGames(records)
  return games.reduce((accum, game) => {
    const gameSets = getGameSets(game)
    const minCubes = getMinCubes(gameSets)
    return accum + getPowerMinCubes(minCubes)
  }, 0)
  // The power of a set of cubes is equal to the numbers of red, green, and blue cubes multiplied together.The power of the minimum set of cubes in game 1 is 48. In games 2 - 5 it was 12, 1560, 630, and 36, respectively.Adding up these five powers produces the sum 2286.

  // For each game, find the minimum set of cubes that must have been present.What is the sum of the power of these sets ?

}



// driver
const gameBag = {
  red: 12,
  green: 13,
  blue: 14
}
const solution_1 = possibleCubeGameSum(input, gameBag)
console.log('solution_1', solution_1)
const solution_2 = powerMinCubeSet(input)
console.log('solution_2', solution_2)

// test 1
records = [
  "Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green",
  "Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue",
  "Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red",
  "Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red",
  "Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green"
]

const test_1 = possibleCubeGameSum(records, gameBag)
const test_2 = powerMinCubeSet(records)

console.log('test_1', test_1)
console.log('test_1', test_1 === 8 ? '✅' : '❌')
console.log('test_2', test_2 === 2286 ? '✅' : '❌')
