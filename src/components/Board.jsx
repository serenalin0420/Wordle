import { useReducer, useEffect, useCallback } from "react";

const initialState = {
  answer: "DELAY",
  guesses: Array(6).fill(["", "", "", "", ""]),
  currentGuess: 0,
  result: Array(6).fill(["white", "white", "white", "white", "white"]),
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
        const result = Array(5).fill("white");

        // First pass for greens (correct letter in correct position)
        currentRow.forEach((letter, index) => {
          if (ansArray[index] === letter) {
            result[index] = "green"; // Mark as green
            ansArray[index] = null; // Remove the letter from ansArray to avoid double counting
          }
        });

        // Second pass for yellows (correct letter in wrong position)
        currentRow.forEach((letter, index) => {
          if (result[index] === "white" && ansArray.includes(letter)) {
            result[index] = "yellow";
            ansArray[ansArray.indexOf(letter)] = null; // Remove the letter from ansArray
          }
        });

        currentRow.forEach((index) => {
          if (result[index] === "white") {
            result[index] = "gray";
          }
        });
        // Update the result in the state
        const updatedResults = [...state.result];
        updatedResults[currentGuess] = result;

        // If all letters are green, the game ends
        const isCorrect = result.every((color) => color === "green");

        return {
          ...state,
          currentGuess: isCorrect ? currentGuess : currentGuess + 1,
          guesses: isCorrect ? guesses : [...guesses],
          result: updatedResults, // Update the result array with the current row result
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
function getClassName(color) {
  switch (color) {
    case "green":
      return "bg-lime-600 border-lime-600 text-white";
    case "yellow":
      return "bg-yellow-500 border-yellow-500 text-white";
    case "gray":
      return "bg-gray-500 border-gray-500 text-white";
    default:
      return "bg-gray-200 border-gray-200 ";
  }
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
            const bgClass = getClassName(state.result[rowIndex][colIndex]);
            return (
              <div
                key={colIndex}
                className={`flex h-14 w-14 items-center justify-center rounded border-2 text-2xl font-bold uppercase ${bgClass}`}
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
