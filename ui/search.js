import {
  baseUrl,
  fetchAllQuestions,
} from './utils.js';

// get search string
const pageUrl = new URL(window.location.href);
const searchString = pageUrl.searchParams.get('search');

document.getElementById('search_bar').value = searchString;

// fetch all questions
const searchUrl = `${baseUrl}/questions?sort=date&search=${searchString}`;
fetchAllQuestions(searchUrl);
