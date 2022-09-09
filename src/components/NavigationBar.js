import React, { useState, useEffect } from "react";
import navLinks from "../data/navigationData.json";
import spinner from "../assets/spinner.gif";

export default function NavigationBar() {
  const [active, setactive] = useState(navLinks.cities[0].section);
  const [loading, setloading] = useState(false);
  const [error, setError] = useState("");
  const [locationTime, setlocationTime] = useState(null);
  const numberOfCountries = navLinks.cities.length;

  async function fetchTime(url) {
    setloading(true);

    try {
      const res = await fetch(url);
      const data = await res.json();
      setlocationTime(data);
    } catch (err) {
      setError(err.message || "Unexpected Error!");
    } finally {
      setloading(false);
    }
  }

  useEffect(() => {
    myFunction(0, navLinks.cities[0].section);
  }, []);

  function myFunction(idx, className) {
    let location = className.replaceAll("-", "%20");
    fetchTime(
      `https://api.ipgeolocation.io/timezone?apiKey=${process.env.REACT_APP_TIMEZONE_API}&location=${location}`
    );

    if (active !== null) {
      const prevElement = document.getElementsByClassName(active)[0];
      prevElement.classList.remove("currentlyActive");
    }
    setactive(className);
    document.getElementsByClassName("myHR")[0].style.marginLeft = idx + "00%";
    const activeElement = document.getElementsByClassName(className)[0];
    activeElement.classList.add("currentlyActive");
  }
  return (
    <>
      <div className="wrapper">
        <ul
          className="menu"
          style={{ gridTemplateColumns: `repeat(${numberOfCountries}, 1fr)` }}
        >
          {navLinks?.cities.map((item, idx) => (
            <li key={item.label}>
              <a
                href={`#${item.label}`}
                className={`country ${item.section}`}
                onClick={() => myFunction(idx, item.section)}
              >
                {item.label}
              </a>
            </li>
          ))}
          <hr className="myHR" />
        </ul>
      </div>
      <div className="datetime">
        {loading ? (
          <img src={spinner} alt="spinner" />
        ) : (
          <h2>
            {locationTime?.date} {locationTime?.time_12}
            <br />
            <p>
              {active},{" "}
              {locationTime?.geo.state && `${locationTime?.geo.state} ,`}{" "}
              {locationTime?.geo.country}
            </p>
          </h2>
        )}
        <div>{error && <p> Kindly Check this error error</p>}</div>
      </div>
    </>
  );
}
