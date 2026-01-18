document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("adminLoginForm");
  const usernameInput = document.getElementById("adminUsername");
  const passwordInput = document.getElementById("adminPassword");
  const errorBox = document.getElementById("adminError");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (username === "admin" && password === "admin123") {
      window.location.href = "admin-dashboard.html";
    } else {
      errorBox.style.display = "block";
    }
  });
});
