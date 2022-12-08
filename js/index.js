const list = document.getElementById('list');
const message = document.getElementById('error');
const lat = document.getElementById('lat');
const lon = document.getElementById('lon');
const check = document.getElementById('check')
const del = document.getElementById('delete');

async function GetApi(lat, lon) {
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat.value}&lon=${lon.value}&appid=94b70771a358892690761eb88b6c0fd5&lang=ru&units=metric`);
    return await response.json()
}

function createWidgets() {
    check.addEventListener('click', eventListener => {
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
    let map = `https://static-maps.yandex.ru/1.x/?ll=${currentWeather.coord.lon},${currentWeather.coord.lat}&size=400,400&z=10&l=map&pt=${currentWeather.coord.lon},${currentWeather.coord.lat},comma`
    let widget = document.createElement("li");
    widget.classList.add("widgets__widget");
    widget.innerHTML = `
        <div class="widgets__head">
            <h1>${currentWeather.name}</h1>
            <h2>${Math.floor(currentWeather.main.temp)}°</h2>
            <img src=${icon} alt="Иконка текущей погоды">
            <h2>${currentWeather.weather[0].description}</h2>
        </div>
        <div class="widgets__info">
            <p class="widgets__item">Скорость ветра: ${currentWeather.wind.speed.toFixed(0)} м/c</p>
            <p class="widgets__item">Влажность: ${currentWeather.main.humidity} %</p>
            <p class="widgets__item">Давление: ${currentWeather.main.pressure} ГП</p>
        </div>
        <div class="widgets__map-wrapper">
            <a href="https://maps.yandex.ru/?ll=${currentWeather.coord.lon},${currentWeather.coord.lat}&z=10&pt=${currentWeather.coord.lon},${currentWeather.coord.lat},comma" target="_blank">
                <img class="widgets__map" src=${map} alt="Интерактивная Карта">
            </a>
        </div>`;
    list.appendChild(widget);
    localStorage.setItem("list", JSON.stringify(list.innerHTML));
}

function deleteWidgets() {
    del.addEventListener('click', () => {
        list.innerHTML = '';
        localStorage.clear();
    });
}

function app() {
    createWidgets();
    deleteWidgets();
}

app();
