import React from "react";
import * as R from "ramda";
import { Menu, Icon } from "antd";

export function genSubmenus({ config, basePath = "" }) {
  function getMenuChildren(menuItem) {
    return (
      <span>
        {"icon" in menuItem ? <Icon type={menuItem.icon} /> : null}
        {menuItem.title}
      </span>
    );
  }

  return R.map(menuItem => {
    if ("children" in menuItem) {
      const childrenEles = genSubmenus({
        config: menuItem.children,
        basePath: menuItem.path
      });

      return (
        <Menu.SubMenu
          key={basePath + menuItem.path}
          title={getMenuChildren(menuItem)}
        >
          {childrenEles}
        </Menu.SubMenu>
      );
    }

    return (
      <Menu.Item key={basePath + menuItem.path}>
        {getMenuChildren(menuItem)}
      </Menu.Item>
    );
  })(config);
}
