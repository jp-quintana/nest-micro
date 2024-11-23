import { Injectable } from '@nestjs/common';
import { envs } from 'src/config';
import Stripe from 'stripe';
import { PaymentSessionDto } from './dtos';
import { Request, Response } from 'express';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(envs.stripeSecret);

  async createPaymentSession(paymentSessionDto: PaymentSessionDto) {
    const { currency, items } = paymentSessionDto;

    const session = await this.stripe.checkout.sessions.create({
      // order id should go here
      payment_intent_data: {
        metadata: {},
      },
      line_items: items.map((item) => {
        return {
          price_data: {
            currency: currency,
            product_data: {
              name: item.name,
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        };
      }),
      mode: 'payment',
      success_url: 'http://localhost:3003/api/payments/success',
      cancel_url: 'http://localhost:3003/api/payments/cancel',
    });

    return session;
  }

  async handleStripeWebhook(req: Request, res: Response) {
    const sig = req.headers['stripe-signature'];

    let event: Stripe.Event;
    const endpointSecret = '';

    try {
      event = this.stripe.webhooks.constructEvent(
        req['rawBody'],
        sig,
        endpointSecret,
      );
    } catch (error: any) {
      return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    switch (event.type) {
      case 'charge.succeeded':
        const paymentIntentSucceeded = event.data.object;
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    console.log({ event });

    return res.status(200).json({ sig });
  }
}
