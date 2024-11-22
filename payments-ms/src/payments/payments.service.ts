import { Injectable } from '@nestjs/common';
import { envs } from 'src/config';
import Stripe from 'stripe';
import { PaymentSessionDto } from './dtos';

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
            unit_amount: item.price * 100,
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
}
