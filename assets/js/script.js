const el = (e) => document.querySelector(e),
  dataMode = el("[data-mode]"),
  imgMode = dataMode.querySelector("img"),
  htmlEl = el("html"),
  buttonBack = el(".section-info-country .button-back"),
  sectionCountries = el("section[data-section-countries]"),
  sectionInfo = el("section[data-section-info]"),
  elCountry = el("[data-template-country]"),
  elCountries = el(".countries .countries-grid"),
  linkNameCountry = (country) =>
    `https://restcountries.com/v2/name/${country}?fullText=true`,
  borderCountries = el(".section-info-country .caract-tag");

let codeArrayCountry = {};

if (window.localStorage.getItem("mode") === "dark") {
  htmlEl.classList.add("dark");
  addOrRemoveIcon();
}

dataMode.addEventListener("click", (ev) => {
  ev.preventDefault();
  htmlEl.classList.toggle("dark");
  addOrRemoveIcon();
});

function addOrRemoveIcon() {
  if (htmlEl.classList.contains("dark")) {
    imgMode.src = "assets/img/moon-solid.svg";
    window.localStorage.setItem("mode", "dark");
    buttonBack.querySelector("img").src = "./assets/img/arrow-left-solid.svg";
  } else {
    imgMode.src = "assets/img/moon-regular.svg";
    window.localStorage.setItem("mode", "light");
    buttonBack.querySelector("img").src =
      "./assets/img/arrow-left-solid-black.svg";
  }
}
//
let liCountries;
//FETCH API COUNTRIES

function fetchAPI(linkAPI) {
  fetch(linkAPI)
    .then((r) => r.json())
    .then((r) => {
      r.forEach((e) => {
        const elClone = elCountry.cloneNode(true);
        elClone.dataset.country = e.name;
        elClone.querySelector("[data-flag]").src = e.flag;
        elClone.querySelector("[data-flag]").alt = e.name;
        elClone.querySelector("[data-name]").innerText =
          e.name.charAt(0).toUpperCase() + e.name.substr(1);

        elClone.addEventListener("click", (ev) => {
          ev.preventDefault();
          selectedCountry(elClone.dataset.country);
        });

        elClone.querySelector(
          "[data-population]"
        ).innerHTML = `<span>Population: </span> ${e.population.toLocaleString(
          "en"
        )}`;
        elClone.querySelector(
          "[data-region]"
        ).innerHTML = `<span>Region: </span> ${e.region}`;
        elClone.querySelector(
          "[data-capital]"
        ).innerHTML = `<span>Capital: </span> ${e.capital}`;

        elClone.style.display = "block";
        elCountries.append(elClone);

        codeArrayCountry[e.alpha3Code] = e.name;
      });
    });
}

fetchAPI("https://restcountries.com/v2/all");

function selectedCountry(name) {
  fetch(linkNameCountry(name))
    .then((e) => e.json())
    .then((e) => {
      const infoFlag = el(".info-country .info-flag img");
      infoFlag.src = e[0].flag;
      infoFlag.alt = e[0].name;

      el(".section-info-country .info-caract [data-name-country]").innerText =
        e[0].name;

      const infoCountry = el(".section-info-country .caract-info");
      infoCountry.querySelector("[data-native-name]").innerText =
        e[0].nativeName;
      infoCountry.querySelector(
        "[data-population]"
      ).innerText = e[0].population.toLocaleString("en");
      infoCountry.querySelector("[data-region]").innerText = e[0].region;
      infoCountry.querySelector("[data-sub-region]").innerText = e[0].subregion;
      infoCountry.querySelector("[data-capital2]").innerText = e[0].capital;
      infoCountry.querySelector("[data-top-level-domain]").innerText =
        e[0].topLevelDomain;
      // -----------------------------------------------------------------------------
      let currencies = "";
      e[0].currencies.forEach((e) => {
        e.name
          ? (currencies = currencies + ", " + e.name + ` (${e.symbol})`)
          : "";
      });
      infoCountry.querySelector(
        "[data-currencies]"
      ).innerText = currencies.substr(2);
      // -------------------------------------------------------------------------------

      // -----------------------------------------------------------------------------
      let languages = "";
      e[0].languages.forEach((e) => {
        e.name ? (languages = languages + ", " + e.name) : "";
      });
      infoCountry.querySelector(
        "[data-languages]"
      ).innerText = languages.substr(2);
      // -----------------------------------------------------------------------------

      borderCountries.innerHTML = "";
      borderCountries.innerHTML = "<span>Border Countries: </span>";

      e[0].borders.forEach((codePais) => {
        const elCodePais = document.createElement("button");

        elCodePais.innerText = codeArrayCountry[codePais];

        borderCountries.append(elCodePais);
      });

      if (e[0].borders < 1) {
        borderCountries.innerHTML =
          "<span style='margin-top:0; margin-right:5px;'>Border Countries: </span> Não possui";
      }

      addEventButton();
    });

  sectionCountries.style.display = "none";
  sectionInfo.style.display = "block";
  window.scrollTo(0, 0);
}

buttonBack.addEventListener("click", () => {
  sectionCountries.style.display = "block";
  sectionInfo.style.display = "none";
});

function addEventButton() {
  borderCountries.querySelectorAll("button").forEach((e) => {
    e.addEventListener("click", (ev) => {
      ev.preventDefault();
      selectedCountry(ev.target.innerText);
    });
  });
}

const optionSelect = el(".section-contries select");
const inputSearch = el(".section-contries input[type='text']");

optionSelect.addEventListener("change", regionFetchApi);
inputSearch.addEventListener("keyup", paisFetchApi);

function regionFetchApi() {
  elCountries.innerHTML = "";
  inputSearch.value = "";
  if (this.value === "all") {
    fetchAPI(`https://restcountries.com/v2/all`);
  } else {
    fetchAPI(`https://restcountries.com/v2/region/${this.value}`);
  }
}

function paisFetchApi(e) {
  if (e.key === "Enter") {
    elCountries.innerHTML = "";
    optionSelect.value = "all";
    if (this.value === "") {
      fetchAPI(`https://restcountries.com/v2/all`);
    } else {
      fetchAPI(`https://restcountries.com/v2/name/${this.value}`);
    }
  }
}
