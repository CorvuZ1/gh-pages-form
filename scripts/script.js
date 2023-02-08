const form = document.querySelector(".form");
const showPassword = form.querySelector(".form__show-password");
const submitButton = form.querySelector(".form__button");

const fieldsData = {
  login: {
    error: "",
    DOM: form.querySelector("[name='login']"),
    get value() {
      return this.DOM.value;
    },
  },
  controlString: {
    error: "",
    DOM: form.querySelector("[name='control_string']"),
    get value() {
      return this.DOM.value;
    },
  },
  password: {
    error: "",
    DOM: form.querySelector("[name='password']"),
    get value() {
      return this.DOM.value;
    },
  },
  passwordConfirm: {
    error: "",
    DOM: form.querySelector("[name='password_confirm']"),
    get value() {
      return this.DOM.value;
    },
  },
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const isValid = validateFields();

  if (isValid) {
    sendForm().then((status) => {
      const notice = document.createElement("div");
      notice.className = "notice";
      document.body.appendChild(notice);
      setTimeout(() => {
        notice.remove();
      }, 4000);

      if (status) {
        notice.textContent = "Форма отправлена";
      } else {
        notice.textContent = "Что-то пошло не так";
      }
    });
  }

  renderErrors();
});

async function sendForm() {
  const { method, action } = form;

  try {
    const req = await fetch(action, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login: fieldsData.login.value,
        controlString: fieldsData.controlString.value,
        password: fieldsData.password.value,
      }),
    });

    if (req.ok) {
      return true;
    } else {
      throw Error();
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

function validateFields() {
  clearErrors();

  const { login, controlString, password, passwordConfirm } = fieldsData;
  let isValid = true;

  if (login.value.trim() === "") {
    login.error = "Обязательное поле";
    isValid = false;
  }

  if (controlString.value.trim() === "") {
    controlString.error = "Обязательное поле";
    isValid = false;
  } else if (controlString.value !== "test") {
    controlString.error = "Неверное контрольное слово";
    isValid = false;
  }

  if (password.value.trim() === "") {
    password.error = "Обязательное поле";
    isValid = false;
  } else if (password.value.length < 6) {
    password.error = "Пароль должен быть не менее 6 символов";
    isValid = false;
  }

  if (passwordConfirm.value.trim() === "") {
    passwordConfirm.error = "Обязательное поле";
    isValid = false;
  } else if (passwordConfirm.value !== password.value) {
    passwordConfirm.error = "Пароли не совпадают";
    isValid = false;
  }

  return isValid;
}

function clearErrors() {
  for (const field in fieldsData) {
    fieldsData[field].error = "";
  }
}

function renderErrors() {
  for (const field in fieldsData) {
    const errorNode = fieldsData[field].DOM.parentNode.lastElementChild;

    if (fieldsData[field].error) {
      fieldsData[field].DOM.classList.add("form__input--error");
      errorNode.textContent = fieldsData[field].error;
    } else {
      errorNode.textContent = "";
      fieldsData[field].DOM.classList.remove("form__input--error");
    }
  }
}

showPassword.addEventListener("click", () => {
  const activeClass = "form__show-password--active";
  showPassword.classList.toggle(activeClass);

  const { password, passwordConfirm } = fieldsData;

  if (showPassword.classList.contains(activeClass)) {
    password.DOM.type = "text";
    passwordConfirm.DOM.type = "text";
  } else {
    password.DOM.type = "password";
    passwordConfirm.DOM.type = "password";
  }
});
