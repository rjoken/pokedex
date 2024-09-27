"use client";
import { useState, useEffect } from "react";
import { Pokemon, PokemonDictionary } from "../class/Pokemon";
import PokemonDisplay from "./PokemonDisplay";

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
  }, []);

  return { data, loading, error };
}

export default function Pokedex() {
  const { data, error, loading } = useData("/pokemon.json");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading data: {error.message}</div>;

  const pokemons: Pokemon[] = Object.values(data);

  return (
    <div className="flex flex-wrap items-center">
      {pokemons.map((pokemon) => (
        <PokemonDisplay pokemon={pokemon} caught={false} />
      ))}
    </div>
  );
}
