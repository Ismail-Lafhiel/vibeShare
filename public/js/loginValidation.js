document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  const showMessage = (input, message, type) => {
    removeMessage(input, type);

    const p = document.createElement("p");
    p.classList.add(
      "mt-2",
      "text-xs",
      type === "error" ? "text-red-600" : "text-green-600",
      type === "error" ? "dark:text-red-400" : "dark:text-green-400"
    );
    p.innerHTML = `<span class="font-medium">${
      type === "error" ? "Oh, snapp!" : "Well done!"
    }</span> ${message}`;

    p.id = type === "error" ? "outlined_error_help" : "outlined_success_help";
    input.setAttribute(
      "aria-describedby",
      type === "error" ? "outlined_error_help" : "outlined_success_help"
    );

    const container = input.closest(".input-container");
    if (container) {
      container.appendChild(p);
    }
  };

  const removeMessage = (input, type) => {
    const messageId =
      type === "error" ? "outlined_error_help" : "outlined_success_help";
    const container = input.closest(".input-container");
    if (container) {
      const existingMessage = container.querySelector(`#${messageId}`);
      if (existingMessage) {
        existingMessage.remove();
      }
    }
  };

  const validateLogin = (input) => {
    const id = input.id;

    switch (id) {
      case "email":
        return validateEmail(input);
      case "password":
        return validatePassword(input);
      default:
        return false;
    }
  };

  const validateEmail = (input) => {
    const value = input.value.trim();
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

    removeMessage(input, "error");
    removeMessage(input, "success");

    if (!emailPattern.test(value)) {
      showMessage(input, "Please enter a valid email address.", "error");
      input.classList.add("border-red-600", "dark:border-red-500");
      input.classList.remove("border-green-600", "dark:border-green-500");
      return false;
    } else {
      showMessage(input, "Email is valid.", "success");
      input.classList.add("border-green-600", "dark:border-green-500");
      input.classList.remove("border-red-600", "dark:border-red-500");
      return true;
    }
  };

  const validatePassword = (input) => {
    const value = input.value.trim();
    let message = "";
    let isValid = true;

    removeMessage(input, "error");
    removeMessage(input, "success");

    if (value.length === 0) {
      showMessage(input, "Password is required.", "error");
      input.classList.add("border-red-600", "dark:border-red-500");
      input.classList.remove("border-green-600", "dark:border-green-500");
      return false;
    }

    if (value.length < 8) {
      message += "Password must be at least 8 characters long. ";
      isValid = false;
    }
    if (!/[A-Z]/.test(value)) {
      message += "Must contain at least one uppercase letter. ";
      isValid = false;
    }
    if (!/[a-z]/.test(value)) {
      message += "Must contain at least one lowercase letter. ";
      isValid = false;
    }
    if (!/\d/.test(value)) {
      message += "Must contain at least one number. ";
      isValid = false;
    }
    if (!/[!@$!%*?&]/.test(value)) {
      message += "Must contain at least one special character. ";
      isValid = false;
    }

    if (isValid) {
      showMessage(input, "Password is strong.", "success");
      input.classList.add("border-green-600", "dark:border-green-500");
      input.classList.remove("border-red-600", "dark:border-red-500");
      return true;
    } else {
      showMessage(input, message, "error");
      input.classList.add("border-red-600", "dark:border-red-500");
      input.classList.remove("border-green-600", "dark:border-green-500");
      return false;
    }
  };

  form.addEventListener("input", (event) => {
    if (
      event.target.matches(
        "input[type='text'], input[type='email'], input[type='password']"
      )
    ) {
      validateLogin(event.target);
    }
  });

  form.addEventListener("submit", (event) => {
    console.log("Form submission triggered");

    const inputs = form.querySelectorAll(
      "input[type='text'], input[type='email'], input[type='password']"
    );
    let formIsValid = true;

    inputs.forEach((input) => {
      const isValid = validateLogin(input);
      console.log(`Validating ${input.id}: ${isValid}`);

      if (!isValid) {
        formIsValid = false;
      }
    });

    if (!formIsValid) {
      console.log("Form is invalid, preventing submission");
      event.preventDefault();
    }
  });
});