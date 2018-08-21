var dropdown = () => {
  var dropdowns = document.getElementsByClassName('dropdown_content')
  for (var i = 0; i < dropdowns.length; i++) {
    var openDropdown = dropdowns[i]
    openDropdown.classList.toggle('show')
  }
}

window.addEventListener('click', (event) => {
  if (!document.getElementsByClassName('dropdown')[0].contains(event.target)) {
    var dropdowns = document.getElementsByClassName('dropdown_content')
    var i
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i]
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show')
      }
    }
  }
})

if (document.title === 'Profile Page') {
  document.getElementById('authOptions').style.display = 'none'
}
