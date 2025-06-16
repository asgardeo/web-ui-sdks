'use client';

import {Link} from 'react-router-dom';
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
  Mail,
} from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: MessageSquare,
      title: 'Real-time Communication',
      description:
        'Stay connected with instant messaging, video calls, and threaded discussions that keep everyone in the loop.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Calendar,
      title: 'Project Management',
      description:
        'Plan, track, and deliver projects on time with intuitive task management, timelines, and progress tracking.',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: FileText,
      title: 'Document Collaboration',
      description: 'Create, edit, and share documents in real-time with version control and seamless integration.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description:
        'Keep your data safe with enterprise-grade security, SSO integration, and compliance certifications.',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      icon: Zap,
      title: 'Workflow Automation',
      description: 'Automate repetitive tasks and streamline processes with custom workflows and integrations.',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      icon: Users,
      title: 'Team Analytics',
      description: 'Gain insights into team performance and project progress with detailed analytics and reporting.',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ];

  const testimonials = [
    {
      quote: "Teamspace transformed how our remote team collaborates. We're 40% more productive since switching.",
      author: 'Sarah Chen',
      role: 'VP of Engineering',
      company: 'TechCorp',
      avatar: '/placeholder.svg?height=48&width=48',
    },
    {
      quote: "The best investment we've made for our team. The ROI was clear within the first month.",
      author: 'Michael Rodriguez',
      role: 'Project Manager',
      company: 'InnovateLab',
      avatar: '/placeholder.svg?height=48&width=48',
    },
    {
      quote: 'Finally, a platform that brings everything together. Our team loves the intuitive interface.',
      author: 'Emily Johnson',
      role: 'Creative Director',
      company: 'DesignStudio',
      avatar: '/placeholder.svg?height=48&width=48',
    },
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: 'Free',
      description: 'Perfect for small teams getting started',
      features: [
        'Up to 5 team members',
        'Basic project management',
        '5GB storage',
        'Community support',
        'Basic integrations',
      ],
      cta: 'Get Started',
      popular: false,
    },
    {
      name: 'Professional',
      price: '$12',
      period: '/user/month',
      description: 'For growing teams that need more power',
      features: [
        'Unlimited team members',
        'Advanced project management',
        '100GB storage',
        'Priority support',
        'Advanced integrations',
        'Custom workflows',
        'Team analytics',
      ],
      cta: 'Start Free Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large organizations with custom needs',
      features: [
        'Everything in Professional',
        'SSO & advanced security',
        'Unlimited storage',
        'Dedicated support',
        'Custom integrations',
        'Advanced compliance',
        'On-premise deployment',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  const stats = [
    {value: '10,000+', label: 'Teams worldwide'},
    {value: '99.9%', label: 'Uptime guarantee'},
    {value: '50+', label: 'Integrations'},
    {value: '24/7', label: 'Support available'},
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                🚀 New: AI-powered insights now available
              </div>

              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Where teams
                <span className="text-blue-600"> collaborate</span> and ideas come to life
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                Streamline your team's workflow with our all-in-one collaboration platform. Chat, plan, share, and
                deliver exceptional results together.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <button className="inline-flex items-center justify-center px-8 py-4 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-600">
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
              <img
                src="/placeholder.svg?height=500&width=600"
                alt="Teamspace Dashboard"
                className="w-full rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-lg p-4 border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">12 team members online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-gray-600">Trusted by teams worldwide</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-gray-600 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 mb-4">
              Features
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">Everything your team needs to succeed</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From real-time collaboration to project management, Teamspace provides all the tools your team needs in
              one integrated platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-6`}>
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 mb-4">
              Testimonials
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">What our customers say</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-6 text-lg leading-relaxed">"{testimonial.quote}"</blockquote>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar || '/placeholder.svg'}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.author}</div>
                    <div className="text-gray-600 text-sm">
                      {testimonial.role}, {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 mb-4">
              Pricing
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the plan that's right for your team. Start free and scale as you grow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl p-8 shadow-sm border-2 relative ${
                  plan.popular ? 'border-blue-200 shadow-lg' : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    {plan.period && <span className="text-gray-600">{plan.period}</span>}
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/signup"
                  className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
            Ready to transform your team's productivity?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of teams already using Teamspace to collaborate better and achieve more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <button className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <span className="ml-2 text-xl font-bold">Teamspace</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Empowering teams to collaborate better and achieve more together. Built for the modern workplace.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Github className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Integrations
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Security
                  </a>
                </li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Press
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Status
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Support
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Teamspace. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
