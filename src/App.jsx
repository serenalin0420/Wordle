import Board from "./components/Board";

function App() {
  return (
    <div>
      <header className="flex items-center justify-center border-b-2 py-4">
        <h1 className="text-4xl font-bold">Wordle</h1>
      </header>

      <Board />
    </div>
  );
}

export default App;
