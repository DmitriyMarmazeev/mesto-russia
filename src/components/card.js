import { cardTemplate, imagePopupElement, popupImage, popupCaption } from "./index.js";
import { openModal } from "./modal.js";
import { deleteCard, putLike, deleteLike } from "./api.js";

export function createCard(name, link, id, cardOwnerName, userName, likes = []) {
	const card = cardTemplate.cloneNode(true);
	const cardImage = card.querySelector(".card__image");
	const cardTitle = card.querySelector(".card__title");
  const cardLikeButton = card.querySelector(".card__like-button");
	const cardLikeCount = card.querySelector(".card__like-count");
  const cardDeleteButton = card.querySelector(".card__delete-button");

	cardTitle.textContent = name;
	cardImage.src = link;
	cardImage.alt = name;
	cardLikeCount.textContent = likes.length;

	if(likes.some(liker => liker.name === userName)){
		cardLikeButton.classList.add("card__like-button_is-active");
	}

	cardLikeButton.addEventListener("click", evt => {
		const likeButton = evt.target;
		const likeCount = likeButton.nextElementSibling;
		if(likeButton.classList.contains("card__like-button_is-active")){
			deleteLike(id)
			.then(card => {
				likeCount.textContent = card.likes.length;
				likeButton.classList.remove("card__like-button_is-active");
			})
			.catch(err => alert(err));
		}
		else{
			putLike(id)
			.then(card => {
				likeCount.textContent = card.likes.length;
				likeButton.classList.add("card__like-button_is-active");
			})
			.catch(err => alert(err));
		}
	});

	if(cardOwnerName === userName){
		cardDeleteButton.addEventListener("click", evt => {
			deleteCard(id)
			.then(() => {
				evt.target.closest(".card").remove();
			})
			.catch(err => alert(err));
		});
	}
	else{
		cardDeleteButton.remove();
	}

	cardImage.addEventListener("click", () => {
		popupImage.src = cardImage.src;
		popupImage.alt = cardTitle.textContent;
		popupCaption.textContent = cardTitle.textContent;
		openModal(imagePopupElement);
	});
  
  return card;
}