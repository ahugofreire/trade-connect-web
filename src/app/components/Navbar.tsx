'use client';

import { Navbar } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";

export default function DefaultNavbar() {
  const pathname = usePathname();
  const params = useParams();

  return (
    <Navbar fluid rounded>
      <Navbar.Brand href="https://flowbite-react.com">
        <Image
          width={37}
          height={40}
          className="mr-3 h-6 sm:h-9"
          alt="React logo"
          src="/logo.png"
        />
        <span className="self-center whitespace-nowrap text-xl font-semibold">
          Trade APP
        </span>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Navbar.Link
          active={pathname === `/${params.wallet_id}`}
          as={Link}
          href={`/${params.wallet_id}`}
        >
          Home
        </Navbar.Link>
        <Navbar.Link href="#">Ativos</Navbar.Link>
      </Navbar.Collapse>
      <div className="flex md:order-2 ">Olá {params.wallet_id}</div>
    </Navbar>
  );
}
