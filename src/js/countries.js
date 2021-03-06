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
  nameCountry = inputEL.value;

  if (nameCountry.trim() === '') {
    ulEl.innerHTML = '';
    divEl.innerHTML = '';
    return;
  }

  ulEl.innerHTML = '';
  divEl.innerHTML = '';
  API.fetchCountries(nameCountry).then(renderCountryCard).catch(onFetchError);
}

function renderCountryCard(countries) {
  if (countries.length === 1) {
    divEl.innerHTML = countryCard(countries[0]);
  } else if (countries.length >= 2 && countries.length <= 10) {
    ulEl.innerHTML = renderCountryList(countries);
  } else if (countries.length > 10) {
    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
  }
}

function onFetchError() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}
