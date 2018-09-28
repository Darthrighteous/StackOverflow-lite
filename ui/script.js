import {
  baseUrl,
  readResponseAsJSON,
} from './utils.js';

const dropdowns = document.getElementsByClassName('dropdown_content');
/**
* Opens all dropdowns
* @returns {void}
*/
const dropdownOpen = () => {
  for (let i = 0; i < dropdowns.length; i += 1) {
    const openDropdown = dropdowns[i];
    openDropdown.classList.toggle('show');
  }
};

if ((document.getElementsByClassName('dropdown')).length > 0) {
  /**
  * Call back function that retracts dropdown on click
  * @param {object} event - the event from which call back was made
  * @returns {void}
  */
  const dropdownRetract = (event) => {
    if (!document.getElementsByClassName('dropdown')[0].contains(event.target)) {
      for (let i = 0; i < dropdowns.length; i += 1) {
        const openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  };

  window.addEventListener('click', dropdownRetract);
}

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
