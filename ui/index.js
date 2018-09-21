import {
  baseUrl,
  fetchAllQuestions,
  dropDownListenerInit,
} from './utils.js';

// fetch all questions
const getAllUrl = `${baseUrl}/questions?sort=date`;
fetchAllQuestions(getAllUrl);

const indexSortUrl = `${baseUrl}/questions?sort`;
// index sort drop down setup
dropDownListenerInit('indexDropdown', indexSortUrl);

/**
*
*
*/
const search = () => {
  const searchString = document.getElementById('search_bar').value;
  console.log(searchString);
};

const form = document.getElementById('search_form');
console.log(form);
form.addEventListener('submit', search);
