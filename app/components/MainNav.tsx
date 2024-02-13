"use client";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { tailwindVariants } from "./MainNavStyles";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

type NavLink = {
  href: string;
  content: ReactNode;
};

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathName = usePathname();

  const links: NavLink[] = [
    {
      href: "/item",
      content: "Item Query",
    },
    {
      href: "/layout",
      content: "Layout Query",
    },
    {
      href: "/graphql",
      content: "GraphQL Browser",
    },
  ];
  const { baseStyle } = tailwindVariants();

  return (
    <nav className={cn(baseStyle(), className)} {...props}>
      {links.map((x) => {
        return (
          <Button
            key={x.href}
            asChild
            variant={pathName === x.href ? "default" : "ghost"}
          >
            <Link
              href={x.href}
            >
              {x.content}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}
