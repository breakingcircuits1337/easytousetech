import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { db } from '@/lib/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature') || ''

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session

      // Create or get customer
      let customer

      if (session.customer_email) {
        // Find existing customer by email
        const existingCustomer = await db.customer.findUnique({
          where: { email: session.customer_email },
        })

        if (existingCustomer) {
          customer = existingCustomer
        } else {
          // Create new customer
          customer = await db.customer.create({
            data: {
              email: session.customer_email,
              name: session.customer_details?.name || undefined,
            },
          })
        }
      } else if (session.customer) {
        // Try to find customer by Stripe customer ID
        const existingCustomer = await db.customer.findFirst({
          where: {
            orders: {
              some: {
                stripeCustomerId: session.customer as string,
              },
            },
          },
        })

        if (existingCustomer) {
          customer = existingCustomer
        } else {
          // Create new customer with Stripe customer ID
          customer = await db.customer.create({
            data: {
              email: session.customer_details?.email || '',
              name: session.customer_details?.name || undefined,
            },
          })
        }
      }

      // Create order
      const planId = session.metadata?.planId || 'basic'
      await db.order.create({
        data: {
          customerId: customer.id,
          serviceId: planId, // This should match a service ID in your database
          amount: session.amount_total || 0,
          currency: session.currency || 'usd',
          status: 'completed',
          stripeCheckoutId: session.id,
          stripeCustomerId: session.customer as string,
        },
      })

      console.log('Checkout session completed:', session.id)
      break

    case 'checkout.session.expired':
      console.log('Checkout session expired:', event.data.object.id)
      break

    case 'invoice.paid':
      console.log('Invoice paid:', event.data.object.id)
      // You can update subscription status here
      break

    case 'invoice.payment_failed':
      console.log('Invoice payment failed:', event.data.object.id)
      // Handle failed payments
      break

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
