const busButton = document.getElementById("bus");
const tramButton = document.getElementById("tram");
const trainButton = document.getElementById("train");
const planeBusButton = document.getElementById("planebus");
const dataWrapper = document.querySelector(".data-wrapper");
const select = document.getElementById("travel-options");
const icon = document.querySelector(".select-icon");
icon.innerHTML = "&#xf141;";

const baseUrlDepartures =
  "https://api.resrobot.se/v2.1/departureBoard?id=740000002&format=json&accessId=";
const baseUrlArrivals =
  "https://api.resrobot.se/v2.1/arrivalBoard?id=740000002&format=json&accessId=";
const apiKey = "d0770baf-77eb-4f7d-940e-69631f28f2fc";
const products = "&products=";

const transportModes = [
  { mode: "Spårvagn", value: products + "64", fa: "&#xe5b4;" },
  { mode: "Buss", value: products + "128", fa: "&#xf207;" },
  { mode: "Tåg", value: products + "22", fa: "&#xf238;" },
  { mode: "Flyg/ExpressBuss", value: products + "8", fa: "&#xe58f;" },
];

select.addEventListener("change", (event) => {
  fetchDeparturesWithTravelMode(event.target.value);
  transportModes.forEach((mode) => {
    console.log(mode);
    console.log(event.target.value);
    if (event.target.value == mode.value) {
      console.log(mode.mode);
      console.log(event.target.value);
      icon.innerHTML = mode.fa;
    }
  });
  // check value of select, compare that to transportModes and update the value of icon  to the value of "fa".
});

const loadButtons = () => {
  transportModes.forEach((mode) => {
    const modeOption = document.createElement("option");
    modeOption.innerHTML = mode.mode;
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
    const informationDiv = document.createElement("div");
    const numberDiv = document.createElement("div");
    const wrapperDiv = document.createElement("div");
    const mobileMenu = generateMobileMenu();
    operatorDiv.classList.add("operator-div");
    timeDiv.classList.add("time-div");
    directionDiv.classList.add("direction-div");
    numberDiv.classList.add("number-div");
    informationDiv.classList.add("information-div");
    wrapperDiv.classList.add("information-wrapper-div");

    let number =
      departure.ProductAtStop.displayNumber == "."
        ? "-"
        : departure.ProductAtStop.displayNumber;
    let time = departure.time;
    let direction = departure.direction;
    let operator = departure.ProductAtStop.operator;
    numberDiv.innerText = number;
    operatorDiv.innerText = operator;
    timeDiv.innerText = time;
    directionDiv.innerText = direction;

    informationDiv.appendChild(timeDiv);
    informationDiv.appendChild(numberDiv);
    informationDiv.appendChild(directionDiv);
    informationDiv.appendChild(operatorDiv);
    wrapperDiv.appendChild(informationDiv);
    wrapperDiv.appendChild(mobileMenu);
    dataWrapper.appendChild(wrapperDiv);
  });
};

const generateMobileMenu = () => {
  const time = document.createElement("div");
  const operator = document.createElement("div");
  const direction = document.createElement("div");
  const number = document.createElement("div");
  const mobileMenu = document.createElement("div");

  time.innerText = "Tid";
  number.innerText = "Nummer";
  operator.innerText = "Operatör";
  direction.innerText = "Station";
  mobileMenu.classList.add("mobile-menu");

  mobileMenu.appendChild(time);
  mobileMenu.appendChild(number);
  mobileMenu.appendChild(direction);
  mobileMenu.appendChild(operator);
  return mobileMenu;
};

loadButtons();
fetchDepartures();
