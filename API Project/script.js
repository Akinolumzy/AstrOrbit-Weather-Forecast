document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("weather-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const citySelect = document.getElementById("city-select");
      const cityName = citySelect.options[citySelect.selectedIndex].text;
      const coordinates = citySelect.value.split(",");

      function fetchWeatherData(lon, lat) {
        fetch(
          `http://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civil&output=json`
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error(
                `Network response was not ok: ${response.statusText}`
              );
            }
            return response.json();
          })
          .then((data) => {
            processWeatherData(data.dataseries, cityName);
          })
          .catch((error) => {
            console.error(
              "There was a problem with the fetch operation:",
              error
            );
          });
      }

      function processWeatherData(dataseries, cityName) {
        const dailyTemperatures = {};

        dataseries.forEach((entry) => {
          const date = new Date();
          date.setHours(date.getHours() + entry.timepoint);

          const dateString = date.toISOString().split("T")[0]; // Extract date part
          const dayOfWeek = date.toLocaleDateString("en-US", {
            weekday: "long",
          }); // Get the day of the week
          const temp = entry.temp2m;
          const weatherDescription = getWeatherDescription(entry.weather);
          const weatherIcon = getWeatherIcon(entry.weather);

          if (!dailyTemperatures[dateString]) {
            dailyTemperatures[dateString] = {
              dayOfWeek,
              high: temp,
              low: temp,
              weatherDescription,
              weatherIcon,
            };
          } else {
            dailyTemperatures[dateString].high = Math.max(
              dailyTemperatures[dateString].high,
              temp
            );
            dailyTemperatures[dateString].low = Math.min(
              dailyTemperatures[dateString].low,
              temp
            );
          }
        });

        displayDailyTemperatures(dailyTemperatures, cityName);
      }

      function getWeatherDescription(code) {
        const descriptions = {
          clearday: "Clear Day",
          pcloudyday: "Partly Cloudy Day",
          pcloudynight: "Partly Cloudy Night",
          mcloudyday: "Mostly Cloudy Day",
          mcloudynight: "Mostly Cloudy Night",
          cloudyday: "Cloudy Day",
          cloudynight: "Cloudy Night",
          rainnight: "Rainy Night",
          rainday: "Rainy Day",
          snowday: "Snowy Day",
          snownight: "Snowy Night",
          rainsnowday: "Rain Snowy Day",
          rainsnownight: "Rain Snowy Night",
          tsrainday: "Thunder Storm Rainy Day",
          tsrainnight: "Thunder Storm Rainy Night",
          tstormday: "Thunder Storm Day",
          tstormnight: "Thunder Storm Night",
          windyday: "Windy Day",
          windynight: "Windy Night",
          lightrainday: "Light Rain Day",
          lightrainnight: "Light Rain Night",
          ishowerday: "Isolated Shower Day",
          ishowernight: "Isolated Shower Night",
          oshowerday: "Ordinary Shower Day",
          oshowernight: "Ordinary Shower Night",
          // Add more mappings as needed
        };
        return descriptions[code] || "Unknown Weather";
      }

      function getWeatherIcon(code) {
        const icons = {
          clearday: "clear.png",
          clearnight: "clear.png",
          pcloudyday: "pcloudy.png",
          pcloudynight: "pcloudy.png",
          mcloudyday: "mcloudy.png",
          mcloudynight: "mcloudy.png",
          cloudyday: "cloudy.png",
          cloudynight: "cloudy.png",
          rainday: "rain.png",
          rainnight: "rain.png",
          rainsnowday: "rainsnow.png",
          rainsnownight: "rainsnow.png",
          snowday: "snow.png",
          snownight: "snow.png",
          tsrainday: "tsrain.png",
          tsrainnight: "tsrain.png",
          tstormday: "tstorm.png",
          tstormnight: "tstorm.png",
          windyday: "windy.png",
          windynight: "windy.png",
          lightrainday: "lightrain.png",
          lightrainnight: "lightrain.png",
          ishowerday: "ishower.png",
          ishowernight: "ishower.png",
          oshowerday: "oshower.png",
          oshowernight: "oshower.png",

          // Add more mappings as needed
        };
        return icons[code] || "default.png";
      }

      function displayDailyTemperatures(dailyTemperatures, cityName) {
        const resultsDiv = document.getElementById("results");
        const cityNameHeading = document.createElement("h3");

        if (resultsDiv) {
          resultsDiv.innerHTML = ""; // Clear previous results

          cityNameHeading.textContent = `Weather Forecast for ${cityName}`;
          resultsDiv.appendChild(cityNameHeading);

          for (const date in dailyTemperatures) {
            const { dayOfWeek, high, low, weatherDescription, weatherIcon } =
              dailyTemperatures[date];
            const tempInfo = document.createElement("div");
            tempInfo.className = "forecast-item";
            tempInfo.innerHTML = `
              <p>${dayOfWeek}, ${date}</p>
              <img src="images/${weatherIcon}" alt="${weatherDescription}" class="weather-icon" />
              <p>${weatherDescription}</p>
              <p>High: ${high}°C</p>
              <p>Low: ${low}°C</p>
            `;
            resultsDiv.appendChild(tempInfo);
          }
        } else {
          console.error("resultsDiv not found in the DOM.");
        }
      }

      const lon = coordinates[0];
      const lat = coordinates[1];
      fetchWeatherData(lon, lat);
    });
});
