"use client";

import { MutableRefObject, useRef } from "react";
import useSWR from "swr";
import useSWRSubscription, { SWRSubscriptionOptions } from "swr/subscription";
import { ChartComponent, ChartComponentRef } from "./ChartComponents";
import { fetcher } from "../utils";
import { AssetDaily } from "../models";


export const AssetChartComponent = (props: { asset_id: string}) => {

  const chartRef = useRef() as MutableRefObject<ChartComponentRef>;

  // TODO: implementar na api do nextjs para trabalhar após as 18h
  const { data: asset, mutate } = useSWR(
    `http://localhost:3333/assets/${props.asset_id}`,
    fetcher,
    {
      fallbackData: {id: props.asset_id, price: 0},
    }
  );

  const { data: assetDaily } = useSWRSubscription(
    `http://localhost:3333/assets/${props.asset_id}/daily/events`,
    (path, { next }: SWRSubscriptionOptions) => {

      const eventSource = new EventSource(path);
      eventSource.addEventListener("asset-daily-created", async (event) => {
        const assetDailyCreated: AssetDaily = JSON.parse(event.data);

        chartRef.current.update({
          time: new Date(assetDailyCreated.date).getTime(),
          value: assetDailyCreated.price,
        });
        await mutate(
          {id: assetDailyCreated.id, price: assetDailyCreated.price },
          false,
        );
        next(null, assetDailyCreated);
      });

      eventSource.onerror = (error) => {
        console.error(error);
        eventSource.close();
      };
      return () => {
        eventSource.close();
      };
    }
  )

  return <ChartComponent header={`${props.asset_id} - R$ ${asset.price}`} ref={chartRef} />;
};
