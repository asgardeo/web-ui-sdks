import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Users,
  MessageSquare,
  Calendar,
  FileText,
  Shield,
  Zap,
  CheckCircle,
  Star,
  ArrowRight,
  Play,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"

const features = [
  {
    icon: MessageSquare,
    title: "Real-time Communication",
    description: "Stay connected with instant messaging, video calls, and threaded discussions.",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: Calendar,
    title: "Project Management",
    description: "Plan, track, and deliver projects on time with intuitive task management.",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    icon: FileText,
    title: "Document Collaboration",
    description: "Create, edit, and share documents in real-time with version control.",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Keep your data safe with enterprise-grade security and compliance.",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
  {
    icon: Zap,
    title: "Workflow Automation",
    description: "Automate repetitive tasks and streamline processes with custom workflows.",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
  },
  {
    icon: Users,
    title: "Team Analytics",
    description: "Gain insights into team performance and project progress with detailed analytics.",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
  },
]

const testimonials = [
  {
    quote: "Teamspace transformed how our remote team collaborates. We're 40% more productive since switching.",
    author: "Sarah Chen",
    role: "VP of Engineering",
    company: "TechCorp",
    avatar: "/placeholder.svg?height=48&width=48",
  },
  {
    quote: "The best investment we've made for our team. The ROI was clear within the first month.",
    author: "Michael Rodriguez",
    role: "Project Manager",
    company: "InnovateLab",
    avatar: "/placeholder.svg?height=48&width=48",
  },
  {
    quote: "Finally, a platform that brings everything together. Our team loves the intuitive interface.",
    author: "Emily Johnson",
    role: "Creative Director",
    company: "DesignStudio",
    avatar: "/placeholder.svg?height=48&width=48",
  },
]

const pricingPlans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for small teams getting started",
    features: ["Up to 5 team members", "Basic project management", "5GB storage", "Community support"],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Professional",
    price: "$12",
    period: "/user/month",
    description: "For growing teams that need more power",
    features: [
      "Unlimited team members",
      "Advanced project management",
      "100GB storage",
      "Priority support",
      "Advanced integrations",
      "Team analytics",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations with custom needs",
    features: [
      "Everything in Professional",
      "SSO & advanced security",
      "Unlimited storage",
      "Dedicated support",
      "Custom integrations",
      "On-premise deployment",
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-background to-purple-50 py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge variant="secondary" className="w-fit">
                🚀 New: AI-powered insights now available
              </Badge>

              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Where teams
                <span className="text-primary"> collaborate</span> and ideas come to life
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed">
                Streamline your team's workflow with our all-in-one collaboration platform. Chat, plan, share, and
                deliver exceptional results together.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="h-12 px-8">
                  <Link href="/auth/signup">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-12 px-8">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Free 14-day trial
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  No credit card required
                </div>
              </div>
            </div>

            <div className="relative">
              <Image
                src="/placeholder.svg?height=500&width=600"
                alt="Teamspace Dashboard"
                width={600}
                height={500}
                className="w-full rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Features
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">
              Everything your team needs to succeed
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From real-time collaboration to project management, Teamspace provides all the tools your team needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                      <Icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="bg-muted/50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Testimonials
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">What our customers say</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-foreground mb-6 text-lg leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center">
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.author}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.author}</div>
                      <div className="text-muted-foreground text-sm">
                        {testimonial.role}, {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Pricing
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">Simple, transparent pricing</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that's right for your team. Start free and scale as you grow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? "border-primary shadow-lg scale-105" : ""}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">Most Popular</Badge>
                )}

                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                  </div>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button asChild className="w-full" variant={plan.popular ? "default" : "outline"}>
                    <Link href="/auth/signup">{plan.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Ready to transform your team's productivity?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands of teams already using Teamspace to collaborate better and achieve more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="h-12 px-8">
              <Link href="/auth/signup">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="ml-2 text-xl font-bold">Teamspace</span>
              </div>
              <p className="text-muted-foreground mb-6 max-w-md">
                Empowering teams to collaborate better and achieve more together.
              </p>
              <div className="flex space-x-4">
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Github className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Linkedin className="h-5 w-5" />
                </Link>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    API
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} Teamspace. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
