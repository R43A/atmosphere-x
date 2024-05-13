import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import clearSkyImage from "../images/sunny.jpg";
import snowyImage from "../images/snowy.jpg";
import coldImage from "../images/cold.jpg";
import hotImage from "../images/hot.jpg";
import moderateImage from "../images/moderate.jpg";

function HomePage() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const getLocationAndWeather = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            fetchWeather(latitude, longitude);
          },
          (error) => {
            console.error("Error getting user location:", error);
            setLoading(false);
          }
        );
      } else {
        console.log("Geolocation is not supported by this browser.");
        setLoading(false);
      }
    };

    const fetchWeather = async (latitude, longitude) => {
      const url = `https://weatherapi-com.p.rapidapi.com/current.json?q=${latitude},${longitude}`;
      const options = {
        method: "GET",
        headers: {
          "X-RapidAPI-Key":
            "f3da518257msh97e4dc94856b350p16a48bjsn6558123f12c7",
          "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
        },
      };

      try {
        const response = await fetch(url, options);
        const result = await response.json();
        console.log("Fetched weather data:", result);
        setWeather(result);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setLoading(false);
      }
    };

    getLocationAndWeather();

    return () => {};
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    const url = `https://weatherapi-com.p.rapidapi.com/current.json?q=${searchQuery}`;
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "f3da518257msh97e4dc94856b350p16a48bjsn6558123f12c7",
        "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
      },
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      console.log("Fetched weather data:", result);
      setWeather(result);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setLoading(false);
    }
  };

  const getBackgroundImage = () => {
    if (!weather || !weather.current) return clearSkyImage;

    const temperature = weather.current.temp_c;
    if (temperature <= 0) return snowyImage;
    if (temperature > 0 && temperature <= 15) return coldImage;
    if (temperature > 15 && temperature <= 25) return moderateImage;
    if (temperature > 25) return hotImage;
    return clearSkyImage; // Default image
  };

  const getTemperature = () => {
    return weather && weather.current
      ? Math.round(weather.current.temp_c)
      : null;
  };

  const getLocation = () => {
    return weather && weather.location
      ? `${weather.location.name}, ${weather.location.region}, ${weather.location.country}`
      : "Unknown Location";
  };

  return (
    <>
      <div className="root">
        <nav className="navbar bg-body-transparent">
          <div className="container">
            <Link className="navbar-brand" to="/">
              atmosphere-X
            </Link>
          </div>
        </nav>

        <div className="parent-img">
          <img
            src={getBackgroundImage()}
            alt="backgroundImage"
            className="child-img img-fluid"
          />
        </div>

        <div className="container-fluid">
          <div className="row">
            <div className="col-md-8">
              {loading ? (
                <h1 className="display-4 parent-rightSide-text">Loading...</h1>
              ) : (
                <>
                  <h1 className="display-4 parent-rightSide-text">
                    {getTemperature()}°C, {getLocation()}
                  </h1>
                </>
              )}
            </div>
            <div className="col-md-4">
              <div className="parent-sidebar">
                <form className="d-flex" role="search" onSubmit={handleSearch}>
                  <input
                    className="form-control me-2"
                    type="search"
                    placeholder="Enter Location"
                    aria-label="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>
              </div>
              <div className="parent-details">
                {weather && weather.current && (
                  <div className="weather-details">
                    <p>Humidity:</p>
                    <p>{weather.current.humidity}%</p>
                  </div>
                )}
                {weather && weather.current && (
                  <div className="weather-details">
                    <p>Rain:</p>
                    <p>{weather.current.precip_mm}mm</p>
                  </div>
                )}
                {weather && weather.current && (
                  <div className="weather-details">
                    <p>Cloudy:</p>
                    <p>{weather.current.cloud}%</p>
                  </div>
                )}
                {weather && weather.current && (
                  <div className="weather-details">
                    <p>Wind:</p>
                    <p>{weather.current.wind_kph} km/h</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
