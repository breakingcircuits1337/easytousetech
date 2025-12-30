import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { db } from '@/lib/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-12-15.clover',
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
    const { planId, customerEmail } = body

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

    // Create Stripe Price
    const price = await stripe.prices.create({
      currency: 'usd',
      unit_amount: service.price,
      product_data: {
        name: service.name,
        description: isRecurring
          ? `${service.name} - Monthly subscription`
          : `${service.name} - One-time payment`,
      },
      ...(isRecurring && {
        recurring: {
          interval: 'month',
        },
      }),
    })

    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      after_completion: {
        type: 'redirect',
        redirect: {
          url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/?success=true`,
        },
      },
      allow_promotion_codes: false,
      metadata: {
        planId,
      },
    })

    // If customer email is provided, we can track it
    if (customerEmail) {
      // Create or get customer
      let customer

      const existingCustomer = await db.customer.findUnique({
        where: { email: customerEmail },
      })

      if (existingCustomer) {
        customer = existingCustomer
      } else {
        customer = await db.customer.create({
          data: {
            email: customerEmail,
          },
        })
      }

      // In a real app, you might want to associate this payment link with the customer
      // For now, we'll just log it
      console.log(`Payment link created for customer: ${customer.id}`)
    }

    return NextResponse.json({
      paymentLinkUrl: paymentLink.url,
      paymentLinkId: paymentLink.id,
    })
  } catch (error) {
    console.error('Payment link creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment link' },
      { status: 500 }
    )
  }
}
