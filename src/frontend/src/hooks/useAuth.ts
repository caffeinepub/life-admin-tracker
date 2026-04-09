import { useInternetIdentity } from "@caffeineai/core-infrastructure";

export function useAuth() {
  const { identity, loginStatus, login, clear } = useInternetIdentity();

  const isAuthenticated = loginStatus === "success" && identity !== undefined;
  const principal = identity?.getPrincipal().toText();

  return {
    isAuthenticated,
    principal,
    loginStatus,
    login,
    logout: clear,
    identity,
  };
}
