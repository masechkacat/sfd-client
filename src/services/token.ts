import Cookies from "js-cookie";

const AUTH_TOKEN_KEY_NAME = "access_token";

export const getToken = () => {
  return Cookies.get(AUTH_TOKEN_KEY_NAME) || "";
};

export const saveToken = (token: string) => {
  Cookies.set(AUTH_TOKEN_KEY_NAME, token, { expires: 7 }); // Токен сохраняется на 7 дней
};

export const dropToken = () => {
  Cookies.remove(AUTH_TOKEN_KEY_NAME);
};
