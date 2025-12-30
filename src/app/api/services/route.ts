import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // For now, return hardcoded services
    // In production, you would fetch from the database
    const services = [
      {
        id: 'basic',
        name: 'Basic Support',
        description: 'Perfect for individuals and small home setups',
        price: 29,
        period: 'month',
        features: [
          'Email support within 24 hours',
          'Remote troubleshooting',
          'Software installation help',
          'Basic virus removal',
          '5 support tickets/month',
        ],
        icon: 'HeadphonesIcon',
        popular: false,
      },
      {
        id: 'premium',
        name: 'Premium Support',
        description: 'Best for small businesses and power users',
        price: 59,
        period: 'month',
        features: [
          'Priority email & chat support',
          'Response within 4 hours',
          'Full system optimization',
          'Advanced security setup',
          'Data backup assistance',
          'Unlimited support tickets',
          'Monthly system health check',
        ],
        icon: 'Shield',
        popular: true,
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        description: 'Complete IT support for growing businesses',
        price: 149,
        period: 'month',
        features: [
          '24/7 phone & chat support',
          'Dedicated support team',
          'On-site assistance available',
          'Network management',
          'Server maintenance',
          'Employee training sessions',
          'Custom solutions',
          'SLA guarantee',
        ],
        icon: 'Zap',
        popular: false,
      },
    ]

    return NextResponse.json({ services })
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    )
  }
}
