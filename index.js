const select = document.querySelector("#currencies-options");
const formElm = document.querySelector("#form-input");
const input = document.querySelector("#input-amount");
const resultInfo = document.querySelector("#currency-value");
const loader = document.querySelector("#loader");

const errorInfo = document.querySelector("#error-info");

const getCurrency = async () => {
  try {
    loader.classList.remove("hidden");
    const response = await axios.get(
      `http://api.nbp.pl/api/exchangerates/rates/c/${select.value}/?format=json`
    );
    const {
      data: { rates },
    } = response;
    const { ask } = rates[0];
    return ask;
  } catch (error) {
    errorInfo.textContent = "Błąd serwera. Spróbuj ponownie później";
    console.error(error);
  } finally {
    loader.classList.add("hidden");
  }
};

const multiplyValue = (currencyValue) => {
  if (errorInfo.textContent === "") {
    const result = (input.value * currencyValue).toFixed(3);
    resultInfo.textContent = `${result} PLN`;
  }
};

const main = async () => {
  const currencyActualValue = await getCurrency();
  if (currencyActualValue && typeof currencyActualValue === "number") {
    multiplyValue(currencyActualValue);
  } else {
    resultInfo.textContent = "0 PLN";
  }
};

formElm.addEventListener("submit", (event) => {
  if (input.value && select.value !== "choose") {
    if (input.value > 0) {
      errorInfo.textContent = "";
      main();
      event.preventDefault();
    } else {
      errorInfo.textContent = "Kwota powinna być większa niż 0!";
      event.preventDefault();
    }
  } else {
    errorInfo.textContent = "Podaj wartość i wybierz walutę!";
    event.preventDefault();
  }
});
