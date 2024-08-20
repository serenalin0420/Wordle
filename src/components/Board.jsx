import { useReducer, useEffect, useCallback } from "react";

const initialState = {
  answer: "DELAY",
  guesses: Array(6).fill(["", "", "", "", ""]),
  currentGuess: 0,
};

function guessReducer(state, action) {
  switch (action.type) {
    case "INPUT_LETTER": {
      console.log(state);
      const { currentGuess } = state;
      const emptyIndex = state.guesses[currentGuess].findIndex(
        (letter) => letter === "",
      );
      if (emptyIndex !== -1) {
        const updatedGuesses = [...state.guesses];
        const updatedGuess = [...updatedGuesses[currentGuess]];
        updatedGuess[emptyIndex] = action.letter;
        updatedGuesses[currentGuess] = updatedGuess;
        return {
          ...state,
          guesses: updatedGuesses,
        };
      }
      return state;
    }
    case "REMOVE_LETTER": {
      const { currentGuess } = state;
      const updatedGuesses = [...state.guesses];
      const updatedGuess = [...updatedGuesses[currentGuess]];
      for (let i = updatedGuess.length - 1; i >= 0; i--) {
        if (updatedGuess[i] !== "") {
          updatedGuess[i] = "";
          break;
        }
      }
      updatedGuesses[currentGuess] = updatedGuess;
      return {
        ...state,
        guesses: updatedGuesses,
      };
    }
    case "SUBMIT": {
      const { currentGuess, guesses, answer } = state;

      if (guesses[currentGuess].every((letter) => letter !== "")) {
        const ansArray = answer.split("");
        const currentRow = guesses[currentGuess];
        const result = [];

        // First pass for greens (correct letter in correct position)
        currentRow.forEach((letter, index) => {
          if (ansArray[index] === letter) {
            result[index] = "green"; // Mark as green
            ansArray[index] = null; // Remove the letter from ansArray to avoid double counting
          }
        });

        // Second pass for yellows (correct letter in wrong position)
        currentRow.forEach((letter, index) => {
          if (!result[index]) {
            if (ansArray.includes(letter)) {
              result[index] = "yellow"; // Mark as yellow
              ansArray[ansArray.indexOf(letter)] = null; // Remove the letter from ansArray
            } else {
              result[index] = "gray"; // Mark as gray
            }
          }
        });

        // If all letters are green, the game ends
        const isCorrect = result.every((color) => color === "green");

        return {
          ...state,
          currentGuess: isCorrect ? currentGuess : currentGuess + 1,
          guesses: isCorrect ? guesses : [...guesses], // Optionally store results
          result, // Optionally store the result to display colors
        };
      } else {
        console.log("Not enough letters");
      }
      return state;
    }

    case "RESET":
      return initialState;
    default:
      return state;
  }
}
function getBackgroundColor(state, rowIndex, colIndex) {
  const bgColor =
    state.result && state.result[rowIndex]
      ? state.result[rowIndex][colIndex]
      : "border-gray-400"; // Default border color if no result

  return bgColor === "green"
    ? "bg-green-500 border-green-500"
    : bgColor === "yellow"
      ? "bg-yellow-500 border-yellow-500"
      : "bg-gray-300 border-gray-400"; // Default to gray
}

function Board() {
  const [state, dispatch] = useReducer(guessReducer, initialState);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter") {
      dispatch({ type: "SUBMIT" });
    } else if (e.key === "Backspace") {
      dispatch({ type: "REMOVE_LETTER" });
    } else if (/^[a-zA-Z]$/.test(e.key)) {
      dispatch({
        type: "INPUT_LETTER",
        letter: e.key.toUpperCase(),
      });
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="m-auto my-8 grid w-80 grid-rows-6 items-center gap-y-2">
      {state.guesses?.map((guess, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-5 items-center gap-2">
          {guess.map((letter, colIndex) => {
            const bgClass = getBackgroundColor(state, rowIndex, colIndex);
            console.log(bgClass);
            return (
              <div
                key={colIndex}
                className={`flex h-14 w-14 items-center justify-center border-2 text-2xl font-bold uppercase ${bgClass}`}
              >
                {letter}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default Board;
