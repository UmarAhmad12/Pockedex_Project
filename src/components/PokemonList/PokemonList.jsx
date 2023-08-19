import { useEffect, useState } from "react";
import axios from "axios";
import "./PokemonList.css";
import Pokemon from "../Pokemon/Pokemon";

function PokemonList() {

    const [pokemonList, setPokemonList] = useState([]);
    const [isloading, setIsLoading] = useState(true);

    const [pockedexUrl, setPockedexUrl] = useState('https://pokeapi.co/api/v2/pokemon/?offset=20&limit=20');

    const [nextUrl, setNextUrl] = useState('')
    const [prevUrl, setPrevUrl] = useState('');

    async function downloadPokemons() {
        setIsLoading(true);
        const response = await axios.get(pockedexUrl);  // This downloads list of 20 pokemons
        const pokemonResults = response.data.results;  // We get the array of pokemons from result
        console.log(response.data);
        setNextUrl(response.data.next);
        setPrevUrl(response.data.previous);

        // Iterating over the array of pokemons, and using their url, to create an array of promises that will download those 20 pokemons.
        const pokemonResultPromise = pokemonResults.map((pokemon) => axios.get(pokemon.url));
        // passing that promise array to axios.all
        const pokemonData = await axios.all(pokemonResultPromise); // array of 20 pokemon datailed data
        console.log(pokemonData);
        // Now iterate on the data of each pokemon and extract id, name, image, types
        const pokeListResult = pokemonData.map((pokeData) => {
            const pokemon = pokeData.data;

            return { 
                id: pokemon.id,
                name: pokemon.name,
                 image: (pokemon.sprites.other)? pokemon.sprites.other.dream_world.front_default : pokemon.sprites.front_shiny, 
                types: pokemon.types}; 
        } );
        console.log(pokeListResult);
        setPokemonList(pokeListResult);
        setIsLoading(false);
    }

    useEffect( () => {
        downloadPokemons();
    }, [pockedexUrl]);


    return(
    <>
        <div className="pokemon-list-wrapper">
       <div className="pokemon-wrapper">{(isloading) ? 'Loading....' : pokemonList.map((p) => <Pokemon name={p.name} image={p.image} key={p.id} />)
       }
       </div>
       <div className="controls">
       <button disabled={prevUrl == null} onClick={() => setPockedexUrl(prevUrl)}>Prev</button>
       <button disabled = {nextUrl == null} onClick={() => setPockedexUrl(nextUrl)}>Next</button>
       </div>
        </div>

    </>
    )
}

export default PokemonList;