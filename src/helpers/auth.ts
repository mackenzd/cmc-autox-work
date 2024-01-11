export function login(): void {
  fetch("/auth/login")
    .then((res) => {
      if (res.ok) {
        return res.text();
      }
      return Promise.reject(res);
    })
    .then((data) => {
      window.location.href = data;
    })
    .catch((error) => console.log(error));
}
