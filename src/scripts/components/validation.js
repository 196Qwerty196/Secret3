//показ ошибки ввода
export function showInputError(formElement, inputElement, errorMessage, settings) {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  if (errorElement) {
    inputElement.classList.add(settings.inputErrorClass);
    errorElement.textContent = errorMessage;
    errorElement.classList.add(settings.errorClass);
  }
}

//скрытие ошибки ввода
export function hideInputError(inputElement, settings) {
  const errorElement = inputElement.form.querySelector(`#${inputElement.id}-error`);
  if (errorElement) {
    inputElement.classList.remove(settings.inputErrorClass);
    errorElement.textContent = '';
    errorElement.classList.remove(settings.errorClass);
  }
}

//проверка валидности поля
export function checkInputValidity(formElement, inputElement, settings) {
  let errorMessage = '';

  if (!inputElement.validity.valid) {
    errorMessage = inputElement.validationMessage;
  } else if (
    (inputElement.classList.contains('popup__input_type_name') ||
     inputElement.classList.contains('popup__input_type_card-name') ||
     inputElement.classList.contains('popup__input_type_avatar')) &&
    !/^[a-zA-Zа-яА-ЯёЁ\s-]+$/.test(inputElement.value.trim())
  ) {
    errorMessage = inputElement.dataset.errorMessage;
  }

  if (errorMessage) {
    showInputError(formElement, inputElement, errorMessage, settings);
  } else {
    hideInputError(inputElement, settings);
  }
}

//проверка, есть ли невалидные поля
export function hasInvalidInput(inputList) {
  return Array.from(inputList).some((input) => !input.validity.valid);
}

//деактивация кнопки формы
export function disableSubmitButton(buttonElement, settings) {
  buttonElement.disabled = true;
  buttonElement.classList.add(settings.inactiveButtonClass);
}

//активация кнопки формы
export function enableSubmitButton(buttonElement, settings) {
  buttonElement.disabled = false;
  buttonElement.classList.remove(settings.inactiveButtonClass);
}

//переключение состояния кнопки
export function toggleButtonState(inputList, buttonElement, settings) {
  if (hasInvalidInput(inputList)) {
    disableSubmitButton(buttonElement, settings);
  } else {
    enableSubmitButton(buttonElement, settings);
  }
}

//назначение слушателей событий на все поля формы
export function setEventListeners(formElement, settings) {
  const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
  const buttonElement = formElement.querySelector(settings.submitButtonSelector);

  //первоначальное состояние кнопки
  toggleButtonState(inputList, buttonElement, settings);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      checkInputValidity(formElement, inputElement, settings);
      toggleButtonState(inputList, buttonElement, settings);
    });
  });
}

//очистка ошибок валидации
export function clearValidation(formElement, settings) {
  const inputList = formElement.querySelectorAll(settings.inputSelector);
  const buttonElement = formElement.querySelector(settings.submitButtonSelector);

  inputList.forEach((inputElement) => {
    hideInputError(inputElement, settings);
  });

  disableSubmitButton(buttonElement, settings);
}

//включение валидации всех форм
export function enableValidation(settings) {
  const formList = Array.from(document.querySelectorAll(settings.formSelector));

  formList.forEach((formElement) => {
    formElement.addEventListener('submit', (evt) => {
      evt.preventDefault();
    });
    setEventListeners(formElement, settings);
  });
}
