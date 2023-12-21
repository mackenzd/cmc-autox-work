import { MSRUser } from "../models/msr-user";

export function login(): void {
  fetch("/auth/request")
    .then((res) => res.text())
    .then((data) => {
      window.location.href = `https://www.motorsportreg.com/index.cfm/event/oauth?oauth_token=${data}`;
    });
}

export function getCurrentUser(): MSRUser {
  const sessionUser = sessionStorage.getItem("user");
  const currentUser: MSRUser = sessionUser
    ? JSON.parse(sessionUser)
    : undefined;

    return currentUser;
}