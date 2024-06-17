const apiKey = '99e754536fff9292551475a38372ee9a';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

const searchInput = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-button');
const weatherIcon = document.querySelector('.weather-icon');

async function fetchWeather(city) {
  try {
    const response = await fetch(`${apiUrl}?q=${city}&units=metric&appid=${apiKey}`);
    if (!response.ok) {
      throw new Error('Weather data not available for the specified city');
    }

    const data = await response.json();

    document.querySelector('.city').innerText = data.name + ', ' + data.sys.country;
    document.querySelector('.temp').innerText = Math.round(data.main.temp) + '°C';
    document.querySelector('.humidity').innerText = data.main.humidity + '%';
    document.querySelector('.wind').innerText = Math.round(data.wind.speed) + ' km/h';

    switch (data.weather[0].main) {
      case 'Clear':
        weatherIcon.src = 'images/sunny.png';
        break;
      case 'Clouds':
        weatherIcon.src = 'images/cloudy.png';
        break;
      case 'Rain':
        weatherIcon.src = 'images/rain.png';
        break;
      case 'Snow':
        weatherIcon.src = 'images/snow.png';
        break;
      case 'Mist':
        weatherIcon.src = 'images/mist.png';
        break;
      default:
        weatherIcon.src = 'images/sunny.png'; 
    }

    // Hide error message if data is fetched successfully
    document.querySelector('.error').style.display = 'none';
    // Show weather details
    document.querySelector('.weather').style.display = 'block';
  } catch (error) {
    // Show error message
    document.querySelector('.error').innerText = 'Invalid city name';
    document.querySelector('.error').style.display = 'block';
    // Hide weather details
    document.querySelector('.weather').style.display = 'none';
  }
}


searchButton.addEventListener('click', () => {
  const city = searchInput.value;
  fetchWeather(city);
});



document.querySelector('.city').innerText = data.name + ', ' + data.sys.country;
document.querySelector('.main-weather').innerText = data.weather[0].description;
document.querySelector('.temp').innerText = Math.round(data.main.temp) + '°C';
document.querySelector('.humidity').innerText = data.main.humidity + '%';
document.querySelector('.wind').innerText = Math.round(data.wind.speed) + ' km/h';
document.querySelector('.feels-like').innerText = Math.round(data.main.feels_like) + '°C';
document.querySelector('.pressure').innerText = data.main.pressure + ' hPa';