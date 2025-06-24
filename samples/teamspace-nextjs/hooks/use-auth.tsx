"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

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
  user: User | null
  currentOrg: Organization | null
  organizations: Organization[]
  isAuthenticated: boolean
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (name: string, email: string, password: string) => Promise<void>
  signOut: () => void
  setCurrentOrg: (org: Organization) => void
  addOrganization: (org: Organization) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const mockUser: User = {
  id: "1",
  name: "John Doe",
  email: "demo@teamspace.com",
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
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(null)
  const [organizations, setOrganizations] = useState<Organization[]>(mockOrganizations)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("user")
    const savedOrg = localStorage.getItem("currentOrg")

    if (savedUser) {
      setUser(JSON.parse(savedUser))
      if (savedOrg) {
        setCurrentOrg(JSON.parse(savedOrg))
      } else {
        setCurrentOrg(mockOrganizations[0])
      }
    }
    setIsLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    // Mock authentication
    if (email === "demo@teamspace.com" && password === "password") {
      setUser(mockUser)
      setCurrentOrg(mockOrganizations[0])
      localStorage.setItem("user", JSON.stringify(mockUser))
      localStorage.setItem("currentOrg", JSON.stringify(mockOrganizations[0]))
      router.push("/dashboard")
    } else {
      throw new Error("Invalid credentials")
    }
  }

  const signUp = async (name: string, email: string, password: string) => {
    // Mock registration
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      avatar: "/placeholder.svg?height=32&width=32",
      username: name.toLowerCase().replace(/\s+/g, ""),
    }

    setUser(newUser)
    setCurrentOrg(mockOrganizations[0])
    localStorage.setItem("user", JSON.stringify(newUser))
    localStorage.setItem("currentOrg", JSON.stringify(mockOrganizations[0]))
    router.push("/dashboard")
  }

  const signOut = () => {
    setUser(null)
    setCurrentOrg(null)
    localStorage.removeItem("user")
    localStorage.removeItem("currentOrg")
    router.push("/")
  }

  const handleSetCurrentOrg = (org: Organization) => {
    setCurrentOrg(org)
    localStorage.setItem("currentOrg", JSON.stringify(org))
  }

  const addOrganization = (org: Organization) => {
    setOrganizations((prev) => [...prev, org])
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        currentOrg,
        organizations,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signUp,
        signOut,
        setCurrentOrg: handleSetCurrentOrg,
        addOrganization,
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
