import { Order } from "../models";
import { isHomeBrokerClosed } from "../utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Badge
} from "./Flowbite-components";

async function getOrders(wallet_id: string): Promise<Order[]>{
  const response = await fetch(
    `http://localhost:8000/wallets/${wallet_id}/orders`, {
      next: { tags: [`orders-wallet-${wallet_id}`],
      revalidate: isHomeBrokerClosed() ? 60 * 60 : 5,
      },
    }
  );

  return response.json();
}

export default async function MyOrders(props: {wallet_id: string}) {
  const orders = await getOrders(props.wallet_id);

  return (
    <div>
      <article className="format">
        <h3>Minhas Orders</h3>
      </article>
      <Table className="mt-2">
        <TableHead>
          <TableHeadCell>Ativo</TableHeadCell>
          <TableHeadCell>Quant.</TableHeadCell>
          <TableHeadCell>Preço</TableHeadCell>
          <TableHeadCell>Tipo</TableHeadCell>
          <TableHeadCell>Status</TableHeadCell>
        </TableHead>
        <TableBody>
          {
            orders.map((order, key) => (
              <TableRow
                key={key}
                className="bg-write dark:border-gray-700 dark:bg-gray-800"
              >
                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {order.asset_id}
                </TableCell>
                <TableCell>{order.shares}</TableCell>
                <TableCell>{order.price}</TableCell>
                <TableCell>
                  <Badge>{order.type}</Badge>
                </TableCell>
                <TableCell>
                  <Badge>{order.status}</Badge>
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </div>
  );
}
