"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Building2, Upload, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { redirect } from "next/navigation"

export default function CreateOrganizationPage() {
  const router = useRouter()
  const { addOrganization, isAuthenticated, isLoading } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    website: "",
    avatar: "/placeholder.svg?height=64&width=64",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      redirect("/")
    }
  }, [isAuthenticated, isLoading])

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!isAuthenticated) {
    return null
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
    setFormData({ ...formData, name, slug })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newOrg = {
      id: Date.now().toString(),
      name: formData.name,
      slug: formData.slug,
      avatar: formData.avatar,
      role: "owner" as const,
      memberCount: 1,
    }

    addOrganization(newOrg)
    router.push("/organizations")
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/organizations">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to organizations
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Create a new organization</h1>
          <p className="text-muted-foreground mt-2">
            Organizations are shared accounts where teams can collaborate across many projects at once.
          </p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Organization Details</CardTitle>
            <CardDescription>Set up your new organization with basic information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Organization Avatar */}
              <div>
                <Label className="text-sm font-medium">Organization avatar</Label>
                <div className="flex items-center space-x-4 mt-2">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={formData.avatar || "/placeholder.svg"} alt="Organization avatar" />
                    <AvatarFallback>
                      <Building2 className="h-8 w-8" />
                    </AvatarFallback>
                  </Avatar>
                  <Button type="button" variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload image
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  We recommend an image that's at least 64×64 pixels.
                </p>
              </div>

              {/* Organization Name */}
              <div>
                <Label htmlFor="name">Organization name *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder="Enter organization name"
                  className="mt-2"
                />
              </div>

              {/* Organization Slug */}
              <div>
                <Label htmlFor="slug">Organization slug *</Label>
                <div className="flex mt-2">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                    teamspace.com/
                  </span>
                  <Input
                    id="slug"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="organization-slug"
                    className="rounded-l-none"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  This will be your organization's URL. Only lowercase letters, numbers, and hyphens are allowed.
                </p>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tell us about your organization..."
                  className="mt-2"
                />
              </div>

              {/* Website */}
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://example.com"
                  className="mt-2"
                />
              </div>

              {/* Terms */}
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-start">
                  <Building2 className="h-5 w-5 text-muted-foreground mt-0.5 mr-3" />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium mb-2">By creating an organization, you agree to:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Follow our Terms of Service and Community Guidelines</li>
                      <li>• Take responsibility for all activity under this organization</li>
                      <li>• Ensure all members comply with our policies</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-border">
                <Button type="button" variant="outline" asChild>
                  <Link href="/organizations">Cancel</Link>
                </Button>
                <Button type="submit" disabled={isSubmitting || !formData.name || !formData.slug}>
                  {isSubmitting ? "Creating..." : "Create organization"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
