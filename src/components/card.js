import { cardTemplate, imagePopupElement, popupImage, popupCaption } from "./index.js";
import { openModal } from "./modal.js";

export function createCard(name, link) {
	const card = cardTemplate.cloneNode(true);
	const cardImage = card.querySelector(".card__image");
	const cardTitle = card.querySelector(".card__title");
  const cardLikeButton = card.querySelector(".card__like-button");
	const cardLikeCount = card.querySelector(".card__like-count");
  const cardDeleteButton = card.querySelector(".card__delete-button");

	cardTitle.textContent = name;
	cardImage.src = link;
	cardImage.alt = name;
	cardLikeCount.textContent = 0;

	cardLikeButton.addEventListener("click", evt => {
		const likeButton = evt.target;
		const likeContainer = likeButton.closest(".card__like-container");
		const likeCount = likeContainer.querySelector(".card__like-count");
		likeButton.classList.toggle("card__like-button_is-active");
		if(likeButton.classList.contains("card__like-button_is-active")){
			likeCount.textContent = Number.parseInt(likeCount.textContent) + 1;
		}
		else{
			likeCount.textContent = Number.parseInt(likeCount.textContent) - 1;
		}
	});

	cardDeleteButton.addEventListener("click", evt => evt.target.closest(".card").remove());

	cardImage.addEventListener("click", () => {
		popupImage.src = cardImage.src;
		popupImage.alt = cardTitle.textContent;
		popupCaption.textContent = cardTitle.textContent;
		openModal(imagePopupElement);
	});
  
  return card;
}