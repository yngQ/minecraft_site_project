(function () {
  var current = document.body.getAttribute("data-page");
  if (!current) {
    return;
  }
  var navItems = document.querySelectorAll(".navbar-nav li");
  for (var i = 0; i < navItems.length; i += 1) {
    navItems[i].classList.remove("active");
  }
  var activeLink = document.querySelector('.navbar-nav a[data-page="' + current + '"]');
  if (activeLink && activeLink.parentElement) {
    activeLink.parentElement.classList.add("active");
  }
})();
