const bar = document.getElementById('bar')
const close = document.getElementById('close')
const nav = document.getElementById('navbar')

if (bar) {
  bar.addEventListener('click', () => {
    nav.classList.add('active')
  })
 
 if (close) {
   close.addEventListener('click', () => {
     nav.classList.remove('active')
   })
 }
}


// For Cart Price Update

$(document).ready(function(){
  update_amounts();
  $('.qty, .price').on('keyup keypress blur change', function(e) {
    update_amounts();
  })
})

//Add this script tag to your HTML, or include it in your existing JavaScript file 


document.addEventListener('DOMContentLoaded', function () {
  const userProfile = document.getElementById('userProfile');
  const dropdown = document.getElementById('dropdown');

  userProfile.addEventListener('click', function (event) {
      event.stopPropagation(); // Prevent the click event from bubbling up to document

      userProfile.classList.toggle('clicked');
      dropdown.style.display = userProfile.classList.contains('clicked') ? 'block' : 'none';
  });

  // Close the dropdown if user clicks outside of it
  document.addEventListener('click', function (event) {
      if (!userProfile.contains(event.target)) {
          userProfile.classList.remove('clicked');
          dropdown.style.display = 'none';
      }
  });
});