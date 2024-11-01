import '../pages/index.css';
import { enableValidation } from "./validation.js";
import { createCard } from "./card.js";
import { openModal, closeModal } from "./modal.js";
import * as api from './api.js';

const cardTemplate = document.querySelector("#card-template").content;
const placesList = document.querySelector(".places__list");
const popups = document.querySelectorAll(".popup");
const popupCloseButtons = document.querySelectorAll(".popup__close");

const loginPopup = document.querySelector(".popup_type_login");
const loginForm = loginPopup.querySelector(".popup__form");
const groupURLInput = loginPopup.querySelector(".popup__input_type_group");
const tokenInput = loginPopup.querySelector(".popup__input_type_token");

const profileImage = document.querySelector(".profile__image");
const avatarPopup = document.querySelector(".popup_type_avatar");
const avatarFormElement = avatarPopup.querySelector(".popup__form");
const avatarLinkInput = avatarPopup.querySelector(".popup__input_type_avatar-link");

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

function loadPage() {
	Promise.all([api.getInitialCards(), api.getUser()])
		.then(([initialCards, user]) => {
			profileTitle.textContent = user.name;
			profileDescription.textContent = user.about;
			profileImage.style.backgroundImage = `url(${user.avatar})`;
			initialCards.forEach(card => {
				placesList.append(createCard(card.name, card.link, card._id, card.owner.name, user.name, card.likes));
			});
			closeModal(loginPopup);
		})
		.catch(err => alert(err));
}

function handleLoginFormSubmit(evt) {
	evt.preventDefault();
	const popupButton = evt.target.querySelector(".popup__button");
	popupButton.textContent = "Выполняется вход...";

	api.login(groupURLInput.value, tokenInput.value)
	.then(() => {
		loadPage();
	})
	.catch(err => {
		groupURLInput.value = "";
		tokenInput.value = "";
		alert(err);
	})
	.finally(() => {
		popupButton.textContent = "Войти";
	});
}

function openAvatarPopup() {
	avatarLinkInput.value = profileImage.style.backgroundImage.slice(5, -2);

	openModal(avatarPopup);
}

function handleAvatarFormSubmit(evt) {
	evt.preventDefault();
	const popupButton = evt.target.querySelector(".popup__button");
	const avatarLink = avatarLinkInput.value;
	popupButton.textContent = "Сохранение...";

	api.editAvatar(avatarLink)
	.then((user) => {
		profileImage.style.backgroundImage = `url(${user.avatar})`;
		closeModal(avatarPopup);
	})
	.catch(err => alert(err))
	.finally(() => {
		popupButton.textContent = "Сохранить";
	});
}

function openProfilePopup() {
	nameInput.value = profileTitle.textContent;
	descriptionInput.value = profileDescription.textContent;

	openModal(profilePopup);
}

function handleProfileFormSubmit(evt) {
	evt.preventDefault();
	const popupButton = evt.target.querySelector(".popup__button");
	popupButton.textContent = "Сохранение...";

	api.editProfile(nameInput.value, descriptionInput.value)
	.then((user) => {
		profileTitle.textContent = user.name;
		profileDescription.textContent = user.about;
		closeModal(profilePopup);
	})
	.catch(err => alert(err))
	.finally(() => {
		popupButton.textContent = "Сохранить";
	});
}

function openCardAddPopup() {
	cardPopupInputName.value = "";
	cardPopupInputImageURL.value = "";
	openModal(cardPopup);
}

function handleCardFormSubmit(evt) {
	evt.preventDefault();
	const popupButton = evt.target.querySelector(".popup__button");
	popupButton.textContent = "Создание...";

	api.addCard(cardPopupInputName.value, cardPopupInputImageURL.value)
	.then(card => {
		placesList.prepend(createCard(card.name, card.link, card._id, card.owner.name, card.owner.name));
		closeModal(cardPopup);
	})
	.catch(err => alert(err))
	.finally(() => {
		popupButton.textContent = "Создать";
	});
}

profileImage.addEventListener("click", openAvatarPopup);
avatarFormElement.addEventListener("submit", handleAvatarFormSubmit);
profileEditButton.addEventListener("click", openProfilePopup);
profileFormElement.addEventListener("submit", handleProfileFormSubmit);
cardAddButton.addEventListener("click", openCardAddPopup);
cardFormElement.addEventListener("submit", handleCardFormSubmit);
loginForm.addEventListener("submit", handleLoginFormSubmit);

popups.forEach((popup) => {
	popup.classList.add("popup_is-animated");

	if(popup !== loginPopup) {
		popup.addEventListener("mousedown", (evt) => {
			if (!evt.target.closest(".popup__content")) {
				closeModal(popup);
			}
		});
	}
});

popupCloseButtons.forEach(closeButton => {
  closeButton.addEventListener("click", () => closeModal(closeButton.closest(".popup")));
});

export { cardTemplate, imagePopupElement, popupImage, popupCaption, profileTitle, loginPopup };