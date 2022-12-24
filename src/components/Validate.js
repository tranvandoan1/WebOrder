export const validatePhone = (phone) => {
  const checkPhone = /((09|03|07|08|05)+([0-9]{8})\b)/g;
  return checkPhone.test(phone);
};
export const validateEmail = (email) => {
  let checkEmail = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
  return checkEmail.test(email);
};
