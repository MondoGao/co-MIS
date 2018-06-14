import React from 'react';
import { Steps, Layout, Card } from 'antd';
import * as R from 'ramda';
import { DateTime } from 'luxon';

import * as localSence from '@/sources/localSence';
import * as sources from '@/sources';

import CardReader from '@/components/CardReader';
import SportStatus from '@/components/SportStatus';

const { Fragment, Component } = React;
const { Step } = Steps;

export default class SportMonitor extends Component {
  state = {
    currentStage: 1,
    sportRecord: null,
    tracker: null,
  };

  componentDidMount() {
    localSence.initConnection();
  }

  nextStage = () => {
    this.setState(({ currentStage }) => ({
      currentStage: currentStage + 1,
    }));
  };

  restartStage = () => {
    this.setState(({ currentStage }) => ({
      currentStage: 1,
    }));
  };

  updateSportRecord = sportRecord => {
    this.setState({
      sportRecord,
    });
  };

  updateTracker = tracker => {
    this.setState({
      tracker,
    });
  };

  renderBindBand = () => (
    <CardReader
      next={this.nextStage}
      updateSportRecord={this.updateSportRecord}
      updateTracker={this.updateTracker}
      tracker={this.state.tracker}
      sportRecord={this.state.sportRecord}
    />
  );
  renderSportStatus = () => (
    <SportStatus
      next={async () => {
        const { sportRecord } = this.state;
        const newSR = await sources.sports.editSportRecord(
          R.omit(['__typename'], {
            ...sportRecord,
            user: sportRecord.user.id,
            tracker: sportRecord.tracker.id,
            endTime: DateTime.local().toISO(),
          }),
        );
        this.updateSportRecord(newSR);
        this.nextStage();
      }}
      isFinished={false}
      updateSportRecord={this.updateSportRecord}
      sportRecord={this.state.sportRecord}
      tracker={this.state.tracker}
    />
  );
  renderSportResult = () => (
    <SportStatus
      next={this.nextStage}
      isFinished={true}
      sportRecord={this.state.sportRecord}
      restart={this.restartStage}
    />
  );
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
        render: this.renderSportResult,
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
