import { HTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  selected?: boolean;
  dashed?: boolean;
  interactive?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { className, selected, dashed, interactive = false, children, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={clsx(
          "card",
          selected && "card-selected",
          dashed && "border-dashed",
          interactive && "cursor-pointer",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export { Card };
export type { CardProps };
