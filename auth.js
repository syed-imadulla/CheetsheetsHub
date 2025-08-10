// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAfnHsPQc5yeCWtMlznu53JfLUrZipbZKQ",
  authDomain: "cheatsheet-hub.firebaseapp.com",
  projectId: "cheatsheet-hub",
  storageBucket: "cheatsheet-hub.appspot.com",
  messagingSenderId: "859408977482",
  appId: "1:859408977482:web:c5d13ba9cfffdff581e0b3"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// DOM Elements
const container = document.getElementById('container');
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const confirmCard = document.getElementById('confirmCard');
const confirmTitle = document.getElementById('confirmTitle');
const confirmSub = document.getElementById('confirmSub');
const confirmAvatar = document.getElementById('confirmAvatar');
const confirmClose = document.getElementById('confirmClose');
const resetModal = document.getElementById('resetModal');
const closeModal = document.getElementById('closeModal');
const forgotPassword = document.getElementById('forgotPassword');
const emailTab = document.getElementById('emailTab');
const phoneTab = document.getElementById('phoneTab');
const emailResetForm = document.getElementById('emailResetForm');
const phoneResetForm = document.getElementById('phoneResetForm');
const sendEmailReset = document.getElementById('sendEmailReset');
const resetEmail = document.getElementById('resetEmail');
const phoneNumber = document.getElementById('phoneNumber');
const sendOTP = document.getElementById('sendOTP');
const resendOTP = document.getElementById('resendOTP');
const resendCountdown = document.getElementById('resendCountdown');
const otpCode = document.getElementById('otpCode');
const verifyOTP = document.getElementById('verifyOTP');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const gSignIn = document.getElementById('gSignIn');
const gSignUp = document.getElementById('gSignUp');
const githubSignIn = document.getElementById('githubSignIn');
const githubSignUp = document.getElementById('githubSignUp');

// Panel Animation
signUpButton.addEventListener('click', () => {
  container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
  container.classList.remove("right-panel-active");
});

// Confirmation Toast
function showConfirmation({ name, email, picture }) {
  confirmTitle.textContent = name || "Signed in successfully";
  confirmSub.textContent = email || "Welcome to Cheatsheet Hub!";

  if (picture) {
    confirmAvatar.src = picture;
    confirmAvatar.hidden = false;
  } else {
    confirmAvatar.src = "https://via.placeholder.com/48";
    confirmAvatar.hidden = false;
  }

  confirmCard.style.display = 'flex';
  setTimeout(() => {
    confirmCard.style.display = 'none';
  }, 5000);
}

confirmClose.addEventListener('click', () => {
  confirmCard.style.display = 'none';
});

// Form Validation
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = e.target.name.value;
  const email = e.target.email.value;
  const password = e.target.password.value;
  const confirm = e.target.confirm.value;

  if (password !== confirm) {
    alert("Passwords don't match!");
    return;
  }

  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    await userCredential.user.updateProfile({ displayName: name });
    showConfirmation({ name, email });
    window.location.href = "index.html";
  } catch (error) {
    alert(error.message);
  }
});

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = e.target.email.value;
  const password = e.target.password.value;

  try {
    await auth.signInWithEmailAndPassword(email, password);
    showConfirmation({ email });
    window.location.href = "index.html";
  } catch (error) {
    alert(error.message);
  }
});

// Social Logins
function handleSocialLogin(provider) {
  auth.signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      showConfirmation({
        name: user.displayName,
        email: user.email,
        picture: user.photoURL
      });
      window.location.href = "index.html";
    })
    .catch((error) => {
      alert(error.message);
    });
}

gSignIn.addEventListener('click', () => handleSocialLogin(new firebase.auth.GoogleAuthProvider()));
gSignUp.addEventListener('click', () => handleSocialLogin(new firebase.auth.GoogleAuthProvider()));
githubSignIn.addEventListener('click', () => handleSocialLogin(new firebase.auth.GithubAuthProvider()));
githubSignUp.addEventListener('click', () => handleSocialLogin(new firebase.auth.GithubAuthProvider()));

// Forgot Password Modal
forgotPassword.addEventListener('click', (e) => {
  e.preventDefault();
  resetModal.style.display = 'flex';
});

closeModal.addEventListener('click', () => {
  resetModal.style.display = 'none';
});

// Tab Switching
emailTab.addEventListener('click', () => {
  emailTab.classList.add('active');
  phoneTab.classList.remove('active');
  emailResetForm.style.display = 'block';
  phoneResetForm.style.display = 'none';
});

phoneTab.addEventListener('click', () => {
  phoneTab.classList.add('active');
  emailTab.classList.remove('active');
  emailResetForm.style.display = 'none';
  phoneResetForm.style.display = 'block';
});

// Email Password Reset
sendEmailReset.addEventListener('click', async () => {
  const email = resetEmail.value;

  if (!email) {
    alert("Please enter your email");
    return;
  }

  try {
    await auth.sendPasswordResetEmail(email);
    showConfirmation({ email, name: "Reset email sent" });
    resetModal.style.display = 'none';
  } catch (error) {
    alert(error.message);
  }
});

// Phone OTP Verification
let confirmationResult;
let resendTimer;
let countdown = 30;

phoneNumber.addEventListener('input', (e) => {
  // Auto-add +91 if missing for Indian numbers
  if (!e.target.value.startsWith('+') && e.target.value.length > 0) {
    e.target.value = '+91' + e.target.value;
  }
});

otpCode.addEventListener('input', (e) => {
  verifyOTP.disabled = e.target.value.length !== 6;
});

sendOTP.addEventListener('click', async () => {
  const phone = phoneNumber.value;

  if (!phone) {
    alert("Please enter your phone number");
    return;
  }

  try {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      size: 'invisible'
    });

    confirmationResult = await auth.signInWithPhoneNumber(phone, window.recaptchaVerifier);

    otpCode.style.display = 'block';
    verifyOTP.style.display = 'block';
    sendOTP.style.display = 'none';
    startResendTimer();

    alert("OTP sent to your phone");
  } catch (error) {
    alert(error.message);
  }
});

verifyOTP.addEventListener('click', async () => {
  const code = otpCode.value;

  try {
    await confirmationResult.confirm(code);
    showConfirmation({ name: "Phone verified" });
    resetModal.style.display = 'none';
  } catch (error) {
    alert("Invalid OTP code");
  }
});

resendOTP.addEventListener('click', async () => {
  const phone = phoneNumber.value;

  try {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      size: 'invisible'
    });

    confirmationResult = await auth.signInWithPhoneNumber(phone, window.recaptchaVerifier);
    startResendTimer();
    alert("OTP resent to your phone");
  } catch (error) {
    alert(error.message);
  }
});

function startResendTimer() {
  resendOTP.disabled = true;
  countdown = 30;
  updateCountdown();

  resendTimer = setInterval(() => {
    countdown--;
    updateCountdown();

    if (countdown <= 0) {
      clearInterval(resendTimer);
      resendOTP.disabled = false;
      resendCountdown.textContent = '';
    }
  }, 1000);
}

function updateCountdown() {
  resendCountdown.textContent = `(${countdown}s)`;
}