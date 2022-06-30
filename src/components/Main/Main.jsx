import axios from "axios";
import { useState } from "react";
import WeatherCard from "../WeatherCard/WeatherCard";

console.log(process.env.REACT_APP_API_KEY);

const Main = () => {
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    getWeatherApi();
    setSearchText("");
  };

  const getWeatherApi = async () => {
    //! look into pulling from .env
    let apiKey = process.env.REACT_APP_API_KEY;
    let lang = "eng";
    let unitType = "metric";
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${searchText}&appid=${apiKey}&units=${unitType}&lang=${lang}`;
    try {
      const response = await axios.get(url);
      const { id, main, name, sys, weather } = response.data;
      let iconUrl = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
      //   console.log(response);
      const isExist = data.some((card) => card.id === id);
      if (isExist) {
        setError(`You already know the weather for ${name} :)`);
        setTimeout(() => setError(""), 3000);
      } else {
        //! array concat very important to show multiple data
        setData([{ id, main, name, sys, weather, iconUrl }, ...data]);
      }
    } catch (error) {
      console.log(`There ha been an error: ${error}`);
      setError(error.message);
      setTimeout(() => setError(""), 3000);
    }
  };
  //   console.log(data);

  return (
    <section className="main">
      <form onSubmit={handleSubmit}>
        <input
          onChange={handleChange}
          type="text"
          placeholder="Search for a city"
          value={searchText}
          autoFocus
        />
        <button type="submit">SUBMIT</button>
        <span className="msg">{error}</span>
      </form>
      <div className="container">
        <ul className="cities">
          {data.map((item) => (
            <WeatherCard key={item.id} {...item} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Main;
