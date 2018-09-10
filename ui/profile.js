const userData = JSON.parse(localStorage.getItem('user'));

if (!userData) {
  window.location.replace('../signin.html');
}

const container = document.getElementById('profile_name_container');
container.innerHTML += `
  <span>${userData.firstname} ${userData.lastname}</span>
  <a href="#">${userData.username}</a>
`;


/**
* Clears user data and jwt and redirects to homepage
* @returns {void}
*/
const logOut = () => {
  localStorage.removeItem('jwt');
  localStorage.removeItem('user');
  window.location.replace('../index.html');
};
