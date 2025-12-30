import React from "react";
import type { ButtonProps, ButtonTheme } from "./types";
import styled from "@emotion/styled";
import { css } from "@emotion/react";

const CreateStyledComponent = styled("div");

const directionMap = {
  l: "left",
  r: "right",
  t: "top",
  b: "bottom",
};

const layoutMap = {
  p: "padding",
  m: "margin",
};

const marginMap = new Map([
  ["ml", "marginLeft"],
  ["mr", "marginRight"],
]);

const comStyle = {
  ml: 12,
  p: 12,
};

const componentCls = "button";

const Div = ({ css }: { css: React.CSSProperties }) => <div />;

// ".bar{ font-size:14px;m:10px;padding:10px;mx:10px; &:hover { background:red;margin-right:10px; }}"

const result = css({
  ".bar": {
    fontSize: 14,
    m: 10,
    padding: 10,
    mx: 10,
    "&:hover": {
      background: "red",
      marginRight: 10,
    },
  },
});

console.log(" result: ", result);

const Base = styled(Div)((props) => ({
  ...props.css,
}));

const Flex = (css: React.CSSProperties) => {
  return <Base css={css} />;
};

const ButtonBase = (props: ButtonProps) => {
  const {
    href,
    htmlType = "button",
    className,
    size = "medium",
    color,
    ...reset
  } = props;

  const isLink = href;

  const cls = [
    `css-` + result.name,
    className,
    `${componentCls}-${size}`,
    `${componentCls}-${color}`,
  ].join(" ");

  if (isLink) {
    return <a {...reset} href={href} className={cls} />;
  }

  return <button {...reset} className={cls} type={htmlType} />;
};

const globalTheme = {
  colors: {
    primary: "#1D9FF1",
    danger: "#FB492D",
    success: "",
  },
  hoverColors: {
    primary: "rgba(29, 159, 241, 0.80)",
    danger: "rgba(251, 73, 45, 0.80)",
  },
  disabledColor: {
    primary: "rgba(29, 159, 241, 0.40)",
    danger: "rgba(251, 73, 45, 0.40",
  },
  height: {
    mini: 24,
    small: 28,
    medium: 32,
    large: 40,
  },
};

const genColorButtonStyle = (token: typeof globalTheme) => {
  return {
    [`&.${componentCls}-inherit`]: {
      color: "inherit",
      background: "inherit",
    },
    [`&.${componentCls}-primary`]: {
      background: token.colors.primary,
      color: "#fff",
      borderRadius: 6,
      [`&:hover`]: {
        background: token.hoverColors.primary,
      },
      [`&:disabled`]: {
        background: token.disabledColor.primary,
        borderColor: token.disabledColor.primary,
      },
    },
    [`&.${componentCls}-danger`]: {
      background: token.colors.danger,
      color: "#fff",
      borderRadius: 6,
      [`&:hover`]: {
        background: token.hoverColors.danger,
      },
    },
  };
};

const Vs = styled(ButtonBase);

// const Use = Vs([
//   {
//     fontSize: 14,
//   },
//   {
//     fontFamily: "fantasy",
//   },
// ]);

const Use = Vs(
  {
    fontSize: 20,
  },
  // (props) => ({ color: props.color })
  {
    color: "red",
  }
);

const Button = styled(ButtonBase)(({ theme }) => ({
  // reset
  outline: "none",
  position: "relative",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  whiteSpace: "nowrap",
  textAlign: "center",
  backgroundImage: "none",
  background: "transparent",
  userSelect: "none",
  touchAction: "manipulation",
  fontWeight: 400,
  border: "none",

  height: globalTheme.height.medium,
  padding: "0 12px",
  fontSize: 14,
  boxSizing: "border-box",
  minWidth: 80,

  // size
  [`&.${componentCls}-mini`]: {
    height: globalTheme.height.mini,
    padding: "0 8px",
    fontSize: 12,
    minWidth: 40,
  },
  [`&.${componentCls}-small`]: {
    height: globalTheme.height.small,
    padding: "0 8px",
    fontSize: 12,
    minWidth: 40,
  },
  [`&.${componentCls}-large`]: {
    height: globalTheme.height.large,
    padding: "0 16px",
    minWidth: 96,
  },

  // colors
  ...genColorButtonStyle(globalTheme),

  // disabled
  [`&:disabled`]: {
    cursor: "not-allowed",
  },
}));

export default Button;
