import React from 'react';
import { Steps, Layout } from 'antd';

import CardReader from '@/components/CardReader';
import SportStatus from '@/components/SportStatus';
import styles from './SportMonitor.scss';

const { Fragment, Component } = React;
const { Step } = Steps;

export default class SportMonitor extends Component {
  state = {
    currentStage: 2,
  };

  nextStage = () => {
    this.setState(({ currentStage }) => ({
      currentStage: currentStage + 1,
    }));
  };

  renderBindBand = () => <CardReader next={this.nextStage} />;
  renderSportStatus = () => <SportStatus next={this.nextStage} />;
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
        render: this.renderSportStatus,
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
        {this.renderContent(steps)}
      </Fragment>
    );
  }
}
