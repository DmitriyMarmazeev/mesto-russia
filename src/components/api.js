import { config } from "./config";

export const getUser = () => {
  return fetch(`${config.baseUrl}/users/me`, {
    method: "GET",
    headers: config.headers
  })
  .then(res => {
    if (res.ok) {
      return res.json();
    }
  })
  .catch(res => Promise.reject(`Ошибка: ${res.status}`));
}

export const getInitialCards = () => {
  return fetch(`${config.baseUrl}/cards`, {
    method: "GET",
    headers: config.headers
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      }
    })
    .catch(res => Promise.reject(`Ошибка: ${res.status}`));
}

export const editProfile = (newName, newDescription) => {
  return fetch(`${config.baseUrl}/users/me`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      name: newName,
      about: newDescription
    })
  })
  .then(res => {
    if (res.ok) {
      return res.json();
    }
  })
  .catch(res => Promise.reject(`Ошибка: ${res.status}`));;
}