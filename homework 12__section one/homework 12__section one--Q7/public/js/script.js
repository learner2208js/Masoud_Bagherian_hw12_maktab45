let toastShow = false;

const form = {
  body: document.getElementById('form'),
  submitBtn: document.getElementById('form-btn'),
  username: document.getElementById('username'),
  password: document.getElementById('password'),
  usernameAlert: document.getElementById('username-alert'),
  passwordAlert: document.getElementById('password-alert'),
};

const toast = document.getElementById('toast');

function submitForm(e) {
  e.preventDefault();
  validateForm();
}
function validateForm() {
  const username = form.username.value.trim();
  const password = form.password.value.trim();
  if (username === '') {
    showAlert(form.usernameAlert, 'نام کاربری الزامی است');
  }
  if (password === '') {
    showAlert(form.passwordAlert, 'رمز عبور الزامی است');
  }
  if (username !== '' && password !== '') {
    const userData = { username: username, password: password };
    ajax({ url: '/check-user', method: 'post', data: userData });
  }
}
function ajax(options) {
  const { url, method, data } = options;
  const http = new XMLHttpRequest();
  function getResponse() {
    if (this.readyState === 4) {
      const response = JSON.parse(this.response);
      if (!toastShow) {
        toastShow = true;
        showToast(response);
      }
    }
  }
  http.open(method, url);
  http.setRequestHeader('content-type', 'application/json');
  http.send(JSON.stringify(data));
  http.addEventListener('readystatechange', getResponse);
}

function showToast(options) {
  const { message, color } = options;
  toast.classList.add('active');
  toast.style.backgroundColor = color;
  toast.querySelector('.toast__message').textContent = message;

  setTimeout(() => {
    toast.classList.remove('active');
    toastShow = false;
  }, 3000);
}
function setAelrtMessage(alertContainer, message) {
  const alert = alertContainer.children[0];
  alert.textContent = message;
}
function slideDown(el) {
  const elBody = el.children[0];
  const height = elBody.offsetHeight;
  el.style.height = `${height}px`;
}
function slideUp(el) {
  el.style.height = '0';
}
function showAlert(alertContainer, message) {
  setAelrtMessage(alertContainer, message);
  slideDown(alertContainer);
}
function checkAlert(e) {
  const input = e.target;
  const alertContainer = input.parentElement.nextElementSibling;
  let alertMessage;
  if (input.value.trim() !== '') {
    slideUp(alertContainer);
  } else {
    if (input === form.username) {
      message = 'نام کاربری الزامی است';
    } else if (input === form.password) {
      message = 'رمز عبور الزامی است';
    }
    showAlert(alertContainer, message);
  }
}

form.submitBtn.addEventListener('click', submitForm);
form.body.addEventListener('input', checkAlert);
