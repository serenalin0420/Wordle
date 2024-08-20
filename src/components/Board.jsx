import { useReducer, useEffect, useCallback } from "react";

const initialState = {
  answer: "REACT",
  guess: ["", "", "", "", ""],
  currentGuess: 0,
};

function guessReducer(state, action) {
  switch (action.type) {
    case "INPUT_LETTER": {
      const emptyIndex = state.guess.findIndex((letter) => letter === "");
      if (emptyIndex !== -1) {
        const updatedGuess = [...state.guess];
        updatedGuess[emptyIndex] = action.letter;
        return {
          ...state,
          guess: updatedGuess,
        };
      }
      return state;
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

    case "SUBMIT":
      // 當五個字母都輸入完成，換行(處理判斷: 錯誤顯示灰色、有此字母顯示黃色、有字母且位置正確顯示綠色)
      if (state.guess.every((letter) => letter !== "")) {
        console.log("check if its the ans");
      } else {
        console.log("Not enough letters");
      }
      return state;

    case "RESET":
      return initialState;

    default:
      return state;
  }
}
function Board() {
  const [state, dispatch] = useReducer(guessReducer, initialState);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        dispatch({ type: "SUBMIT" });
        console.log(state.guess);
      } else if (e.key === "Backspace") {
        dispatch({ type: "REMOVE_LETTER" });
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        dispatch({
          type: "INPUT_LETTER",
          letter: e.key.toUpperCase(),
        });
      }
    },
    [state.guess],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

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
