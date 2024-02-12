import Link from "next/link";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { tailwindVariants } from "./MainNavStyles";
import { usePathname } from "next/navigation";

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
  ];
  const { baseStyle, linkStyle } = tailwindVariants();

  return (
    <nav className={cn(baseStyle(), className)} {...props}>
      {links.map((x) => {
        return (
          <Link
            key={x.href}
            href={x.href}
            className={linkStyle({ active: pathName === x.href })}
          >
            {x.content}
          </Link>
        );
      })}
    </nav>
  );
}
