'use client';

import { WalletAsset } from "../models";
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
import usrSWR from "swr";

export default function MyWallet(props: {wallet_id: string}) {
  const {data: walletAssets, error} = usrSWR<WalletAsset[]>(
    `http://localhost:3001/api/wallets/${props.wallet_id}/assets`,
    fetcher,
    {
      fallbackData: [],
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
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
