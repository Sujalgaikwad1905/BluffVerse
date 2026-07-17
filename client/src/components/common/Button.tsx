import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant =
  | "primary"
  | "secondary"
  | "danger"
  | "gold"
  | "join"
  | "ready"
  | "play"
  | "pass"
  | "bluff";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: "sm" | "md";
  children: ReactNode;
}

const variantClass: Record<Variant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  danger: "btn-danger",
  gold: "btn-gold",
  join: "btn-join",
  ready: "btn-ready",
  play: "btn-play",
  pass: "btn-pass",
  bluff: "btn-bluff",
};

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: Props) {
  const sizeClass = size === "sm" ? "btn-sm" : "";
  return (
    <button
      className={`btn ${variantClass[variant]} ${sizeClass} ${className}`.trim()}
      {...rest}
    >
      {children}
    </button>
  );
}
