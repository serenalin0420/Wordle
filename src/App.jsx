import Board from "./components/Board";

function App() {
  return (
    <div>
      <header className="my-3 flex items-center justify-center">
        <h1 className="text-4xl font-bold">Wordle</h1>
      </header>

      <Board guess={"react"} />
    </div>
  );
}

export default App;
