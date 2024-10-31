import '../pages/index.css';
import { enableValidation } from "./validation.js";
import { createCard } from "./card.js";
import { openModal, closeModal } from "./modal.js";
import * as api from './api.js';

const cardTemplate = document.querySelector("#card-template").content;
const placesList = document.querySelector(".places__list");
const popups = document.querySelectorAll(".popup");
const popupCloseButtons = document.querySelectorAll(".popup__close");

const profilePopup = document.querySelector(".popup_type_edit");
const profileEditButton = document.querySelector(".profile__edit-button");
const profileFormElement = profilePopup.querySelector(".popup__form");
const nameInput = profilePopup.querySelector(".popup__input_type_name");
const descriptionInput = profilePopup.querySelector(".popup__input_type_description");
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

const validationSettings = {
	formSelector: ".popup__form",
	inputSelector: ".popup__input",
	submitButtonSelector: ".popup__button",
	inactiveButtonClass: "popup__button_disabled",
	inputErrorClass: "popup__input_type_error",
	errorClass: "popup__error_visible",
};

enableValidation(validationSettings);

function openProfilePopup() {
	nameInput.value = profileTitle.textContent;
	descriptionInput.value = profileDescription.textContent;

	openModal(profilePopup);
}

function handleProfileFormSubmit(evt) {
	evt.preventDefault();
	evt.target.textContent = "Сохранение...";

	api.editProfile(nameInput.value, descriptionInput.value)
	.then((user) => {
		profileTitle.textContent = user.name;
		profileDescription.textContent = user.about;
		closeModal(profilePopup);
	})
	.catch(err => alert(err))
	.finally(() => {
		evt.target.textContent = "Сохранить";
	});
}

function openCardAddPopup() {
	cardPopupInputName.value = "";
	cardPopupInputImageURL.value = "";
	openModal(cardPopup);
}

function handleCardFormSubmit(evt) {
	evt.preventDefault();
	evt.target.textContent = "Создание...";

	api.addCard(cardPopupInputName.value, cardPopupInputImageURL.value)
	.then(card => {
		placesList.prepend(createCard(card.name, card.link, card._id, card.owner.name, card.owner.name));
		closeModal(cardPopup);
	})
	.catch(err => alert(err))
	.finally(() => {
		evt.target.textContent = "Создать";
	});
}

profileEditButton.addEventListener("click", openProfilePopup);
cardAddButton.addEventListener("click", openCardAddPopup);

profileFormElement.addEventListener("submit", handleProfileFormSubmit);
cardFormElement.addEventListener("submit", handleCardFormSubmit);

popups.forEach((popup) => {
	popup.classList.add("popup_is-animated");

	popup.addEventListener("click", (evt) => {
		if (!evt.target.closest(".popup__content")) {
			closeModal(popup);
		}
	});
});

popupCloseButtons.forEach(closeButton => {
  closeButton.addEventListener("click", () => closeModal(closeButton.closest(".popup")));
});

api.getInitialCards()
.then(initialCards => {
	api.getUser()
	.then(user => {
		profileTitle.textContent = user.name;
		profileDescription.textContent = user.about;

		initialCards.forEach(card => {
			placesList.append(createCard(card.name, card.link, card._id, card.owner.name, user.name, card.likes));
		});
	})
	.catch(err => alert(err));
})
.catch(err => alert(err));


export { cardTemplate, imagePopupElement, popupImage, popupCaption, profileTitle };