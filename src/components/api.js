import { config } from "./config";

export const getInitialCards = () => {
  return fetch(`${config.baseUrl}/cards`, {
    headers: config.headers
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      }
    })
    .catch(res => Promise.reject(`Ошибка: ${res.status}`));
} 