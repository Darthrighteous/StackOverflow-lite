import {
  baseUrl,
  fetchAllQuestions,
} from './utils.js';

// get search string
const pageUrl = new URL(window.location.href);
const searchString = pageUrl.searchParams.get('search');
// fetch all questions
const searchUrl = `${baseUrl}/questions?sort=date&search=${searchString}`;
fetchAllQuestions(searchUrl);
