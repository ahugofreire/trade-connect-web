"use client";

import { PropsWithChildren, startTransition } from "react";
import  useSWRSubscription, { SWRSubscriptionOptions } from "swr/subscription";
import { revalidateOrders } from "../[wallet_id]/actions/revalidate-ordres";

export function SyncOrders(props: PropsWithChildren<{ wallet_id: string }>) {

  const {data, error } = useSWRSubscription(
    `http://localhost:3333/wallets/${props.wallet_id}/orders/events`,
    (path, { next }: SWRSubscriptionOptions) => {

      const eventSource = new EventSource(path);

      eventSource.addEventListener("order-created", async (event) => {
        const orderCreated = JSON.parse(event.data);

        startTransition(() => {
          revalidateOrders(props.wallet_id);
        });
        next(null, orderCreated);
      });

      eventSource.addEventListener("order-updated", async (event) => {
        const orderUpdated = JSON.parse(event.data);

        startTransition(() => {
          revalidateOrders(props.wallet_id);
        });
        next(null, orderUpdated);
      });

      eventSource.onerror = (error) => {
        console.error(error);
        eventSource.close();
      };

      return () => {
        eventSource.close();
      };
    }
  );

  return (
    <>{props.children}</>
  )
}
