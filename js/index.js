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
    let map = `https://maps.geoapify.com/v1/staticmap?style=osm-bright-smooth&width=400&height=400&center=lonlat:${currentWeather.coord.lon},${currentWeather.coord.lat}&zoom=15&marker=lonlat:${currentWeather.coord.lon},${currentWeather.coord.lat};color:%23ff0000;size:medium&apiKey=98645432a8444ff996d0cd1f96bed12e`;
    let widget = document.createElement("li");
    widget.classList.add("widgets__widget");
    widget.innerHTML = `
        <div class="widgets__title">
            <h1 class="widgets__name">${currentWeather.name}</h1>
            <h2>${currentWeather.main.temp.toFixed(0)}°</h2>
            <img src=${icon} alt="Иконка">
            <h2 class="widgets__description">${currentWeather.weather[0].description}</h2>
        </div>
        <div class="widgets__info">
            <p class="widgets__item">Ощущается как: ${currentWeather.main.feels_like.toFixed(0)}°</p>
            <p class="widgets__item">Скорость ветра: ${currentWeather.wind.speed.toFixed(0)} м/c</p>
            <p class="widgets__item">Влажность: ${currentWeather.main.humidity} %</p>
            <p class="widgets__item">Давление: ${currentWeather.main.pressure} ГП</p>
        </div>
        <div class="widgets__map-wrapper">
            <a href="https://maps.yandex.ru/?ll=${currentWeather.coord.lon},${currentWeather.coord.lat}&z=10"><img class="widgets__map" src=${map} alt="Интерактивная Карта"></a>
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
