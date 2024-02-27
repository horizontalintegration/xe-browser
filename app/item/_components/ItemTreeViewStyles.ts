import { tv } from "tailwind-variants";

export const tailwindVariants = tv({
  slots: {
    base: [],
    treeNode: [],
  },
  variants: {
    selected: {
      true: {
        treeNode: ["bg-slate-500 dark:bg-slate-400"],
      },
    },
  },
});
