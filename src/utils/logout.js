import { redirect } from "react-router";

export async function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  return redirect("/");
}