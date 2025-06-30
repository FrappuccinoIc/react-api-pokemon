import { useState, useEffect } from "react";
import './PokemonFetcher.css';

function PokemonFetcher() {
    const [pokemon, setPokemon] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPokemon = async () => {
            try {
                setCargando(true);
                setError(null);
                const fetchedPokemon = [];
                const pokemonId = new Set(); // Estructura de datos usada para evitar registros duplicados

                while(pokemonId.size < 4) {
                    const randomId = Math.floor(Math.random() * 898) + 1;
                    pokemonId.add(randomId)
                }

                const idArray = Array.from(pokemonId);

                for (const id of idArray) {
                    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
                    if(!response.ok) {
                        throw new Error(`Error fetching Pokemon with ID ${id}`);
                    }
                    const data = await response.json()
                    fetchedPokemon.push({
                        id: data.id,
                        name: data.name,
                        image: data.sprites.front_default,
                        types: data.types.map(infoTipo => infoTipo.type.name.charAt(0).toUpperCase() + infoTipo.type.name.slice(1)).join(', ')
                    })
                }

                setPokemon(fetchedPokemon);

            } catch(err) {setError(err.message);
            } finally {setCargando(false);}
        }
        fetchPokemon();
    }, []);

    if(cargando) {
        return <p>Cargando Pokémon...</p>;
    }
    if(error) {
        return <p>Oops! You need to insert the disk [UP YOUR ASS]: {error}</p>;
    }

    return (
        <div className="pokemon-container">
            <h2>Tus 4 Pokémon Aleatorios</h2>
            <div className="pokemon-list">
                {pokemon.map(pokemon => (
                    <div key={pokemon.id} className="pokemon-card">
                        <h3>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
                        <img src={pokemon.image} alt={pokemon.name}/>
                        <p>Tipos: {pokemon.types}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PokemonFetcher;