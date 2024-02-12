import { tv } from "tailwind-variants";

export const tailwindVariants = tv({
  slots: {
    baseStyle: ["flex", "items-center", "space-x-4", "lg:space-x-6"],
    linkStyle: ["text-sm", "font-medium", "transition-colors", "hover:text-primary"],
  },
  variants: {
    active: {
      true: {
        linkStyle: [],
      },
      false: {
        linkStyle: ["text-muted-foreground"],
      },
    },
  },
});
