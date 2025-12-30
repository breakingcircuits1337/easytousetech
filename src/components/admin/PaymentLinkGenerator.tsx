'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Copy, Link as LinkIcon, Lock } from 'lucide-react'
import { toast } from 'sonner'

export default function PaymentLinkGenerator() {
  const [email, setEmail] = useState('')
  const [planId, setPlanId] = useState('premium')
  const [loading, setLoading] = useState(false)
  const [generatedLink, setGeneratedLink] = useState('')

  const handleGenerateLink = async () => {
    if (!email) {
      toast.error('Please enter a customer email')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/payments/create-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          customerEmail: email,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate payment link')
      }

      setGeneratedLink(data.paymentLinkUrl)
      toast.success('Payment link generated successfully!')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to generate payment link')
    } finally {
      setLoading(false)
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink)
      toast.success('Link copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy link')
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Lock className="w-5 h-5 text-primary" />
          <CardTitle>Generate Secure Payment Link</CardTitle>
        </div>
        <CardDescription>
          Create a secure Stripe payment link for a customer. Links are only processed through Stripe's secure checkout.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Customer Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="customer@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="plan">Select Plan</Label>
          <Select value={planId} onValueChange={setPlanId}>
            <SelectTrigger id="plan">
              <SelectValue placeholder="Select a plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">Basic Support - $29/month</SelectItem>
              <SelectItem value="premium">Premium Support - $59/month</SelectItem>
              <SelectItem value="enterprise">Enterprise - $149/month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleGenerateLink}
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <LinkIcon className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <LinkIcon className="w-4 h-4 mr-2" />
              Generate Secure Link
            </>
          )}
        </Button>

        {generatedLink && (
          <div className="space-y-2 p-4 bg-muted rounded-lg">
            <Label>Generated Payment Link</Label>
            <div className="flex gap-2">
              <Input
                value={generatedLink}
                readOnly
                className="flex-1"
              />
              <Button
                onClick={handleCopyLink}
                variant="outline"
                size="icon"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              This is a secure Stripe payment link. Share this link with the customer to complete their payment.
            </p>
          </div>
        )}

        <div className="p-4 bg-primary/10 rounded-lg">
          <h4 className="font-semibold mb-2 text-sm">Security Notice</h4>
          <p className="text-xs text-muted-foreground">
            All payments are processed through Stripe's secure checkout. We do not accept cash or unsecured payment methods.
            This ensures PCI-DSS compliance and protects customer payment information.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
