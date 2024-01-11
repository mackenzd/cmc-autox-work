export function login(): void {
  fetch("/auth/request")
    .then((res) => {
      if (res.ok) {
        return res.text();
      }
      return Promise.reject(res);
    })
    .then((data) => {
      window.location.href = `https://www.motorsportreg.com/index.cfm/event/oauth?oauth_token=${data}`;
    })
    .catch((error) => console.log(error));
}
