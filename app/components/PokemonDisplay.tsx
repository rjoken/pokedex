import { useState } from "react";
import { Pokemon } from "../class/Pokemon";

interface Props {
  pokemon: Pokemon;
  caught: boolean;
}

export default function PokemonDisplay({ pokemon, caught }: Props) {
  const [isCaught, setCaught] = useState(caught);
  const toggleCaught = (): void => {
    setCaught(!isCaught);
  };

  return (
    <div
      className={`min-w-40 min-h-40 outline outline-1 p-2 m-2 outline-black  rounded-md text-center text-nowrap select-none cursor-pointer ${
        isCaught
          ? "bg-red-200 hover:bg-red-300"
          : "bg-gray-200 hover:bg-blue-200"
      }`}
      onClick={() => toggleCaught()}
    >
      <p>
        {pokemon.id.toString().padStart(3, "0")} - {pokemon.name}
      </p>
      <div className="flex justify-center items-center">
        <img
          src={"/sprites/" + pokemon.id + ".png"}
          className="w-20 image-render-pixel"
        ></img>
      </div>
      <p>{isCaught ? "Caught" : ""}</p>
    </div>
  );
}
