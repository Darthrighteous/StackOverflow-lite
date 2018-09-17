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
