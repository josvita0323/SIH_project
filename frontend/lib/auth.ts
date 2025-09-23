import type { User } from "@/types/auth"

// Mock users for demo - in production this would connect to a real auth system
const mockUsers: User[] = [
  {
    id: "1",
    email: "manager@kmrl.gov.in",
    name: "Rajesh Kumar",
    role: "manager",
    department: "Operations",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    email: "tech@kmrl.gov.in",
    name: "Priya Nair",
    role: "technician",
    department: "Maintenance",
    createdAt: new Date("2024-01-15"),
  },
]

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Simple mock authentication - in production use proper auth
  const user = mockUsers.find((u) => u.email === email)
  if (user && password === "demo123") {
    return user
  }

  throw new Error("Invalid credentials")
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null

  const userData = localStorage.getItem("kmrl_user")
  if (userData) {
    return JSON.parse(userData)
  }

  return null
}

export function setCurrentUser(user: User): void {
  localStorage.setItem("kmrl_user", JSON.stringify(user))
}

export function clearCurrentUser(): void {
  localStorage.removeItem("kmrl_user")
}
