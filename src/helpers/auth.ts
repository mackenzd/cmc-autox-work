export function login(): void {
  fetch("/auth/login")
    .then((res) => {
      if (res.ok) {
        return res.text();
      }
      else {
        res.text().then((res) => console.error(res));
        alert("Sorry, there was a problem logging in. Please try again later.")
        return Promise.reject(res);
      }
    })
    .then((data) => {
      window.location.href = data;
    })
    .catch((error) => console.log(error));
}
