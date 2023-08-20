import { revalidateTag } from "next/cache";
import { Button, Label, TextInput } from "../components/Flowbite-components";

async function initTransaction(formData: FormData) {
  'use server';
  const shares = formData.get("shares");
  const price = formData.get("price");
  const wallet_id = formData.get("wallet_id");
  const asset_id = formData.get("asset_id");
  const type = formData.get("type");

  const data = JSON.stringify({
    shares,
    price,
    asset_id,
    wallet_id,
    type,
    status: "OPEN",
    Asset: {
      id: asset_id,
      symbol: "ITSA4",
      price: 10.5,
    }
  });

  const res = await fetch(`http://trade-api:3333/wallets/${wallet_id}/orders`, {
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    body: data,
  });

  revalidateTag(`orders-wallet-${wallet_id}`);
 return res.json();
}


export function OrderForm(props:{ asset_id: string; wallet_id: string; type: 'BUY' | 'SELL'}) {
  return(
    <div>
      <form action={initTransaction}>
        <input name="asset_id" type="hidden" defaultValue={props.asset_id} />
        <input name="wallet_id" type="hidden" defaultValue={props.wallet_id} />
        <input name="type" type="hidden" defaultValue={"BUY"} />
        <div>
          <div className="mb-2 block">
            <Label htmlFor="shares" value="Quantidade" />
          </div>
          <TextInput
            id="shares"
            name="shares"
            required
            type="number"
            min={1}
            step={1}
            defaultValue={1}
          />
        </div>
        <br />
        <div>
          <div className="mb-2 block">
            <Label htmlFor="price" value="Preço R$" />
          </div>
          <TextInput
            id="price"
            name="price"
            required
            type="number"
            min={1}
            step={1}
            defaultValue={1}
          />
        </div>
        <br />
      <Button type="submit" color={props.type === "BUY" ? "success" : "failure"}>
        Confirmar { props.type === "BUY" ? "compra": "venda"}
      </Button>
      </form>
    </div>
  )
}
