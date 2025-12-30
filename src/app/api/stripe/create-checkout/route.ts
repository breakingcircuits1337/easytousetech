import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { db } from '@/lib/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
})

const services = {
  'quick-fix': {
    name: 'Quick Remote Fix',
    price: 4500, // in cents ($45)
    recurring: false,
  },
  'virus-removal': {
    name: 'Virus Removal & Cleanup',
    price: 12900, // in cents ($129)
    recurring: false,
  },
  'onsite-service': {
    name: 'On-Site Service',
    price: 12500, // in cents ($125)
    recurring: false,
  },
  'monthly-peace': {
    name: 'Monthly Peace of Mind',
    price: 2900, // in cents ($29)
    recurring: true,
  },
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { planId, successUrl, cancelUrl } = body

    // Validate planId
    if (!planId || !services[planId as keyof typeof services]) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      )
    }

    const service = services[planId as keyof typeof services]

    // Determine if this is a recurring subscription or one-time payment
    const isRecurring = service.recurring === true

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: service.name,
              description: isRecurring
                ? `${service.name} - Monthly subscription`
                : `${service.name} - One-time payment`,
            },
            unit_amount: service.price,
            ...(isRecurring && {
              recurring: {
                interval: 'month',
              },
            }),
          },
          quantity: 1,
        },
      ],
      mode: isRecurring ? 'subscription' : 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: undefined, // Let Stripe collect email
      billing_address_collection: isRecurring ? 'required' : 'auto',
      metadata: {
        planId,
      },
    })

    // Return the checkout URL
    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
