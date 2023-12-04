// implement way to get departures and arrivals???
const dataWrapper = document.querySelector(".data-wrapper");
const select = document.getElementById("travel-options");
const icon = document.querySelector(".select-icon");
const optionButtons = document.querySelectorAll(".select-button");
icon.innerHTML = "&#xf141;";

// baseURLs for the requests, as well as apikey and other variables to build the querystring
let baseUrl =
  "https://api.resrobot.se/v2.1/departureBoard?id=740000002&format=json&accessId=";
const apiKey = "d0770baf-77eb-4f7d-940e-69631f28f2fc";
const products = "&products=";

// array that contains the transport modes as there was no way to fetch these from the API itself
const transportModes = [
  { mode: "Spårvagn", value: products + "64", fa: "&#xe5b4;" },
  { mode: "Buss", value: products + "128", fa: "&#xf207;" },
  { mode: "Tåg", value: products + "22", fa: "&#xf238;" },
  { mode: "Flyg/ExpressBuss", value: products + "8", fa: "&#xe58f;" },
];

//adding class to the default selected button on load (departures)
optionButtons[0].classList.add("selected");

//add event listeners to the buttons that when clicked fetches the arrivals or departures by updating the baseUrl
//it will also change the data that is being displayed by taking the value from the select field.
optionButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.target.disabled = true;
    optionButtons.forEach((btn) => {
      btn.classList.remove("selected");
    });
    event.target.classList.add("selected");
    let departOrArrive = event.target.value;
    baseUrl = `https://api.resrobot.se/v2.1/${departOrArrive}?id=740000002&format=json&accessId=`;
    if (select.value != "nothing") {
      fetchWithTravelMode(select.value);
      event.target.disabled = false;
    } else {
      fetchData();
      event.target.disabled = false;
    }
  });
});

// call the API with the specific travelmodes the user selects,
// also update the fontawesome icon via JS
select.addEventListener("change", (event) => {
  fetchWithTravelMode(event.target.value);

  select.classList.add("select-selected");
  transportModes.forEach((transportMode) => {
    if (event.target.value == transportMode.value) {
      icon.innerHTML = transportMode.fa;
    }
  });
});

//generate the select menus options
const loadSelect = () => {
  transportModes.forEach((transportMode) => {
    const modeOption = document.createElement("option");
    modeOption.innerHTML = transportMode.mode;
    modeOption.value = transportMode.value;
    select.appendChild(modeOption);
  });
};

// function to create elements with a specific class
const createElementWithClass = (element, className) => {
  const div = document.createElement(element);
  div.classList.add(className);
  return div;
};
// generate the mobile menu as it is different to desktop
const createMobileMenu = () => {
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

// function to display the data, called in the initial data display call (all data)
// and in the function when a user updates the select.

const displayData = (departures) => {
  dataWrapper.innerHTML = "";
  departures.forEach((departure) => {
    const timeDiv = createElementWithClass("div", "time-div");
    const operatorDiv = createElementWithClass("div", "operator-div");
    const directionDiv = createElementWithClass("div", "direction-div");
    const informationDiv = createElementWithClass("div", "information-div");
    const numberDiv = createElementWithClass("div", "number-div");
    const wrapperDiv = createElementWithClass("div", "information-wrapper-div");
    const mobileMenu = createMobileMenu();
    const number =
      departure.ProductAtStop.displayNumber == "."
        ? "-"
        : departure.ProductAtStop.displayNumber;
    let time = departure.time;
    let direction = "";
    if (baseUrl.includes("departureBoard")) {
      direction = departure.direction;
    } else {
      direction = departure.origin;
    }
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

//initial data call that includes all transport modes from the station

const fetchData = async () => {
  try {
    const response = await fetch(baseUrl + apiKey);
    const data = await response.json();
    if (baseUrl.includes("departureBoard")) {
      displayData(data.Departure);
    } else {
      displayData(data.Arrival);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

//data call that only includes the specific transport mode that the user has chosen.

const fetchWithTravelMode = async (transportMode) => {
  try {
    const response = await fetch(baseUrl + apiKey + transportMode);
    const data = await response.json();
    if (baseUrl.includes("departureBoard")) {
      displayData(data.Departure);
    } else {
      displayData(data.Arrival);
    }
  } catch (error) {
    console.error(
      "Error fetching data for transport mode:",
      transportMode,
      error
    );
  }
};

loadSelect();
fetchData();
