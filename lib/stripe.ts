import Stripe from 'stripe';
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', { apiVersion: '2024-06-20' });
export function formatPrice(amount:number):string{return new Intl.NumberFormat('en-IE',{style:'currency',currency:'EUR'}).format(Number(amount)||0)}
