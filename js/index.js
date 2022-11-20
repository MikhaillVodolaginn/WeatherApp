const list = document.getElementById('list');
const message = document.getElementById('error');
const form = document.getElementById('form');
const lat = document.getElementById('lat');
const lon = document.getElementById('lon');
const del = document.getElementById('delete');

async function GetApi(lat, lon) {
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat.value}&lon=${lon.value}&appid=94b70771a358892690761eb88b6c0fd5&lang=ru&units=metric`);
    return await response.json()
}

function createWidgets() {
    form.addEventListener('submit', eventListener => {
        eventListener.preventDefault()
        GetApi(lat, lon)
            .then(currentWeather => {
                createWidget(currentWeather)
            })
            .catch(() => {
                message.textContent = 'Введенные вами координаты некорректны.';
            });
        message.textContent = '';
        form.reset();
    });
}

function createWidget(currentWeather) {
    let icon = `https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`;
    let map = `https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=600&height=500&center=lonlat:${currentWeather.coord.lon},${currentWeather.coord.lat}&zoom=8&marker=lonlat:${currentWeather.coord.lon},${currentWeather.coord.lat};color:%23ff0000;size:medium&apiKey=7b128cd8393743309d239f6e08f5fa23`;
    let widget = document.createElement("li");
    widget.classList.add("widgets__widget");
    widget.innerHTML = `
        <div class="widgets__title">
            <h1 class="widgets__name">${currentWeather.name}</h1>
            <h2>${Math.floor(currentWeather.main.temp)}°</h2>
            <img src=${icon} alt="Иконка">
            <h2 class="widgets__description">${currentWeather.weather[0].description}</h2>
        </div>
        <div class="widgets__info">
            <p class="widgets__item">Скорость ветра: ${currentWeather.wind.speed.toFixed(0)} м/c</p>
            <p class="widgets__item">Влажность: ${currentWeather.main.humidity} %</p>
            <p class="widgets__item">Давление: ${currentWeather.main.pressure} ГП</p>
        </div>
        <div class="widgets__map-wrapper">
            <a href="https://maps.yandex.ru/?ll=${currentWeather.coord.lon},${currentWeather.coord.lat}&z=10" target="_blank"><img class="widgets__map" src=${map} alt="Карта"></a>
        </div>`;
    list.appendChild(widget);
    localStorage.setItem("list", JSON.stringify(list.innerHTML));
}

function deleteWidgets() {
    del.addEventListener('click', () => {
        list.innerHTML = '';
        lat.value = '';
        lon.value = '';
        localStorage.clear();
    });
}

function checkLocalStorage() {
    if (list.innerHTML === "") {
        list.innerHTML = JSON.parse(localStorage.getItem("list", JSON.stringify(list)));
    }
}

function app() {
    createWidgets();
    deleteWidgets();
    checkLocalStorage();
}

app();
