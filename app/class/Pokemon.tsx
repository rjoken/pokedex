export interface Pokemon {
  id: number;
  name: string;
  types: string[];
}

export interface PokemonDictionary {
  [id: number]: Pokemon;
}
