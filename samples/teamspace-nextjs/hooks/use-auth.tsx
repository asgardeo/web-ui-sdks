"use client"

import { createContext, useContext, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  avatar: string
  username: string
}

interface Organization {
  id: string
  name: string
  slug: string
  avatar: string
  role: "owner" | "admin" | "member"
  memberCount: number
}

interface AuthContextType {
  user: User
  currentOrg: Organization
  organizations: Organization[]
  setCurrentOrg: (org: Organization) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

// Mock data
const mockUser: User = {
  id: "1",
  name: "John Doe",
  email: "john@teamspace.com",
  avatar: "/placeholder.svg?height=32&width=32",
  username: "johndoe",
}

const mockOrganizations: Organization[] = [
  {
    id: "1",
    name: "Acme Corp",
    slug: "acme-corp",
    avatar: "/placeholder.svg?height=32&width=32",
    role: "owner",
    memberCount: 12,
  },
  {
    id: "2",
    name: "Tech Startup",
    slug: "tech-startup",
    avatar: "/placeholder.svg?height=32&width=32",
    role: "admin",
    memberCount: 8,
  },
  {
    id: "3",
    name: "Design Agency",
    slug: "design-agency",
    avatar: "/placeholder.svg?height=32&width=32",
    role: "member",
    memberCount: 15,
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const setCurrentOrg = (org: Organization) => {
    // In a real app, this would update state
    console.log("Switching to organization:", org.name)
  }

  return (
    <AuthContext.Provider
      value={{
        user: mockUser,
        currentOrg: mockOrganizations[0],
        organizations: mockOrganizations,
        setCurrentOrg,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
