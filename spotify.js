const clientId = '008b8e2764ac4deebdfdfbea8d968697';
const clientSecret = 'c7b5cc9212c64008bc4c5b693cadcdf5';
const playlistId = {
  sunnyPlaylist: '37i9dQZF1DX1BzILRveYHb',
  cloudyPlaylist: '2RXp3BYsvstt4OLs35MEAE',
  rainyPlaylist: '37i9dQZF1EIh5QTm0PNBlW',
  snowyPlaylist: '1hj8GeS1lgYZo395cifqPT',
  mistyPlaylist: '78fp8BwhXDslBEz5KL6pes',
  defaultPlaylist: '37i9dQZF1DXcBWIGoYBM5M'
};

const apiKey = '99e754536fff9292551475a38372ee9a';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

const searchInput = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-button');
const weatherIcon = document.querySelector('.weather-icon');

// Function to get an access token
async function getAccessToken() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
    },
    body: 'grant_type=client_credentials'
  });

  const data = await response.json();
  return data.access_token;
}

// Function to get a playlist based on weather
function getPlaylistIdByWeather(weather) {
  switch (weather) {
    case 'Clear':
      return playlistId.sunnyPlaylist;
    case 'Clouds':
      return playlistId.cloudyPlaylist;
    case 'Rain':
      return playlistId.rainyPlaylist;
    case 'Snow':
      return playlistId.snowyPlaylist;
    case 'Mist':
      return playlistId.mistyPlaylist;
    default:
      return playlistId.defaultPlaylist;
  }
}

// Function to get a playlist
async function getPlaylist(accessToken, playlistId) {
  const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
    headers: {
      'Authorization': 'Bearer ' + accessToken
    }
  });

  const data = await response.json();
  return data;
}

// Function to display a playlist with images and limited songs
function displayPlaylist(playlist) {
  const playlistDiv = document.getElementById('playlist');
  playlistDiv.innerHTML = `<h2 id="playlist-title"><a href="${playlist.external_urls.spotify}" target="_blank">${playlist.name}</a></h2>`;
  
  // Limit the number of songs to display
  const numSongs = Math.min(playlist.tracks.items.length, 20);
  
  // Loop through the songs and display them with images
  for (let i = 0; i < numSongs; i++) {
    const item = playlist.tracks.items[i];
    playlistDiv.innerHTML += `<div class="playlist-item">
      <a href="${item.track.external_urls.spotify}" target="_blank">
        <img src="${item.track.album.images[0].url}" alt="Album cover">
        <div class="details">
          <h3>${item.track.name}</h3>
          <p>by ${item.track.artists[0].name}</p>
        </div>
      </a>
    </div>`;
  }
}



// Function to fetch weather data and display playlist
async function fetchWeather(city) {
  try {
    const response = await fetch(`${apiUrl}?q=${city}&units=metric&appid=${apiKey}`);
    if (!response.ok) {
      throw new Error('Weather data not available for the specified city');
    }

    const data = await response.json();

    document.querySelector('.city').innerText = data.name + ', ' + data.sys.country;
    document.querySelector('.main-weather').innerText = data.weather[0].description;
    document.querySelector('.temp').innerText = Math.round(data.main.temp) + '°C';
    document.querySelector('.humidity').innerText = data.main.humidity + '%';
    document.querySelector('.wind').innerText = Math.round(data.wind.speed) + ' km/h';
    document.querySelector('.feels-like').innerText = Math.round(data.main.feels_like) + '°C';
    document.querySelector('.pressure').innerText = data.main.pressure + ' hPa';

    const weather = data.weather[0].main;
    switch (weather) {
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

    // Get access token
    const accessToken = await getAccessToken();
    // Get playlist id based on weather
    const playlistId = getPlaylistIdByWeather(weather);
    // Get playlist
    const playlist = await getPlaylist(accessToken, playlistId);
    // Display the playlist
    displayPlaylist(playlist);

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

searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const city = searchInput.value;
    fetchWeather(city);
  }
});