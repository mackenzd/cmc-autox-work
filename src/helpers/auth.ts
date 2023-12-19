export function login(): void {
  fetch("/auth/request")
    .then((res) => res.text())
    .then((data) => {
      window.location.href = `https://www.motorsportreg.com/index.cfm/event/oauth?oauth_token=${data}`;
    });
}
