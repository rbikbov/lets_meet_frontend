import { api } from '.';
import type { BuyThirtyCoinsPayload } from './api';

export function buyThirtyCoins(data: BuyThirtyCoinsPayload) {
  return api.api.buyThirtyCoins(data);
}

export function activatePremium() {
  return api.api.activatePremium();
}

export function activateStars() {
  return api.api.activateStars();
}
