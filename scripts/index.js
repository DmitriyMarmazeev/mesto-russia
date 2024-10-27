const cardTemplate = document.querySelector("#card-template").content;
const placesList = document.querySelector(".places__list");
const popups = document.querySelectorAll(".popup");
const popupCloseButtons = document.querySelectorAll(".popup__close");

const profilePopup = document.querySelector(".popup_type_edit");
const profileEditButton = document.querySelector(".profile__edit-button");
const profileFormElement = profilePopup.querySelector(".popup__form");
const nameInput = profilePopup.querySelector(".popup__input_type_name");
const jobInput = profilePopup.querySelector(".popup__input_type_description");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

const cardPopup = document.querySelector(".popup_type_new-card");
const cardAddButton = document.querySelector(".profile__add-button");
const cardFormElement = cardPopup.querySelector(".popup__form");
const cardPopupInputName = cardPopup.querySelector(".popup__input_type_card-name");
const cardPopupInputImageURL = cardPopup.querySelector(".popup__input_type_url");

const imagePopupElement = document.querySelector(".popup_type_image");
const popupImage = imagePopupElement.querySelector(".popup__image");
const popupCaption = imagePopupElement.querySelector(".popup__caption");

function createCard(name, link) {
	const card = cardTemplate.cloneNode(true);
	const cardImage = card.querySelector(".card__image");
	const cardTitle = card.querySelector(".card__title");
  const cardLikeButton = card.querySelector(".card__like-button");
  const cardDeleteButton = card.querySelector(".card__delete-button");

	cardTitle.textContent = name;
	cardImage.src = link;
	cardImage.alt = name;

	cardLikeButton.addEventListener("click", evt=> evt.target.classList.toggle("card__like-button_is-active"));

	cardDeleteButton.addEventListener("click", evt => evt.target.closest(".card").remove());

	cardImage.addEventListener("click", () => {
		popupImage.src = cardImage.src;
		popupImage.alt = cardTitle.textContent;
		popupCaption.textContent = cardTitle.textContent;
		openModal(imagePopupElement);
	});
  
  return card;
}

function openModal(popup) {
	popup.classList.add("popup_is-opened");
}

function closeModal(popup) {
	popup.classList.remove("popup_is-opened");
}

function openProfilePopup() {
	nameInput.value = profileTitle.textContent;
	jobInput.value = profileDescription.textContent;

	openModal(profilePopup);
}

function handleProfileFormSubmit(evt) {
	evt.preventDefault();

	profileTitle.textContent = nameInput.value;
	profileDescription.textContent = jobInput.value;

	closeModal(profilePopup);
}

function openCardAddPopup() {
	cardPopupInputName.value = "";
	cardPopupInputImageURL.value = "";
	openModal(cardPopup);
}

function handleCardFormSubmit(evt) {
	evt.preventDefault();

  const name = cardPopupInputName.value;
  const imageURL = cardPopupInputImageURL.value;
	placesList.prepend(createCard(name, imageURL));

	closeModal(cardPopup);
}

profileEditButton.addEventListener("click", openProfilePopup);
cardAddButton.addEventListener("click", openCardAddPopup);

profileFormElement.addEventListener("submit", handleProfileFormSubmit);
cardFormElement.addEventListener("submit", handleCardFormSubmit);

initialCards.forEach((card) => {
	placesList.append(createCard(card.name, card.link));
});

popups.forEach((popup) => {
	popup.classList.add("popup_is-animated");
});

popupCloseButtons.forEach(closeButton => {
  closeButton.addEventListener("click", () => closeModal(closeButton.closest(".popup")));
});