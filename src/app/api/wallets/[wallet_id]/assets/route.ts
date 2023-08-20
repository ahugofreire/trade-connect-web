import { isHomeBrokerClosed } from "@/app/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, {params}: {params: {wallet_id: string}}) {
  const response = await fetch(`http://trade-api:3333/wallets/${params.wallet_id}/assets`, {
    //cache: 'no-store', // Processamento sempre dinamico sem o cache no next
    next: {
      revalidate: isHomeBrokerClosed() ? 60 * 60 : 1,
      }
  });
  return NextResponse.json(await response.json());
}
