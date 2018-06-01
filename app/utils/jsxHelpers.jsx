import React from "react";
import * as R from "ramda";
import { Menu, Icon } from "antd";

export function genSubmenus({ config, basePath = "" }) {
  return R.map(menuItem => {
    if ("children" in menuItem) {
      const childrenEles = genSubmenus({ config: menuItem.children, basePath: menuItem.path });

      return (
        <Menu.SubMenu key={basePath + menuItem.path} title={menuItem.title}>
          {childrenEles}
        </Menu.SubMenu>
      );
    }

    return (
      <Menu.Item key={basePath + menuItem.path}>{menuItem.title}</Menu.Item>
    );
  })(config);
}
