export type ButtonSize = "small" | "medium" | "large";

export type ButtonType = "";

type Color =
  | "inherit"
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "info"
  | "warning"
  | string;

interface BaseButtonProps {
  size?: ButtonSize;
  href?: string;
  color?: Color;
  loading?: boolean;
}

type MergedHTMLAttributes = Omit<
  React.HTMLAttributes<HTMLElement> &
    React.ButtonHTMLAttributes<HTMLElement> &
    React.AnchorHTMLAttributes<HTMLElement>,
  "type" | "color"
>;

export interface ButtonProps extends BaseButtonProps, MergedHTMLAttributes {
  href?: string;
  htmlType?: "button" | "submit" | "reset";
  autoInsertSpace?: boolean;
  theme?: ButtonTheme;
}

type Unit = string | number;

export interface ButtonTheme {
  fontWeight?: Unit;
  lineHeight?: Unit;
}

interface GlobalToken {
  color: {
    primary?: string;
  };
}
