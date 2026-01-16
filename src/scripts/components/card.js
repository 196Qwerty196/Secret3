export function createCardElement(cardData, handlers, userId) {
  const cardTemplate = document.querySelector("#card-template").content;
  const cardElement = cardTemplate.querySelector(".places__item").cloneNode(true);

  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__control-button_type_delete");
  const likeCount = cardElement.querySelector(".card__like-count");

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  likeCount.textContent = cardData.likes.length;

  //проверка лайка
  const isLiked = cardData.likes.some(like => like._id === userId);
  if (isLiked) {
    likeButton.classList.add("card__like-button_is-active");
  }

  //проверка перед удалением
  if (cardData.owner._id !== userId) {
    deleteButton.remove();
  } else {
    deleteButton.addEventListener("click", () => handlers.onDeleteCard(cardElement));
  }

  cardImage.addEventListener("click", () => handlers.onPreviewPicture(cardData));
  likeButton.addEventListener("click", () => {
    const isLikedNow = likeButton.classList.contains("card__like-button_is-active");
    handlers.onLikeIcon(cardElement, isLikedNow);
    likeButton.classList.toggle("card__like-button_is-active");
  });

  return cardElement;
}

export function likeCard(cardElement, likesCount, isOwner) {
  const likeCount = cardElement.querySelector(".card__like-count");
  likeCount.textContent = likesCount;
}

export function deleteCard(cardElement) {
  cardElement.remove();
}
