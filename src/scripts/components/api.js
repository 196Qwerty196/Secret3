//настройки подключения к API
const config = {
  baseUrl: "https://mesto.nomoreparties.co/v1/apf-cohort-202",
  headers: {
    authorization: "54250382-5d03-4dfe-9824-e8eb733d19b4",
    "Content-Type": "application/json",
  },
};

//проверка ответа
const getResponseData = (res) => {
  return res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);
};

//получение информации о пользователе
export const getUserInfo = () => {
  return fetch(`${config.baseUrl}/users/me`, {
    headers: config.headers,
  }).then(getResponseData);
};

//получение списка карточек
export const getCardList = () => {
  return fetch(`${config.baseUrl}/cards`, {
    headers: config.headers,
  }).then(getResponseData);
};

//обновление профиля
export const setUserInfo = ({ name, about }) => {
  return fetch(`${config.baseUrl}/users/me`, {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify({ name, about }),
  }).then(getResponseData);
};

//обновление аватара
export const updateAvatar = (link) => {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify({ avatar: link }),
  }).then(getResponseData);
};

//добавление новой карточки
export const addNewCard = ({ name, link }) => {
  return fetch(`${config.baseUrl}/cards`, {
    method: "POST",
    headers: config.headers,
    body: JSON.stringify({ name, link }),
  }).then(getResponseData);
};

//удаление карточки
export const deleteCard = (cardId) => {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: "DELETE",
    headers: config.headers,
  }).then(getResponseData);
};

//постановка лайка
export const likeCard = (cardId) => {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: "PUT",
    headers: config.headers,
  }).then(getResponseData);
};

//снятие лайка
export const unlikeCard = (cardId) => {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: "DELETE",
    headers: config.headers,
  }).then(getResponseData);
};

//изменение лайка
export const changeLikeCardStatus = (cardId, isLiked) => {
  return isLiked ? unlikeCard(cardId) : likeCard(cardId);
};
