import * as React from 'react';
import { Layout, Menu, Icon, Breadcrumb } from 'antd';
import { Route, Switch, Redirect } from 'react-router';
import * as R from 'ramda';

import { history } from '@/store/configureStore';
import { mapRouteConfig } from '@/utils/jsxHelpers';
import styles from './App.scss';

import SportMonitor from '@/pages/SportMonitor';
import SportData from '@/pages/SportData';
import SpaceReservation from '@/pages/SpaceReservation';

const { Sider, Content, Header } = Layout;

const commonChildren = [
  {
    path: 'Reservation',
    title: '预约',
    desc: '提前预约空闲资源',
    component: SpaceReservation,
  },
  {
    path: 'Borrow',
    title: '借用',
    desc: '借用资源，之前预约过会自动为你提升借用上限',
  },
  {
    path: 'Edit',
    title: '新增及修改',
    desc: '新登记或修改现有资源并绑定电子标签',
  },
  {
    path: 'Data',
    title: '数据查询',
    desc: '查询借用、预约数据',
  },
];

const siderMenuConfig = [
  {
    path: 'sport',
    title: '运动',
    children: [
      {
        path: 'Monitor',
        title: '运动追踪',
        desc: '运动打卡及路径追踪',
        component: SportMonitor,
      },
      {
        path: 'Data',
        title: '数据查询',
        desc: '查询运动数据',
        component: SportData,
      },
    ],
  },
  {
    path: 'space',
    title: '场地',
    children: commonChildren,
  },
  {
    path: 'equipment',
    title: '器材',
    children: commonChildren,
  },
];

export default class App extends React.Component {
  handleMenuItemSelect = inf => {
    history.push(`${inf.key}`);
  };

  renderRoutes = ({ item, ctx, renderNode }) => {
    const path = ctx.basePath + item.path;

    if ('children' in item) {
      return R.map(
        subItem =>
          renderNode({
            item: subItem,
            ctx: {
              basePath: path,
            },
            renderNode,
          }),
        item.children,
      );
    }

    return (
      <Route
        path={`/${path}`}
        key={path}
        render={routeProps => {
          let comp = item.title;
          if ('component' in item) {
            const Comp = item.component;
            comp = <Comp {...routeProps} />;
          }

          return (
            <Layout className={styles.pageLayout}>
              <Header className={styles.pageHeader}>
                <h2>{item.title}</h2>
                <p>{item.desc}</p>
              </Header>
              <Content className={styles.pageContent}>{comp}</Content>
            </Layout>
          );
        }}
      />
    );
  };

  renderMenuItem = ({ item, ctx }) => (
    <Menu.Item key={ctx.basePath + item.path}>
      <span>
        {'icon' in item ? <Icon type={item.icon} /> : null}
        {item.title}
      </span>
    </Menu.Item>
  );

  renderSubMenu = ({ item, ctx, renderLeaf, renderNode }) => {
    const path = ctx.basePath + item.path;
    const childrenEles = mapRouteConfig({
      config: item.children,
      ctx: {
        basePath: path,
      },
      renderLeaf,
      renderNode,
    });

    const title = renderLeaf({
      item,
      ctx: {
        basePath: path,
      },
      renderLeaf,
      renderNode,
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
        basePath: '',
      },
      renderNode: this.renderSubMenu,
      renderLeaf: this.renderMenuItem,
    });
    const routes = R.flatten(
      mapRouteConfig({
        config: siderMenuConfig,
        ctx: {
          basePath: '',
        },
        renderNode: this.renderRoutes,
        renderLeaf: this.renderRoutes,
      }),
    );
    const defaultOpenKeys = R.map(R.prop('path'))(siderMenuConfig);
    const defaultPath = 'spaceReservation';

    return (
      <Layout className={styles.app}>
        <Sider className={styles.sider}>
          <Header className={styles.siderHeader}>
            <Icon type="appstore" />
            <h1>体育管理</h1>
          </Header>
          <Menu
            theme="dark"
            defaultSelectedKeys={[defaultPath]}
            mode="inline"
            defaultOpenKeys={defaultOpenKeys}
            onSelect={this.handleMenuItemSelect}
          >
            {siderMenus}
          </Menu>
        </Sider>
        <Layout>
          <Header className={styles.mainHeader}>Header</Header>
          <Content>
            <Switch>
              {routes}
              <Redirect exact path="/" to={defaultPath} />
            </Switch>
          </Content>
        </Layout>
      </Layout>
    );
  }
}
