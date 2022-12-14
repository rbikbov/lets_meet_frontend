import {
  ChannelNameWithParams,
  Consumer,
  createConsumer,
  Mixin,
  Subscription,
} from '@rails/actioncable';

import { CONFIG } from '@/config';
import type { Ref } from 'vue';
import type { Message, Notification } from './api';

// Specify a different URL to connect to
// createConsumer('https://ws.example.com/cable');

// const getWebSocketURL = (token: string) =>
//   `${CONFIG.CABLE_API_HOST}?token=${token}`;

interface TypedMixin<E> extends Mixin {
  received?(data: E): void;
}

let _consumer: Consumer | null = null;

function getConsumer() {
  // if (!params.isAuthenticated.value) {
  //   return null;
  // }

  if (!_consumer) {
    // _consumer = createConsumer(getWebSocketURL(params.accessToken.value!));
    _consumer = createConsumer(CONFIG.CABLE_API_HOST);
  }

  return _consumer;
}

function _subscribeToChannel<M, E>(
  channelNameWithParams: ChannelNameWithParams,
  mixin?: TypedMixin<E> & M
): (Subscription<Consumer> & TypedMixin<E> & M) | null {
  const consumer = getConsumer();

  if (!consumer) {
    throw new Error('consumer is not ready');
  }

  return consumer.subscriptions.create(channelNameWithParams, mixin);
}

function _unsubscribeFromChannel<M, E>(
  channelNameWithParams: ChannelNameWithParams,
  mixin?: TypedMixin<E> & M
): (Subscription<Consumer> & TypedMixin<E> & M) | null {
  const consumer = getConsumer();

  if (!consumer) {
    throw new Error('consumer is not ready');
  }

  return consumer.subscriptions.create(channelNameWithParams, mixin);
}

type SubscribeToNamedChannel<M, E> = (
  mixin: TypedMixin<E> & M
) => ReturnType<Consumer['subscriptions']['create']> | null;

export const useActionCable = (params: {
  accessToken: Ref<string | null>;
  // isAuthenticated: Ref<boolean>;
}) => {
  const subscribeToMessagesChannel: SubscribeToNamedChannel<
    unknown,
    { message: Message }
  > = (mixin) => {
    return _subscribeToChannel(
      {
        channel: 'MessagesChannel',
        token: params.accessToken.value,
      },
      mixin
    );
  };

  // const unsubscribeFromMessagesChannel = () => {
  //   _consumer?.subscriptions.subscriptions.
  // }

  const subscribeToNotificationsChannel: SubscribeToNamedChannel<
    unknown,
    { notification: Notification }
  > = (mixin) => {
    return _subscribeToChannel(
      {
        channel: 'NotificationsChannel',
        token: params.accessToken.value,
      },
      mixin
    );
  };

  return {
    subscribeToMessagesChannel,
    subscribeToNotificationsChannel,
  };
};
