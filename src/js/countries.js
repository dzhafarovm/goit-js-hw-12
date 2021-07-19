import debounce from 'lodash/debounce';
import Notiflix from 'notiflix';

import API from './fetchCountries';
import countryCard from '../hbs/countryCard.hbs';
import renderCountryList from '../hbs/renderCountryList.hbs';

const inputEL = document.querySelector('#search-box');
const ulEl = document.querySelector('.country-list');
const divEl = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;
let nameCountry = '';

inputEL.addEventListener('input', debounce(onChange, DEBOUNCE_DELAY));

function onChange() {
  ulEl.innerHTML = '';
  divEl.innerHTML = '';
  nameCountry = inputEL.value;

  API.fetchCountries(nameCountry)
    .then(renderCountryCard)
    .catch(error => console.log(error));
}

function renderCountryCard(countries) {
  if (countries.length === 1) {
    divEl.insertAdjacentHTML('beforeend', countryCard(countries[0]));
  } else if (countries.length > 10) {
    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
  } else if (countries.status === 404) {
    Notiflix.Notify.failure('Oops, there is no country with that name');
  } else if (countries.length >= 2 && countries.length <= 10) {
    ulEl.insertAdjacentHTML('afterbegin', renderCountryList(countries));
  }
}
