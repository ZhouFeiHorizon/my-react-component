import { css, Theme, useTheme } from "@emotion/react";
import styled from "@emotion/styled";

const StyledButton = styled.button<ButtonProps>`
  ${({
    theme,
    variant = "contained",
    size = "medium",
    fullWidth = false,
  }) => css`
    font-family: inherit;
    font-weight: 500;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    outline: none;
    border: none;
    user-select: none;
    white-space: nowrap;
    text-decoration: none;
    width: ${fullWidth ? "100%" : "auto"};

    ${
      size === "small" &&
      css`
      font-size: 0.875rem;
      padding: ${theme.spacing(0.5)} ${theme.spacing(1)};
    `
    }

    ${
      size === "medium" &&
      css`
      font-size: 1rem;
      padding: ${theme.spacing(1)} ${theme.spacing(2)};
    `
    }

    ${
      size === "large" &&
      css`
      font-size: 1.125rem;
      padding: ${theme.spacing(1.5)} ${theme.spacing(3)};
    `
    }

    ${
      variant === "contained" &&
      css`
      background-color: ${theme.colors.primary};
      color: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);

      &:hover {
        background-color: darken(${theme.colors.primary}, 10%);
      }

      &:active {
        box-shadow: 0 1px 2px rgba(0,0,0,0.2);
      }
    `
    }

    ${
      variant === "outlined" &&
      css`
      background-color: transparent;
      color: ${theme.colors.primary};
      border: 1px solid ${theme.colors.primary};

      &:hover {
        background-color: rgba(${theme.colors.primary}, 0.08);
      }
    `
    }

    ${
      variant === "text" &&
      css`
      background-color: transparent;
      color: ${theme.colors.primary};
      padding: ${theme.spacing(0.5)};

      &:hover {
        background-color: rgba(${theme.colors.primary}, 0.08);
      }
    `
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `}
`;
