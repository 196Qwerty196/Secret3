/*
  Файл index.js является точкой входа в наше приложение
  и только он должен содержать логику инициализации нашего приложения
  используя при этом импорты из других файлов

  Из index.js не допускается что-то экспортировать
*/

import { createCardElement, deleteCard, likeCard } from "./components/card.js";
import { openModalWindow, closeModalWindow, setCloseModalWindowEventListeners } from "./components/modal.js";
import { enableValidation, clearValidation } from "./components/validation.js";
import {
  getUserInfo,
  getCardList,
  setUserInfo,
  updateAvatar,
  addNewCard,
  changeLikeCardStatus,
} from "./components/api.js";

//настройки валидации
const validationSettings = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible',
};

//включение валидации
enableValidation(validationSettings);

// DOM узлы
const placesWrap = document.querySelector(".places__list");
const profileFormModalWindow = document.querySelector(".popup_type_edit");
const profileForm = profileFormModalWindow.querySelector(".popup__form");
const profileTitleInput = profileForm.querySelector(".popup__input_type_name");
const profileDescriptionInput = profileForm.querySelector(".popup__input_type_description");

const cardFormModalWindow = document.querySelector(".popup_type_new-card");
const cardForm = cardFormModalWindow.querySelector(".popup__form");
const cardNameInput = cardForm.querySelector(".popup__input_type_card-name");
const cardLinkInput = cardForm.querySelector(".popup__input_type_url");

const imageModalWindow = document.querySelector(".popup_type_image");
const imageElement = imageModalWindow.querySelector(".popup__image");
const imageCaption = imageModalWindow.querySelector(".popup__caption");

const openProfileFormButton = document.querySelector(".profile__edit-button");
const openCardFormButton = document.querySelector(".profile__add-button");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");

const avatarFormModalWindow = document.querySelector(".popup_type_edit-avatar");
const avatarForm = avatarFormModalWindow.querySelector(".popup__form");
const avatarInput = avatarForm.querySelector(".popup__input");

//ID пользователя
let userId = null;

//форматирование даты
const formatDate = (date) =>
  date.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

//обработчик просмотра изображения
const handlePreviewPicture = ({ name, link }) => {
  imageElement.src = link;
  imageElement.alt = name;
  imageCaption.textContent = name;
  openModalWindow(imageModalWindow);
};

//функция обновления текста кнопки
const toggleButtonText = (button, isLoading, defaultText, loadingText) => {
  button.textContent = isLoading ? loadingText : defaultText;
};

//обработчик отправки формы профиля
const handleProfileFormSubmit = (evt) => {
  evt.preventDefault();
  const submitButton = profileForm.querySelector(validationSettings.submitButtonSelector);
  toggleButtonText(submitButton, true, "Сохранить", "Сохранение...");

  setUserInfo({
    name: profileTitleInput.value,
    about: profileDescriptionInput.value,
  })
    .then((userData) => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closeModalWindow(profileFormModalWindow);
    })
    .catch((err) => {
      console.log("Ошибка редактирования профиля:", err);
    })
    .finally(() => {
      toggleButtonText(submitButton, false, "Сохранить", "Сохранение...");
    });
};

//обработчик отправки формы аватара
const handleAvatarFromSubmit = (evt) => {
  evt.preventDefault();
  const submitButton = avatarForm.querySelector(validationSettings.submitButtonSelector);
  toggleButtonText(submitButton, true, "Сохранить", "Сохранение...");

  updateAvatar(avatarInput.value)
    .then((userData) => {
      profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
      closeModalWindow(avatarFormModalWindow);
    })
    .catch((err) => {
      console.log("Ошибка обновления аватара:", err);
    })
    .finally(() => {
      toggleButtonText(submitButton, false, "Сохранить", "Сохранение...");
    });
};

//обработчик отправки формы карточки
const handleCardFormSubmit = (evt) => {
  evt.preventDefault();
  const submitButton = cardForm.querySelector(validationSettings.submitButtonSelector);
  toggleButtonText(submitButton, true, "Создать", "Создание...");

  addNewCard({
    name: cardNameInput.value,
    link: cardLinkInput.value,
  })
    .then((cardData) => {
      placesWrap.prepend(
        createCardElement(
          cardData,
          {
            onPreviewPicture: handlePreviewPicture,
            onLikeIcon: (cardElement, isLiked) => {
              changeLikeCardStatus(cardData._id, isLiked)
                .then((updatedCard) => {
                  likeCard(cardElement, updatedCard.likes.length, updatedCard.owner._id === userId);
                })
                .catch((err) => console.log("Ошибка лайка:", err));
            },
            onDeleteCard: () => {
              deleteCard(cardData._id).then(() => {
                cardElement.remove();
              }).catch((err) => console.log("Ошибка удаления:", err));
            },
          },
          userId
        )
      );
      closeModalWindow(cardFormModalWindow);
    })
    .catch((err) => {
      console.log("Ошибка добавления карточки:", err);
    })
    .finally(() => {
      toggleButtonText(submitButton, false, "Создать", "Создание...");
    });
};

//назначение обработчиков событий
profileForm.addEventListener("submit", handleProfileFormSubmit);
cardForm.addEventListener("submit", handleCardFormSubmit);
avatarForm.addEventListener("submit", handleAvatarFromSubmit);

openProfileFormButton.addEventListener("click", () => {
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  clearValidation(profileForm, validationSettings);
  openModalWindow(profileFormModalWindow);
});

profileAvatar.addEventListener("click", () => {
  avatarForm.reset();
  clearValidation(avatarForm, validationSettings);
  openModalWindow(avatarFormModalWindow);
});

openCardFormButton.addEventListener("click", () => {
  cardForm.reset();
  clearValidation(cardForm, validationSettings);
  openModalWindow(cardFormModalWindow);
});

//отображение карточек и данных пользователя
Promise.all([getUserInfo(), getCardList()])
  .then(([userData, cards]) => {
    //установка данных пользователя
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
    userId = userData._id;

    //отрисовка карточек
    cards.forEach((cardData) => {
      const cardElement = createCardElement(
        cardData,
        {
          onPreviewPicture: handlePreviewPicture,
          onLikeIcon: (cardElement, isLiked) => {
            changeLikeCardStatus(cardData._id, isLiked)
              .then((updatedCard) => {
                likeCard(cardElement, updatedCard.likes.length, updatedCard.owner._id === userId);
              })
              .catch((err) => console.log("Ошибка лайка:", err));
          },
          onDeleteCard: (cardElement) => {
            deleteCard(cardData._id)
              .then(() => cardElement.remove())
              .catch((err) => console.log("Ошибка удаления:", err));
          },
        },
        userId
      );
      placesWrap.append(cardElement);
    });
  })
  .catch((err) => {
    console.log("Ошибка загрузки данных:", err);
  });

//настройка закрытия попапов по esc и overlay
const allPopups = document.querySelectorAll(".popup");
allPopups.forEach((popup) => {
  setCloseModalWindowEventListeners(popup);
});
const usersStatsModalWindow = document.querySelector(".popup_type_info");
const usersStatsModalInfo = usersStatsModalWindow.querySelector(".popup__info");
const usersStatsModalInfoList = usersStatsModalWindow.querySelector(".popup__list");
const logo = document.querySelector(".header__logo");

const createInfoString = (term, description) => {
  const template = document.querySelector("#popup-info-definition-template");
  const element = template.content.cloneNode(true);
  element.querySelector(".popup__info-term").textContent = term;
  element.querySelector(".popup__info-description").textContent = description;
  return element;
};

const createUserBadge = (user) => {
  const template = document.querySelector("#popup-info-user-preview-template");
  const element = template.content.cloneNode(true);
  const img = document.createElement("img");
  img.src = user.avatar;
  img.alt = user.name;
  img.style.width = "30px";
  img.style.height = "30px";
  img.style.borderRadius = "50%";
  element.prepend(img);
  element.append(user.name);
  return element;
};

const handleLogoClick = () => {
  getCardList()
    .then((cards) => {
      usersStatsModalInfo.innerHTML = "";
      usersStatsModalInfoList.innerHTML = "";

      const sortedCards = cards.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const firstCard = sortedCards[sortedCards.length - 1];
      const lastCard = sortedCards[0];

      usersStatsModalInfo.append(
        createInfoString("Общее число карточек:", cards.length)
      );
      usersStatsModalInfo.append(
        createInfoString("Первая создана:", formatDate(new Date(firstCard.createdAt)))
      );
      usersStatsModalInfo.append(
        createInfoString("Последняя создана:", formatDate(new Date(lastCard.createdAt)))
      );

      const uniqueUsers = new Map();
      cards.forEach(card => {
        if (!uniqueUsers.has(card.owner._id)) {
          uniqueUsers.set(card.owner._id, card.owner);
        }
      });

      usersStatsModalInfo.append(
        createInfoString("Участников:", uniqueUsers.size)
      );

      uniqueUsers.forEach(user => {
        usersStatsModalInfoList.append(createUserBadge(user));
      });

      openModalWindow(usersStatsModalWindow);
    })
    .catch((err) => console.log("Ошибка загрузки статистики:", err));
};

logo.addEventListener("click", handleLogoClick);