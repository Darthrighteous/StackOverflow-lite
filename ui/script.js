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
  console.log('not signedin');
  // user is not signed in
  // hide profile options
  document.getElementById('profileOptions').style.display = 'none';
} else {
  console.log('signedin');
  // hide auth options
  document.getElementById('authIn').style.display = 'none';
}
