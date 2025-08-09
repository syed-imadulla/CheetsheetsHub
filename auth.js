// Toggle Animation
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
  container.classList.add("right-panel-active");
});
signInButton.addEventListener('click', () => {
  container.classList.remove("right-panel-active");
});

// Confirmation Toast
const confirmCard = document.getElementById('confirmCard');
const confirmTitle = document.getElementById('confirmTitle');
const confirmSub = document.getElementById('confirmSub');
const confirmAvatar = document.getElementById('confirmAvatar');
document.getElementById('confirmClose').onclick = () => confirmCard.hidden = true;

function showConfirmation({name, email, picture}) {
  confirmTitle.textContent = name || "Signed in";
  confirmSub.textContent = email || "";
  if (picture) {
    confirmAvatar.src = picture;
    confirmAvatar.hidden = false;
  } else {
    confirmAvatar.hidden = true;
  }
  confirmCard.hidden = false;
}

// Form Handling
document.getElementById('signupForm').addEventListener('submit', e => {
  e.preventDefault();
  const pwd = e.target.password.value;
  const conf = e.target.confirm.value;
  if (pwd !== conf) {
    alert("Passwords do not match!");
    return;
  }
  showConfirmation({ name: e.target.name.value, email: e.target.email.value });
});

document.getElementById('loginForm').addEventListener('submit', e => {
  e.preventDefault();
  showConfirmation({ email: e.target.email.value });
});

// Google Sign-In
const CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

function parseJwt (token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

function handleCredentialResponse(response) {
  const payload = parseJwt(response.credential);
  if (payload) {
    showConfirmation({ name: payload.name, email: payload.email, picture: payload.picture });
  }
}

window.onload = function () {
  google.accounts.id.initialize({
    client_id: CLIENT_ID,
    callback: handleCredentialResponse
  });
  google.accounts.id.renderButton(
    document.getElementById("gSignIn"),
    { theme: "outline", size: "large", type: "icon" }
  );
  google.accounts.id.renderButton(
    document.getElementById("gSignUp"),
    { theme: "outline", size: "large", type: "icon" }
  );
};

// GitHub & LinkedIn mock sign-ins
document.getElementById('gitSignIn').addEventListener('click', e => {
  e.preventDefault();
  showConfirmation({ name: "GitHub User", email: "user@github.com" });
});

document.getElementById('liSignIn').addEventListener('click', e => {
  e.preventDefault();
  showConfirmation({ name: "LinkedIn User", email: "user@linkedin.com" });
});

function showConfirmCard() {
    const card = document.getElementById('confirmCard');
    card.style.display = 'flex';
    setTimeout(() => {
        card.style.display = 'none';
    }, 5000); // auto hide after 5s
}

function closeConfirmCard() {
    document.getElementById('confirmCard').style.display = 'none';
}

