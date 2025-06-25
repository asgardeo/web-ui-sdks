"use server"

import { redirect } from "next/navigation"
import { login, signup, logout } from "@/lib/auth"

export async function loginAction(formData: FormData) {
  const result = await login(formData)

  if (result.success) {
    redirect("/dashboard")
  }

  return result
}

export async function signupAction(formData: FormData) {
  const result = await signup(formData)

  if (result.success) {
    redirect("/dashboard")
  }

  return result
}

export async function logoutAction() {
  await logout()
  redirect("/")
}
