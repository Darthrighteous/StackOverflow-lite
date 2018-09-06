/**
* Opens all dropdowns
* @returns {void}
*/
const dropdown = () => {
  const dropdowns = document.getElementsByClassName('dropdown_content');
  for (let i = 0; i < dropdowns.length; i += 1) {
    const openDropdown = dropdowns[i];
    openDropdown.classList.toggle('show');
  }
};

const voteCells = document.getElementsByClassName('vote_cell');
for (let i = 0; i < voteCells.length; i += 1) {
  const upBtns = voteCells[i].getElementsByClassName('up_vote');
  const currentUpButton = upBtns[0];
  currentUpButton.addEventListener('click', () => {
    currentUpButton.classList.toggle('activeup');
  });

  const downBtns = voteCells[i].getElementsByClassName('down_vote');
  const currentDownButton = downBtns[0];
  currentDownButton.addEventListener('click', () => {
    currentDownButton.classList.toggle('activedown');
  });
}

window.addEventListener('click', (event) => {
  if (!document.getElementsByClassName('dropdown')[0].contains(event.target)) {
    const dropdowns = document.getElementsByClassName('dropdown_content');
    for (let i = 0; i < dropdowns.length; i += 1) {
      const openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
});

if (document.title === 'Profile Page') {
  document.getElementById('authOptions').style.display = 'none';
}

if (document.title === 'SignIn Page') {
  document.getElementById('loginbutton').style.display = 'none';
}

if (document.title === 'Signup Page') {
  document.getElementById('signupbutton').style.display = 'none';
}
