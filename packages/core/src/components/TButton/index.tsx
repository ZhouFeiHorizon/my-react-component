import React from "react";
import { styled } from "../../../styled-system/jsx";

const Button = styled(
  "button",
  {
    base: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      verticalAlign: "middle",
      outline: "none",
      border: "none",
      userSelect: "none",
      appearance: "none",
      whiteSpace: "nowrap",
      position: "relative",
      cursor: "pointer",
      borderRadius: 6,
      boxSizing: "border-box",
    },
    // --variant-containedColor
    variants: {
      variant: {
        solid: {
          // backgroundColor: "var(--variant-bg)",
          // color: "var(--variant-color)",
          // bg: "colorPalette.solid",
          // color: "colorPalette.contrast",

          bg: "colorPalette.solid",
          color: "colorPalette.contrast",
          borderColor: "transparent",
        },
      },
      theme: {
        blue: {
          bg: "colorPalette.blue.500",
          color: "#fff",
        },
        gray: {
          bg: "gray.500",
          color: "white",
        },
        white: {
          bg: "white",
          color: "gray.500",
        },
      },

      size: {
        small: {
          padding: "0 8px",
          fontSize: 12,
          height: 28,
        },
        medium: {
          // padding: "0 10px",
          // fontSize: "md",
          // height: "md",
          h: "10",
          minW: "10",
          textStyle: "sm",
          px: "4",
          gap: "2",
        },
        large: {
          padding: "0 12px",
          fontSize: 16,
          height: 36,
        },
      },
    },
  },
  {
    defaultProps: {
      theme: "blue",
      variant: "solid",
      size: "medium",
    },
  }
);

export default Button;
