import React from 'react';
import { Steps, Layout } from 'antd';

import CardReader from '../components/CardReader';
import styles from './SportMonitor.scss';

const { Fragment, Component } = React;
const { Step } = Steps;

export default class SportMonitor extends Component {
  state = {
    currentStage: 1,
  };
  renderBindBand = () => <CardReader />;
  renderSteps = steps =>
    steps.map(stepOpt => (
      <Step
        title={stepOpt.title}
        description={stepOpt.desc}
        key={stepOpt.name}
      />
    ));
  renderContent = steps => steps[this.state.currentStage].render();
  render() {
    const { currentStage } = this.state;
    const steps = [
      {
        name: 'login',
        title: '刷卡登录',
        render: () => '未实现',
      },
      {
        name: 'bind',
        title: '綁定运动追踪器',
        render: this.renderBindBand,
      },
      {
        name: 'monitor',
        title: '查看即时数据',
        render: () => '未实现',
      },
      {
        name: 'result',
        title: '运动结果',
        render: () => '未实现',
      },
    ];

    return (
      <Fragment>
        <Steps current={currentStage}>{this.renderSteps(steps)}</Steps>
        <Layout className={styles.contentWrapper}>
          {this.renderContent(steps)}
        </Layout>
      </Fragment>
    );
  }
}
