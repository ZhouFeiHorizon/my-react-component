// src/components/FormattedNumber/index.tsx

import React from "react";
import {
  formatNumberResult,
  type NumberFormatOptions,
  type NumberPart,
  type NumberPartType,
} from "../../../utils/format/simpleFormatNumber";
import { Tooltip } from "@douyinfe/semi-ui";

/**
 * 数字显示组件 - 支持各部分独立样式
 */
export interface FormattedNumberProps
  extends Omit<NumberFormatOptions, "style"> {
  value: number;
  style?: React.CSSProperties;
  className?: string;
  classNames?: Partial<Record<NumberPartType, string>>;
  styles?: Partial<Record<NumberPartType, React.CSSProperties>>;
  renderPart?: (part: NumberPart) => React.ReactNode;

  showTooltip?: "auto" | boolean;

  suffix?: string;
  type?: NumberFormatOptions["style"];
}

export const FormattedNumber: React.FC<FormattedNumberProps> = ({
  value,
  className,
  classNames,
  styles,
  renderPart,
  style,
  showTooltip = "auto",
  suffix,
  type = "decimal",
  ...options
}) => {
  const result = formatNumberResult(value, {
    ...options,
    style: type,
    numberScale:
      options.numberScale ?? (type === "decimal" ? "auto" : undefined),
  });
  if (result.isEmpty) {
    return <span className={className}>{result.formattedNumber}</span>;
  }

  if (renderPart) {
    return (
      <span className={className}>
        {result.parts.map((part) => renderPart(part))}
      </span>
    );
  }

  const content = (
    <span className={className} style={style}>
      {result.parts.map((part, i) => {
        const key = `${part.type}-${part.value}-${i}`;
        return (
          <span
            key={key}
            data-type={part.type}
            className={classNames?.[part.type]}
            style={styles?.[part.type]}
          >
            {part.value}
          </span>
        );
      })}
      {suffix && <span>{suffix}</span>}
    </span>
  );

  if (
    showTooltip === true ||
    (showTooltip === "auto" &&
      ["万", "亿", "万亿"].includes(result.scaleSymbol))
  ) {
    return <Tooltip content={result.number}>{content}</Tooltip>;
  }
  return content;
};

export const CurrencyNumber: React.FC<FormattedNumberProps> = ({
  value,
  className,
  currency = "CNY",
  ...options
}) => {
  return (
    <FormattedNumber
      value={value}
      className={className}
      type="currency"
      currency={currency}
      currencyDisplay="symbol"
      {...options}
    />
  );
};

export const PercentNumber: React.FC<FormattedNumberProps> = ({
  value,
  className,
  ...options
}) => {
  return (
    <FormattedNumber
      value={value}
      className={className}
      type="percent"
      {...options}
    />
  );
};
