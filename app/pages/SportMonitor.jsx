import React from 'react';
import { Steps, Layout, Card } from 'antd';
import * as R from 'ramda';
import { DateTime } from 'luxon';
import { connect } from 'react-redux';

import * as sources from '@/sources';

import CardReader from '@/components/CardReader';
import SportStatus from '@/components/SportStatus';

const { Fragment, Component } = React;
const { Step } = Steps;

class SportMonitor extends Component {
  state = {
    currentStage: 1,
    sportRecord: null,
    tracker: null,
  };

  componentDidUpdate(prevP, { sportRecord: prevSR }) {
    const { sportRecord } = this.state;
    if (prevSR != null && sportRecord != null) {
      if (sportRecord.path.length != prevSR.path.length) {
        this.uploadSportRecord(sportRecord);
      }
    }
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

  uploadSportRecord = async sportRecord => {
    const newSR = await sources.sports.editSportRecord(
      R.omit(['__typename'], {
        ...sportRecord,
        path: sportRecord.path.map(R.omit(['__typename'])),
        user: sportRecord.user.id,
        tracker: sportRecord.tracker.id,
      }),
    );

    return newSR;
  };

  renderBindBand = () => (
    <CardReader
      next={this.nextStage}
      updateSportRecord={this.updateSportRecord}
      updateTracker={this.updateTracker}
      tracker={this.state.tracker}
      sportRecord={this.state.sportRecord}
      user={this.props.user}
    />
  );
  renderSportStatus = () => (
    <SportStatus
      next={async () => {
        const { sportRecord } = this.state;
        const newSR = await this.uploadSportRecord({
          ...sportRecord,
          endTime: DateTime.local().toISO(),
        });
        this.updateSportRecord(newSR);
        this.nextStage();
      }}
      isFinished={false}
      updateSportRecord={this.updateSportRecord}
      sportRecord={this.state.sportRecord}
      user={this.props.user}
      tracker={this.state.tracker}
    />
  );
  renderSportResult = () => (
    <SportStatus
      next={this.nextStage}
      isFinished={true}
      sportRecord={this.state.sportRecord}
      user={this.props.user}
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

export default connect(state => ({
  user: state.user.current,
}))(SportMonitor);
