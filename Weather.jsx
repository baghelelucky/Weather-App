import React, { useEffect, useState, useRef } from 'react';
import './Weather.css';

import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import humidity_icon from '../assets/humidity.png';
import rain_icon from '../assets/Rain.png';
import snow_icon from '../assets/snow.png';
import wind_icon from '../assets/wind.png';
import drizzle_icon from '../assets/dizzle.png';

const Weather = () => {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('');

  const allIcons = {
    '01d': clear_icon,
    '01n': clear_icon,
    '02d': cloud_icon,
    '02n': cloud_icon,
    '03d': cloud_icon,
    '03n': cloud_icon,
    '04d': drizzle_icon,
    '04n': drizzle_icon,
    '09d': rain_icon,
    '09n': rain_icon,
    '10d': rain_icon,
    '10n': rain_icon,
    '13d': snow_icon,
    '13n': snow_icon,
  };

  const search = async (cityName) => {
    if(city==""){
      alert("Enter City Name..")
      return;
    }
    try {
      const apiKey = import.meta.env.VITE_APP_ID;
      if (!apiKey) {
        alert("API key not found. Please set VITE_APP_ID in your .env file.");
        return;
      }

      const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.cod !== 200) {
        alert('City not found!');
        return;
      }

      const icon = allIcons[data.weather[0].icon] || clear_icon;

      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: icon,
      });
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  useEffect(() => {
    search('Akot');
  }, []);

  return (
    <div className="weather">
      <div className="search-bar">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search city..."
          className="search-input"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <img
          src={search_icon}
          alt="search"
          className="search-icon"
          onClick={() => search(inputRef.current.value)}
          style={{ cursor: 'pointer' }}
        />
      </div>

      {weatherData ? (
        <>
          <img src={weatherData.icon} alt="weather-icon" className="weather-icon" />
          <p className="temperature">{weatherData.temperature}&#176;C</p>
          <p className="location">{weatherData.location}</p>

          <div className="weather-data">
            <div className="col">
              <img src={humidity_icon} alt="humidity" />
              <div>
                <p>{weatherData.humidity}%</p>
                <span>Humidity</span>
              </div>
            </div>

            <div className="col">
              <img src={wind_icon} alt="wind" />
              <div>
                <p>{weatherData.windSpeed} km/hr</p>
                <span>Wind</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p style={{ textAlign: 'center', marginTop: '20px' }}>Loading weather data...</p>
      )}
    </div>
  );
};

export default Weather;
