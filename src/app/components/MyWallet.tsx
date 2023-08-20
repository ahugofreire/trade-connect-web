'use client';

import { Asset, WalletAsset } from "../models";
import { fetcher } from "../utils";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "../components/Flowbite-components";
import Link from "next/link";
import useSWR from "swr";
import useSWRSubscription, { SWRSubscriptionOptions } from "swr/subscription"

export default function MyWallet(props: {wallet_id: string}) {
  const {data: walletAssets, error, mutate: mutateWalletAssets} = useSWR<WalletAsset[]>(
    `http://localhost:3001/api/wallets/${props.wallet_id}/assets`,
    fetcher,
    {
      fallbackData: [],
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const {data: assetsChanged } = useSWRSubscription(
    `http://localhost:3333/assets/events`,
    (path, { next }: SWRSubscriptionOptions<Asset, Error>) => {
      const eventSource = new EventSource(path);

      eventSource.addEventListener('asset-price-changed',async  (event) => {
        const assetsChanged: Asset = JSON.parse(event.data);

        await mutateWalletAssets((prev) => {
          const foundIdex = prev!.findIndex(
            (walletAsset ) =>
              walletAsset.asset_id === assetsChanged.id
          );

          if (foundIdex !== -1) {
            prev![foundIdex!].Asset.price = assetsChanged.price;
          }

          return [...prev!];
        }, false);
        next(null, assetsChanged);
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

  const {data: walletAssetsUpdated } = useSWRSubscription(
    `http://localhost:3333/wallets/${props.wallet_id}/assets/events`,
    (path, { next }: SWRSubscriptionOptions) => {
      const eventSource = new EventSource(path);

      eventSource.addEventListener('wallet-asset-updated',async  (event) => {
        const walletAssetUpdated: WalletAsset = JSON.parse(event.data);

        await mutateWalletAssets((prev) => {
          const foundIdex = prev?.findIndex(
            (walletAsset) =>
              walletAsset.asset_id === walletAssetUpdated.asset_id
          );
          console.log(walletAssetUpdated)
          if (foundIdex !== -1) {
            prev![foundIdex!].shares = walletAssetUpdated.shares;
          }

          return [...prev!];
        }, false);
        next(null, walletAssetUpdated);
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
      <Table>
        <TableHead>
          <TableHeadCell>Nome</TableHeadCell>
          <TableHeadCell>Preço R$</TableHeadCell>
          <TableHeadCell>Quant.</TableHeadCell>
          <TableHeadCell>
            <span className="sr-only">Comprar/Vender</span>
          </TableHeadCell>
        </TableHead>
        <TableBody className="divide-y">
          { walletAssets!.map((walletAsset, key) => (
          <TableRow
              className="bg-write dark:border-gray-700 dark:bg-gray-800"
              key={key}
            >
              <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                { walletAsset.Asset.id} ({ walletAsset.Asset.symbol})
              </TableCell>
              <TableCell>{walletAsset.Asset.price}</TableCell>
              <TableCell>{walletAsset.shares}</TableCell>
              <TableCell>
                {
                  <Link
                    className="font-medium hover:underline text-cyan-500"
                    href={`/${props.wallet_id}/home-broker/${walletAsset.Asset.id}`}
                  >
                    Comprar/Vender
                  </Link>
                }
              </TableCell>
          </TableRow>
        ))}
        </TableBody>
      </Table>
  );
}
