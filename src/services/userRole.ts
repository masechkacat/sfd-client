import Cookies from "js-cookie";

const IS_SELLER_KEY_NAME = "is_seller";

export const getIsSeller = () => {
  return Cookies.get(IS_SELLER_KEY_NAME) === "true";
};

export const saveIsSeller = (isSeller: boolean) => {
  Cookies.set(IS_SELLER_KEY_NAME, String(isSeller), { expires: 7 }); // Состояние сохраняется на 7 дней
};

export const dropIsSeller = () => {
  Cookies.remove(IS_SELLER_KEY_NAME);
};
