import * as React from "react";
import { Layout, Menu, Icon } from "antd";
import * as R from "ramda";

import { history } from "../../store/configureStore";

import styles from "./App.scss";

import { genSubmenus } from "../../utils/jsxHelpers";

const { SubMenu } = Menu;

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
  componentDidMount() {
    // history.push(`sportMonitor`);
  }

  handleMenuItemSelect = inf => {
    history.push(`${inf.key}`);
  };

  render() {
    const siderMenus = genSubmenus({
      config: siderMenuConfig
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
        </Layout>
      </Layout>
    );
  }
}