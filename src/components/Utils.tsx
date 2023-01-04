export const setOnllyTextAndNumber = (str: string) => {
  // str = str.toLowerCase();
  const str1 = /^[0-9]+$/.test(str)
  return str1;
};

export const setOnllyNumber = (str: string) => {
  if (str !== undefined) {
    str = str.toLowerCase();
    str = str.replace(
      /[-#*;₫¥€'"~:•,“‘|.<>!@$%^&_?=`√π÷×¶∆£¢°°℅™®©\{\}\[\]\\\/+()]/gi,
      '',
    );
    return str;
  }

}