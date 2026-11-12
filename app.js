/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle(src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/

const words = [
  'planet', 'garden', 'orange', 'window', 'silver',
  'button', 'summer', 'pencil', 'rabbit', 'rocket'
]

const { useState, useEffect } = React

function createGame() {
  const shuffledWords = shuffle(words)
  const firstWord = shuffledWords[0]

  return {
    wordsLeft: shuffledWords.slice(1),
    word: firstWord,
    scrambledWord: shuffle(firstWord),
    points: 0,
    strikes: 0,
    passes: 2,
    message: 'Unscramble the word and press Enter.',
    gameOver: false
  }
}

function loadGame() {
  const savedGame = localStorage.getItem('scrambleGame')

  if (savedGame) {
    return JSON.parse(savedGame)
  }

  return createGame()
}

function App() {
  const [game, setGame] = useState(loadGame)
  const [guess, setGuess] = useState('')

  useEffect(() => {
    localStorage.setItem('scrambleGame', JSON.stringify(game))
  }, [game])

  function nextWord(wordsLeft, points, strikes, passes, message) {
    if (wordsLeft.length === 0 || strikes === 3) {
      setGame({
        ...game,
        wordsLeft: wordsLeft,
        word: '',
        scrambledWord: '',
        points: points,
        strikes: strikes,
        passes: passes,
        message: message,
        gameOver: true
      })
      return
    }

    const newWords = shuffle(wordsLeft)
    const newWord = newWords[0]

    setGame({
      ...game,
      wordsLeft: newWords.slice(1),
      word: newWord,
      scrambledWord: shuffle(newWord),
      points: points,
      strikes: strikes,
      passes: passes,
      message: message,
      gameOver: false
    })
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (guess.trim() === '') {
      return
    }

    if (guess.trim().toLowerCase() === game.word) {
      nextWord(
        game.wordsLeft,
        game.points + 1,
        game.strikes,
        game.passes,
        'Correct! You earned a point.'
      )
    } else {
      const newStrikes = game.strikes + 1

      if (newStrikes === 3) {
        setGame({
          ...game,
          strikes: newStrikes,
          message: 'Incorrect. That was your last strike. Game over!',
          gameOver: true
        })
      } else {
        setGame({
          ...game,
          strikes: newStrikes,
          message: 'Incorrect. Try the same word again.'
        })
      }
    }

    setGuess('')
  }

  function handlePass() {
    if (game.passes === 0) {
      return
    }

    nextWord(
      game.wordsLeft,
      game.points,
      game.strikes,
      game.passes - 1,
      'Word passed. Here is the next one.'
    )
  }

  function restartGame() {
    setGame(createGame())
    setGuess('')
  }

  return (
    <main className="game-card">
      <p className="eyebrow">WORD GAME</p>
      <h1>Scramble</h1>
      <p className="intro">Put the letters in the right order.</p>

      <section className="scoreboard">
        <p>Points<strong>{game.points}</strong></p>
        <p>Strikes<strong>{game.strikes} / 3</strong></p>
        <p>Passes<strong>{game.passes}</strong></p>
      </section>

      {game.gameOver ? (
        <section className="play-area">
          <p className="scrambled">Game over!</p>
          <p className="message">{game.message}</p>
          <button className="primary-button" onClick={restartGame}>
            Play again
          </button>
        </section>
      ) : (
        <section className="play-area">
          <p className="scrambled">{game.scrambledWord}</p>
          <p className="message" aria-live="polite">{game.message}</p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="guess">Your guess</label>
            <input
              id="guess"
              type="text"
              value={guess}
              onChange={(event) => setGuess(event.target.value)}
              autoComplete="off"
            />
            <button className="primary-button" type="submit">
              Submit guess
            </button>
          </form>

          <button
            className="pass-button"
            onClick={handlePass}
            disabled={game.passes === 0}
          >
            Pass this word
          </button>
        </section>
      )}

      <p className="progress">
        {words.length - game.wordsLeft.length} of {words.length} words used
      </p>
    </main>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)