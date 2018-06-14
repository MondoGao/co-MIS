import React from 'react';
import { Progress, Spin, Layout } from 'antd';

import { delay } from '@/utils';
import * as sources from '@/sources';

import styles from './CardReader.scss';

export default class CardReader extends React.Component {
  state = {
    stage: 0,
    tracker: null,
  };

  stages = [
    {
      percent: 33,
      text: '扫描设备中...',
      process: async () => {
        const tracker = await sources.cards.getTracker();

        console.log('tracker', tracker);

        this.setState({
          tracker,
        });
      },
    },
    {
      percent: 66,
      text: '登记设备中...',
      process: async () => {
        const { tracker } = this.state;
        const sportRecordData = {
          user: '5b212e4e67e4cfea4e52133b',
          tracker: tracker.id,
          path: [],
          startTime: new Date().toISOString(),
        };

        const sportRecord = await sources.sports.editSportRecord(
          sportRecordData,
        );

        console.log(sportRecord);

        this.props.updateSportRecord(sportRecord);
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

  componentDidUpdate(prevProps, { stage: prevStage }) {
    if (prevStage !== this.state.stage) {
      this.switchStage();
    }
  }

  complete = () => {
    this.props.next();
  };

  async switchStage() {
    const { process, complete } = this.stages[this.state.stage];

    await process();

    if (complete) {
      return;
    }

    this.setState(({ stage }) => ({
      stage: stage + 1,
    }));
  }

  render() {
    const { percent, text } = this.stages[this.state.stage];
    const isSpinShowing = percent < 100;

    return (
      <Layout className={styles.container}>
        <Progress type="circle" percent={percent} />
        <div className={styles.tipWrapper}>
          {isSpinShowing ? <Spin size="small" /> : null}
          <span className={styles.tipText}>{text}</span>
        </div>
      </Layout>
    );
  }
}
