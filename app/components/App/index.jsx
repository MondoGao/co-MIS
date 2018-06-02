import * as React from "react";
import { Layout, Menu, Icon } from "antd";
import { Route, Switch } from "react-router";
import * as R from "ramda";

import { history } from "../../store/configureStore";
import { mapRouteConfig } from "../../utils/jsxHelpers";
import styles from "./App.scss";

const { Sider, Content, Header } = Layout;

const siderMenuConfig = [
  {
    path: "sport",
    title: "运动",
    children: [
      {
        path: "Monitor",
        title: "运动追踪"
      },
      {
        path: "Data",
        title: "数据查询"
      }
    ]
  },
  {
    path: "space",
    title: "场地",
    children: [
      {
        path: "Reservation",
        title: "预约"
      },
      {
        path: "Borrow",
        title: "借用"
      },
      {
        path: "Edit",
        title: "新增及修改"
      },
      {
        path: "Data",
        title: "数据查询"
      }
    ]
  },
  {
    path: "equipment",
    title: "器材",
    children: [
      {
        path: "Reservation",
        title: "预约"
      },
      {
        path: "Borrow",
        title: "借用"
      },
      {
        path: "Edit",
        title: "新增及修改"
      },
      {
        path: "Data",
        title: "数据查询"
      }
    ]
  }
];

export default class App extends React.Component {
  handleMenuItemSelect = inf => {
    history.push(`${inf.key}`);
  };

  renderMenuItem = ({ item, ctx }) => (
    <Menu.Item key={ctx.basePath + item.path}>
      <span>
        {"icon" in item ? <Icon type={item.icon} /> : null}
        {item.title}
      </span>
    </Menu.Item>
  );

  renderSubMenu = ({ item, ctx, renderLeaf, renderNode }) => {
    const path = ctx.basePath + item.path;
    const childrenEles = mapRouteConfig({
      config: item.children,
      ctx: {
        basePath: path
      },
      renderLeaf,
      renderNode
    });

    const title = renderLeaf({
      item,
      ctx: {
        basePath: path
      },
      renderLeaf,
      renderNode
    }).props.children;

    return (
      <Menu.SubMenu key={path} title={title}>
        {childrenEles}
      </Menu.SubMenu>
    );
  };

  render() {
    const siderMenus = mapRouteConfig({
      config: siderMenuConfig,
      ctx: {
        basePath: ""
      },
      renderNode: this.renderSubMenu,
      renderLeaf: this.renderMenuItem
    });
    const defaultOpenKeys = R.map(R.prop("path"))(siderMenuConfig);

    return (
      <Layout className={styles.app}>
        <Sider className={styles.sider}>
          <Header className={styles.siderHeader}>
            <Icon type="appstore" />
            <h1>体育管理</h1>
          </Header>
          <Menu
            theme="dark"
            defaultSelectedKeys={["sportMonitor"]}
            mode="inline"
            defaultOpenKeys={defaultOpenKeys}
            onSelect={this.handleMenuItemSelect}
          >
            {siderMenus}
          </Menu>
        </Sider>
        <Layout>
          <Header>Header</Header>
          <Content>
            <Switch />
          </Content>
        </Layout>
      </Layout>
    );
  }
}
