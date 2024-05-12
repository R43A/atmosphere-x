import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import backgroundImage from "../images/weather-bg.jpg";

function HomePage() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Function to get user's current location and fetch weather data
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

    // Function to fetch weather data using coordinates
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

    // Call getLocationAndWeather when component mounts
    getLocationAndWeather();

    // Cleanup function
    return () => {};
  }, []);

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
            src={backgroundImage}
            alt="backgrounIimage"
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
                    {weather && weather.current ? (
                      <>
                        {weather.current.temp_c}°C, {weather.location.name},{" "}
                        {weather.location.country}
                      </>
                    ) : (
                      "Weather Data Not Available"
                    )}
                  </h1>
                </>
              )}
            </div>
            <div className="col-md-4">
              <div className="parent-sidebar">
                <form className="d-flex" role="search">
                  <input
                    className="form-control me-2"
                    type="search"
                    placeholder="Enter Location"
                    aria-label="Search"
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
                    <p>Cloud:</p>
                    <p>{weather.current.cloud}</p>
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
