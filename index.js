const select = document.querySelector("#currencies-options");
const button = document.querySelector("#getCurrencies-btn");
const input = document.querySelector("#input-amount");
const resultInfo = document.querySelector("#currency-value");
const loader = document.querySelector("#loader");

let choosenCurrency = "";

const getCurrency = async (code) => {
  try {
    loader.classList.remove("hidden");
    const response = await axios.get(
      `http://api.nbp.pl/api/exchangerates/rates/c/${code}/?format=json`
    );
    const { data } = response;
    const { rates } = data;
    const { ask } = rates[0];
    return ask;
  } catch (error) {
    console.error(error);
  } finally {
    setTimeout(() => {
      loader.classList.add("hidden");
    }, 400);
  }
};

const multiplyValue = (currencyValue) => {
  const result = input.value * currencyValue;
  resultInfo.textContent = `${result} PLN`;
};

const main = async () => {
  const currencyActualValue = await getCurrency(choosenCurrency);
  multiplyValue(currencyActualValue);
};

select.addEventListener("change", (event) => {
  if (
    event.target.value === "eur" ||
    event.target.value === "usd" ||
    event.target.value === "chf"
  ) {
    choosenCurrency = event.target.value;
  }
});

button.addEventListener("click", () => {
  if (input.value && choosenCurrency !== "" && choosenCurrency !== NaN) {
    main();
  } else {
    alert("Podaj wartość i wybierz walutę");
  }
});
