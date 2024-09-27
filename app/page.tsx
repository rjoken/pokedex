import Pokedex from "./components/Pokedex";

export default function Home() {
  return (
    <div>
      <h1 className="m-4 font-serif font-black text-4xl">Pokedex</h1>
      <Pokedex />
      <footer>2024 hippochan - sprites provided by veekun</footer>
    </div>
  );
}
