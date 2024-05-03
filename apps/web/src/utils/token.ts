export const getAccessToken = () => {
  const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
  const tokenCookie = cookies.find((cookie) =>
    cookie.startsWith("accessToken=")
  );
  if (tokenCookie) {
    return tokenCookie.split("=")[1];
  }
  return null;
};
