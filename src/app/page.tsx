'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, HeadphonesIcon, Shield, Clock, Zap, MessageSquare, CreditCard, Lock, Star, Phone, Mail } from 'lucide-react'

export default function TechSupportPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const services = [
    {
      id: 'quick-fix',
      name: 'Quick Remote Fix',
      price: 45,
      period: 'one-time',
      description: 'Perfect for "How do I do this?" questions',
      features: [
        'Up to 30 minutes of remote support',
        'Quick problem resolution',
        'Screen sharing assistance',
        'Step-by-step guidance',
        'Same-day availability',
      ],
      icon: Zap,
      popular: true,
    },
    {
      id: 'virus-removal',
      name: 'Virus Removal & Cleanup',
      price: 129,
      period: 'flat rate',
      description: 'Deep scan + complete system update',
      features: [
        'Complete virus and malware removal',
        'Deep system scan',
        'Security software update',
        'Performance optimization',
        'Prevention tips included',
        'Flat rate, no surprises',
      ],
      icon: Shield,
      popular: false,
    },
    {
      id: 'onsite-service',
      name: 'On-Site Service',
      price: 125,
      period: 'includes 1st hour',
      description: 'Professional on-site technical support',
      features: [
        'Technician visits your location',
        'First hour included',
        'Hands-on problem solving',
        'Hardware & software support',
        'Follow-up recommendations',
      ],
      icon: HeadphonesIcon,
      popular: false,
    },
    {
      id: 'monthly-peace',
      name: 'Monthly "Peace of Mind"',
      price: 29,
      period: 'month',
      description: 'Residential monitoring - PC never slows down',
      features: [
        '24/7 system monitoring',
        'Performance optimization',
        'Automatic updates',
        'Proactive maintenance',
        'Remote support included',
        'Prevent slowdowns',
      ],
      icon: Clock,
      popular: false,
    },
  ]

  const features = [
    {
      icon: Clock,
      title: 'Fast Response Times',
      description: 'Get help when you need it with our guaranteed response times based on your plan',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is always protected with enterprise-grade security and encryption',
    },
    {
      icon: MessageSquare,
      title: 'Multiple Support Channels',
      description: 'Reach us via email, chat, or phone depending on your plan',
    },
  ]

  const handlePurchase = async (planId: string) => {
    try {
      setSelectedPlan(planId)

      // Create Stripe checkout session
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          successUrl: `${window.location.origin}/?success=true`,
          cancelUrl: `${window.location.origin}/?canceled=true`,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      // Only log in development mode to avoid console errors in production
      if (process.env.NODE_ENV !== 'production') {
        console.error('Payment error:', error)
      }
      alert('Failed to initiate checkout. Please try again.')
      setSelectedPlan(null)
    }
  }

  // Check for success/cancel parameters in URL
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search)
    const success = urlParams.get('success')
    const canceled = urlParams.get('canceled')

    if (success) {
      return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/20">
          <main className="flex-1 flex items-center justify-center p-4">
            <Card className="max-w-md w-full text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-2xl">Payment Successful!</CardTitle>
                <CardDescription>
                  Thank you for choosing <span className="font-semibold text-primary">easy to use .tech</span>. We'll send you a confirmation email shortly.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Our team will reach out within your plan's guaranteed response time to get you started.
                </p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => (window.location.href = '/')} className="w-full">
                  Return to Home
                </Button>
              </CardFooter>
            </Card>
          </main>
        </div>
      )
    }

    if (canceled) {
      return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/20">
          <main className="flex-1 flex items-center justify-center p-4">
            <Card className="max-w-md w-full text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mb-4">
                  <CreditCard className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                </div>
                <CardTitle className="text-2xl">Payment Canceled</CardTitle>
                <CardDescription>
                  No worries! You can try again anytime when you're ready.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  If you have any questions, feel free to reach out to our support team.
                </p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => (window.location.href = '/')} className="w-full">
                  Return to Home
                </Button>
              </CardFooter>
            </Card>
          </main>
        </div>
      )
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Shield className="w-10 h-10 text-primary" />
              </div>
              <div>
                <span className="text-2xl md:text-3xl font-black tracking-tight">easy to use .tech</span>
                <p className="text-xs text-muted-foreground font-medium">Tech Support Made Simple</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>763-220-0148</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>help@easytouse.tech</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Lock className="w-4 h-4" />
                <span>Secure Payments</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 md:py-24 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 inline-block">
              <div className="bg-gradient-to-r from-primary to-primary/70 text-white px-6 py-2 rounded-full text-sm font-bold tracking-wide shadow-lg">
                easy to use .tech
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Tech Support Made Simple
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Quick remote fixes from $45, virus removal, on-site service, and monthly monitoring. <span className="font-semibold text-foreground">easy to use .tech</span> is here to help.
            </p>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex -space-x-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  </div>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                Trusted by 10,000+ customers
              </span>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4">Why <span className="text-primary">easy to use .tech</span>?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Professional support that's actually easy to use
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Pricing Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4">Choose <span className="text-primary">easy to use .tech</span> Support</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Flexible services for home and business needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {services.map((service) => (
              <Card
                key={service.id}
                className={`relative flex flex-col hover:shadow-lg transition-all ${
                  service.popular
                    ? 'border-primary shadow-lg scale-105'
                    : 'hover:border-primary/50'
                }`}
              >
                {service.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <service.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-center text-lg">{service.name}</CardTitle>
                  <CardDescription className="text-center text-sm">
                    {service.description}
                  </CardDescription>
                  <div className="text-center mt-4">
                    <span className="text-4xl font-black">${service.price}</span>
                    <span className="text-muted-foreground text-sm ml-1">/{service.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-2">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handlePurchase(service.id)}
                    disabled={selectedPlan === service.id}
                    className="w-full"
                    variant={service.popular ? 'default' : 'outline'}
                  >
                    {selectedPlan === service.id ? (
                      <>
                        <CreditCard className="w-4 h-4 mr-2 animate-pulse" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Get Started
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Business Managed IT - Call for Quote */}
          <Card className="mt-8 max-w-4xl mx-auto bg-primary/5 border-2 border-primary/30">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-black">Business Managed IT</h3>
                  <p className="text-muted-foreground text-lg">
                    Custom quote based on seat count
                  </p>
                </div>
              </div>
              <p className="text-base text-muted-foreground mb-6">
                We use our own Tactical RMM to manage your business IT infrastructure. Call us for a custom quote tailored to your needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="tel:7632200148" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                  <Phone className="w-5 h-5" />
                  763-220-0148
                </a>
                <a href="mailto:help@easytouse.tech" className="inline-flex items-center gap-2 border-2 border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary/5 transition-colors">
                  <Mail className="w-5 h-5" />
                  Request Quote
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Payment Security Notice */}
          <div className="mt-12 text-center">
            <Card className="max-w-2xl mx-auto bg-muted/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    <span>SSL Encrypted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>PCI Compliant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    <span>Stripe Secured</span>
                  </div>
                </div>
                <p className="mt-4 text-xs text-muted-foreground">
                  We only accept secure online payments through Stripe. No cash or unsecured payments are accepted.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="container mx-auto px-4 py-20 bg-muted/50 -mx-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4">How <span className="text-primary">easy to use .tech</span> Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Get help in just 3 simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Choose Service</h3>
              <p className="text-sm text-muted-foreground">
                Select the service that fits your needs
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Secure Payment</h3>
              <p className="text-sm text-muted-foreground">
                Complete secure checkout via Stripe
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Get Support</h3>
              <p className="text-sm text-muted-foreground">
                Our team helps you remotely or on-site
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4">Contact <span className="text-primary">easy to use .tech</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Have questions? Our support team is here to help you
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Call easy to use .tech</CardTitle>
                    <CardDescription>Speak with our support team</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <a href="tel:7632200148" className="text-xl font-semibold hover:text-primary transition-colors">
                  763-220-0148
                </a>
                <p className="text-sm text-muted-foreground mt-2">
                  Available during business hours
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Email easy to use .tech</CardTitle>
                    <CardDescription>Get help via email</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <a href="mailto:help@easytouse.tech" className="text-xl font-semibold hover:text-primary transition-colors">
                  help@easytouse.tech
                </a>
                <p className="text-sm text-muted-foreground mt-2">
                  We typically respond within 24 hours
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <span className="text-xl font-black tracking-tight">easy to use .tech</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Professional tech support made simple and secure.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>763-220-0148</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>help@easytouse.tech</span>
                </li>
                <li className="pt-2">
                  <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                </li>
                <li>
                  <a href="#" className="text-primary hover:underline">Terms of Service</a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Payment Methods</h4>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="w-4 h-4" />
                <span>All payments secured by Stripe</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                We only accept secure online payments via Stripe. Cash and unsecured payment methods are not accepted.
              </p>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center">
            <p className="text-base font-medium">
              &copy; {new Date().getFullYear()} <span className="font-black text-primary">easy to use .tech</span>. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
