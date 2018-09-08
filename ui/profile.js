const container = document.getElementById('profile_name_container');

const userData = JSON.parse(localStorage.getItem('user'));

container.innerHTML += `
  <span>${userData.firstname} ${userData.lastname}</span>
  <a href="#">${userData.username}</a>
`;
