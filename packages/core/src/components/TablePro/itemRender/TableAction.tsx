import { Button, Space, Dropdown } from "@douyinfe/semi-ui";
import type { DropdownItemProps } from "@douyinfe/semi-ui/lib/es/dropdown";
import type { ButtonProps } from "@douyinfe/semi-ui/lib/es/button";
import { IconDelete, IconEdit, IconCopy } from "@douyinfe/semi-icons";

type Type = "primary" | "secondary" | "tertiary" | "warning" | "danger";

export type ActionConfig = {
  /** 操作项标签 */
  label: string;
  show?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 点击回调 */
  onClick?: () => void;

  type?: Type;

  buttonProps?: ButtonProps;
  menuProps?: DropdownItemProps;
  icon?: React.JSX.Element | string;
};

const getIcon = (icon: React.JSX.Element | string | undefined, iconMap?: Record<string, React.ReactNode>) => {
  if (typeof icon === "string" && iconMap) {
    return iconMap[icon] ?? icon;
  }
  return icon;
}

const iconMap = {
  delete: <IconDelete />,
  edit: <IconEdit />,
  copy: <IconCopy />,
};

export interface TableActionProps {
  actions: ActionConfig[];
  maxShowCount?: number;
}

const TableAction = (props: TableActionProps) => {
  const { actions, maxShowCount = 2 } = props;
  const showActions = actions.filter((action) => action.show ?? true);

  const showDropdown = showActions.length > maxShowCount;
  return (
    <Space>
      {showActions.slice(0, maxShowCount).map((action, index) => (
        <Button
          key={index}
          {...action}
          type={action.type ?? "primary"}
          disabled={action.disabled}
          onClick={action.onClick}
          {...action.buttonProps}
          icon={getIcon(action.icon, iconMap)}
        >
          {action.label}
        </Button>
      ))}
      {showDropdown && (
        <Dropdown
          trigger="hover"
          render={
            <Dropdown.Menu>
              {showActions.slice(maxShowCount).map((action, index) => (
                <Dropdown.Item
                  {...action}
                  key={index}
                  disabled={action.disabled}
                  onClick={action.onClick}
                  type={action.type ?? "primary"}
                  {...action.menuProps}
                  icon={getIcon(action.icon, iconMap)}
                >
                  {action.label}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          }
        >
          <Button type="primary">...</Button>
        </Dropdown>
      )}
    </Space>
  );
};

export default TableAction;
