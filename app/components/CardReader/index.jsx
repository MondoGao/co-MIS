import React from 'react';
import { Progress, Button, Spin, Layout, message } from 'antd';

import { delay } from '@/utils';
import * as sources from '@/sources';
import * as localSence from '@/sources/localSence';

import styles from './CardReader.scss';

export default class CardReader extends React.Component {
  state = {
    stage: 0,
    isFailed: false,
  };

  stages = [
    {
      percent: 33,
      text: '扫描设备中...',
      process: async () => {
        const tracker = await sources.cards.getTracker();

        console.log('tracker', tracker);
        await localSence.initConnection();

        this.props.updateTracker(tracker);
      },
    },
    {
      percent: 66,
      text: '登记设备中...',
      process: async () => {
        const { tracker, user } = this.props;

        message.info('读取用户未完成运动中');

        const userRecords = await sources.sports.queryData({
          user: user.id,
        });
        const last = userRecords[userRecords.length - 1];

        console.log(last);

        let sportRecord = {};

        if (!last.endTime) {
          message.info('恢复上次运动记录');
          sportRecord = last;
        } else {
          const sportRecordData = {
            user: user.id,
            tracker: tracker.id,
            path: [],
            startTime: new Date().toISOString(),
          };
          sportRecord = await sources.sports.editSportRecord(sportRecordData);
        }

        console.log(sportRecord);

        this.props.updateSportRecord(sportRecord);
        await delay(1000);
      },
    },
    {
      percent: 100,
      text: '綁定完成, 开始运动吧~',
      process: async () => {
        await delay(2000);
        await this.complete();
      },
      complete: true,
    },
  ];

  componentDidMount() {
    this.switchStage();
  }

  componentDidUpdate(prevProps, { stage: prevStage, isFailed: prevIF }) {
    if (prevStage !== this.state.stage) {
      this.switchStage();
    }

    if (prevIF && !this.state.isFailed) {
      this.switchStage();
    }
  }

  complete = () => {
    this.props.next();
  };

  async switchStage() {
    const { process, complete } = this.stages[this.state.stage];

    try {
      await process();
    } catch (e) {
      this.setState({
        isFailed: true,
      });
    }

    if (complete) {
      return;
    }

    this.setState(({ stage }) => ({
      stage: stage + 1,
    }));
  }

  retry = () => {
    this.setState({
      isFailed: false,
      stage: 1,
    });
  };

  render() {
    const { isFailed, stage } = this.state;
    const { percent, text } = this.stages[stage];
    const isSpinShowing = percent < 100;

    return (
      <Layout className={styles.container}>
        <Progress
          type="circle"
          percent={percent}
          status={isFailed ? 'exception' : isSpinShowing ? 'active' : 'success'}
        />
        <div className={styles.tipWrapper}>
          {isSpinShowing ? <Spin size="small" /> : null}
          <span className={styles.tipText}>{text}</span>

          {isFailed ? <Button onClick={this.retry}>重试</Button> : null}
        </div>
      </Layout>
    );
  }
}
