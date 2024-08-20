import { useReducer, useEffect, useState } from "react";

function Board() {
  const initialState = {
    answer: "",
    guess: ["", "", "", "", ""],
    currentGuess: 0,
  };

  function guessReducer(state, action) {
    switch (action.type) {
      case "INPUT_LETTER": {
        const updatedGuess = [...state.guess];
        updatedGuess[action.index] = action.letter;
        return {
          ...state,
          guess: updatedGuess,
        };
      }
      case "REMOVE_LETTER": {
        const newGuess = [...state.guess];
        for (let i = newGuess.length - 1; i >= 0; i--) {
          if (newGuess[i] !== "") {
            newGuess[i] = "";
            break;
          }
        }
        return {
          ...state,
          guess: newGuess,
        };
      }

      case "RESET":
        return initialState;

      default:
        return state;
    }
  }
  const [state, dispatch] = useReducer(guessReducer, initialState);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      console.log(state.guess);
    } else if (e.key === "Backspace") {
      dispatch({ type: "REMOVE_LETTER" });
    } else if (/^[a-zA-Z]$/.test(e.key)) {
      const emptyIndex = state.guess.findIndex((letter) => letter === "");
      if (emptyIndex !== -1) {
        dispatch({
          type: "INPUT_LETTER",
          index: emptyIndex,
          letter: e.key.toUpperCase(),
        });
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [state.guess]);

  return (
    <div className="m-auto my-8 grid w-80 grid-rows-6 items-center">
      <div className="grid grid-cols-5 items-center gap-2">
        {state.guess.map((letter, i) => (
          <div
            key={i}
            className="flex h-14 w-14 items-center justify-center border-2 border-gray-400 text-2xl font-bold uppercase"
          >
            {letter}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Board;
