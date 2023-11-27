const busButton = document.getElementById("bus");
const tramButton = document.getElementById("tram");
const trainButton = document.getElementById("train");
const planeBusButton = document.getElementById("planebus");
const dataWrapper = document.querySelector(".data-wrapper");
const select = document.getElementById("travel-options");

const baseUrlDepartures =
  "https://api.resrobot.se/v2.1/departureBoard?id=740000002&format=json&accessId=";
const baseUrlArrivals =
  "https://api.resrobot.se/v2.1/arrivalBoard?id=740000002&format=json&accessId=";
const apiKey = "d0770baf-77eb-4f7d-940e-69631f28f2fc";
const products = "&products=";

const transportModes = [
  { mode: "Spårvagn", value: products + "64" },
  { mode: "Buss", value: products + "128" },
  { mode: "Tåg", value: products + "22" },
  { mode: "Flygbus", value: products + "8" },
];

select.addEventListener("change", (event) => {
  fetchDeparturesWithTravelMode(event.target.value);
});

const loadButtons = () => {
  transportModes.forEach((mode) => {
    const modeOption = document.createElement("option");
    modeOption.innerText = mode.mode;
    modeOption.value = mode.value;
    select.appendChild(modeOption);
  });
};

const fetchDepartures = async () => {
  const response = await fetch(baseUrlDepartures + apiKey);
  const data = await response.json();
  displayData(data.Departure);
};

const fetchDeparturesWithTravelMode = async (travelMode) => {
  const response = await fetch(baseUrlDepartures + apiKey + travelMode);
  const data = await response.json();
  displayData(data.Departure);
};

const displayData = (departures) => {
  dataWrapper.innerHTML = "";
  departures.forEach((departure) => {
    const timeDiv = document.createElement("div");
    const operatorDiv = document.createElement("div");
    const directionDiv = document.createElement("div");
    const wrapperDiv = document.createElement("div");
    const numberDiv = document.createElement("div");
    operatorDiv.classList.add("operator-div");
    timeDiv.classList.add("time-div");
    directionDiv.classList.add("direction-div");
    numberDiv.classList.add("number-div");
    wrapperDiv.classList.add("departure-div");

    let number = departure.ProductAtStop.displayNumber;
    let time = departure.time;
    let direction = departure.direction;
    let operator = departure.ProductAtStop.operator;
    numberDiv.innerText = number;
    operatorDiv.innerText = operator;
    timeDiv.innerText = time;
    directionDiv.innerText = direction;

    wrapperDiv.appendChild(timeDiv);
    wrapperDiv.appendChild(numberDiv);
    wrapperDiv.appendChild(directionDiv);
    wrapperDiv.appendChild(operatorDiv);
    dataWrapper.appendChild(wrapperDiv);
  });
};

loadButtons();
fetchDepartures();
