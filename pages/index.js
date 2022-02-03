import Image from "next/image";
import { useEffect, useState } from "react";
import {BsSearch} from "react-icons/bs";
import Pokemon from 'pokemon-images';

export default function Home() {
  const [cityName, setCityName] = useState("Tokyo");
  const [weather, setWeather] = useState("");
  const [temp, setTemp] = useState("");
  const [unit, setUnit] = useState("C");
  // pokemon is {name:"",type:"",img:""} format
  const [pokemon, setPokemon] = useState({});

  const [shouldShowError, setShouldShowError] = useState(false);
  const errorMessage = "Something went wrong";

  const get_pokemon_type_by_weather = (temp, weather) => {
    //consider the unit of temperature in the future
    const pokemon_type = "electric";
    if (weather === "Rain") {
      return pokemon_type;
    }

    (temp >= 10 && temp < 12) || (temp >= 21 && temp < 23)
      ? (pokemon_type = "normal")
      : temp < 5
      ? (pokemon_type = "ice")
      : temp < 10
      ? (pokemon_type = "water")
      : temp >= 12 && temp < 15
      ? (pokemon_type = "grass")
      : temp >= 15 && temp < 21
      ? (pokemon_type = "ground")
      : temp >= 23 && temp < 27
      ? (pokemon_type = "bug")
      : temp <= 33
      ? (pokemon_type = "rock")
      : (pokemon_type = "fire");

    return pokemon_type;
  };



  const fetchPokemon = async (temp, weather) => {
    const pokemon_type = get_pokemon_type_by_weather(temp, weather);

    const res = await fetch(`${process.env.POKEMON_API_URL}${pokemon_type}`);
    const data = await res.json();

    //get a random pokemon which is different from the previous one
    const pokemons = data.pokemon;
    
    while (true) {
      const random_index = Math.floor(Math.random() * pokemons.length);
      const random_pokemon = pokemons[random_index].pokemon;
      if (random_pokemon.name !== pokemon.name) {
        
        // let pokemon_img = Pokemon.getSprite(random_pokemon.pokemon.name);
        try{

          let pokemon_img = Pokemon.getSprite(random_pokemon.name);
          
          console.log(random_pokemon.name);
          setPokemon({
            name:random_pokemon.name,
            type:pokemon_type,
            img:pokemon_img});
            break;
          }
          catch(err){
            setPokemon({
              name:random_pokemon.name,
              type:pokemon_type,
              img:"/pokeball.png"});
            }
        }


    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather();
  };

  const fetchWeather = async () => {
    try
    {
      const response = await fetch(
        `${process.env.WEATHER_API_URL}?q=${cityName}&appid=${process.env.WEATHER_API_KEY}&units=metric`
        );
        
    const data = await response.json();
    
    const aux_weather = data.weather[0].main;
    const aux_temp = data.main.temp;
    
    setWeather(aux_weather);
    setTemp(aux_temp);
    fetchPokemon(aux_temp, aux_weather);
    setShouldShowError(false);
  }
  catch(err){
    setShouldShowError(true);
  }
  };

  useEffect(() => {
    fetchWeather();
  }, []);



  return (
    <main className="min-h-screen bg-slate-200">
      <form className="flex flex-col bg-red-700 w-full pt-12 h-24 border-b-8 border-black" onSubmit={handleSubmit}>
        <div className="flex flex-row items-center gap-4 border-8 outline-none border-gray-900 w-1/2 self-center rounded-lg mt-3 text-gray-700 bg-slate-300">

        <input
          className="w-full p-3 text-gray-700"
          type="text"
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
          />
          <BsSearch width={5} height={5} className="mr-3" onClick={fetchWeather}/>
        </div>
      </form>

      <div className="flex flex-col items-center justify-center mt-16 mx-10">
        <div className="self-end">
          <div>
            <span>Weather:</span>
            <p className="text-3xl">{weather}</p>
          </div>
          <div></div>

          <span className="">Temp:</span>
          <p className="text-3xl">
            {temp}°{unit}
          </p>
        </div>

            {shouldShowError && <p className="text-red-500 text-center">{errorMessage}</p>}
            {!shouldShowError && (
              <div className="self-center flex flex-col">
            <span>
                POKEMON: {pokemon.name}
            </span>
            <span>
                type: {pokemon.type}
            </span>
            {pokemon.img && <Image src={pokemon.img} width={200} height={200} alt={pokemon.img}/>}
        </div>
            )}
      </div>
    </main>
  );
}
