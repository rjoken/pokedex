"use client";
import { useState, useEffect } from "react";
import { Pokemon, PokemonDictionary } from "../class/Pokemon";
import PokemonDisplay from "./PokemonDisplay";
import { useCookies } from "react-cookie";

function useData(url: string) {
  const [data, setData] = useState<PokemonDictionary>({});
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(url);
        const result = await res.json();

        if (Array.isArray(result.pokemons)) {
          const dictionary: PokemonDictionary = result.pokemons.reduce(
            (dict: PokemonDictionary, jsonItem: any) => {
              const pokemon: Pokemon = {
                id: jsonItem.id,
                name: jsonItem.name,
                types: jsonItem.types,
              };
              dict[pokemon.id] = pokemon;
              return dict;
            },
            {} as PokemonDictionary
          );
          setData(dictionary);
        } else {
          throw new Error(
            "Expected an array in the `pokemons` property, but got something else instead."
          );
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}

export default function Pokedex() {
  const { data, error, loading } = useData("/pokemon.json");
  const [cookies, setCookie] = useCookies(["caughtPokemon"]);
  const [caughtPokemon, setCaughtPokemon] = useState<{
    [key: number]: boolean;
  }>({});
  const [cookieLoaded, setCookieLoaded] = useState(false);

  const pokemons: Pokemon[] = Object.values(data);

  const saveCaughtToCookie = (caught: { [key: number]: boolean }) => {
    let binaryStr: string = pokemons
      .map((pokemon) => (caught[pokemon.id] ? "1" : "0"))
      .join("");
    binaryStr = `b${binaryStr}`;
    setCookie("caughtPokemon", binaryStr, {
      path: "/",
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    });
  };

  useEffect(() => {
    if (pokemons.length > 0 && !cookieLoaded) {
      const loadCaughtFromCookie = () => {
        let cookie = String(cookies.caughtPokemon).slice(1);
        if (cookie) {
          const caughtStatus: { [key: number]: boolean } = {};
          cookie.split("").forEach((char: string, index: number) => {
            caughtStatus[pokemons[index].id] = char === "1";
          });
          setCaughtPokemon(caughtStatus);
        }
      };
      loadCaughtFromCookie();
      setCookieLoaded(true);
    }
  }, [pokemons, cookieLoaded]);

  const toggleCaught = (id: number): void => {
    setCaughtPokemon((prevCaught) => {
      const updatedCaught = {
        ...prevCaught,
        [id]: !prevCaught[id],
      };
      saveCaughtToCookie(updatedCaught);
      return updatedCaught;
    });
  };

  const resetCaught = (): void => {
    const caughtStatus: { [key: number]: boolean } = {};
    pokemons.forEach((pokemon: Pokemon, index: number) => {
      caughtStatus[pokemons[index].id] = false;
    });
    setCaughtPokemon(caughtStatus);
    saveCaughtToCookie(caughtStatus);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading data: {error.message}</div>;

  return (
    <div>
      <div className="flex items-center">
        <h1 className="m-4 font-serif font-black text-4xl">
          Pokedex{" "}
          {
            Object.values(caughtPokemon).filter((caught) => caught == true)
              .length
          }
          {"/"}
          {Object.values(caughtPokemon).length}
        </h1>
        <button
          className="bg-gray-200 hover:bg-blue-200 outline outline-1 rounded-md p-2"
          onClick={() => resetCaught()}
        >
          Reset
        </button>
      </div>
      <div className="flex flex-wrap items-center justify-center">
        {pokemons.map((pokemon) => (
          <PokemonDisplay
            key={pokemon.id}
            pokemon={pokemon}
            caught={!!caughtPokemon[pokemon.id]}
            toggleCaught={toggleCaught}
          />
        ))}
      </div>
    </div>
  );
}
