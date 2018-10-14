import {
  baseUrl,
  readResponseAsJSON,
} from './utils.js';

/**
* Call back function that retracts dropdown on click
* @param {object} event - the event from which call back was made
* @returns {void}
*/
const dropdownToggle = (event) => {
  Array.from(document.getElementsByClassName('dropdown')).forEach((dropdown, index) => {
    const content = document.getElementsByClassName('dropdown_content')[index];
    if (document.getElementsByClassName('dropdown')[index].contains(event.target)) {
      content.classList.toggle('show');
    } else {
      content.classList.remove('show');
    }
  });
};
window.addEventListener('click', dropdownToggle);

// Check if user is signed in and display appropriate nav options
if (!localStorage.user) {
  // user is not signed in
  console.log('not signedin');
  document.getElementById('profileOptions').style.display = 'none';
} else {
  // user signed in
  console.log('signedin');
  document.getElementById('authIn').style.display = 'none';

  // check that user exists
  const { username } = JSON.parse(localStorage.user);
  const url = `${baseUrl}/users/${username}`;
  fetch(url)
    .then(readResponseAsJSON)
    .then((response) => {
      if (response.status === 'failure') {
        // user not found
        localStorage.removeItem('jwt');
        localStorage.removeItem('user');
        window.location.replace('../signin.html');
      }
    })
    .catch((error) => {
      console.log(error);
    });
}
