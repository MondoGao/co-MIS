import React from 'react';
import { Progress, Spin, Layout } from 'antd';

import * as sources from '@/sources';

import styles from './CardReader.scss';

const stages = [
  {
    percent: 33,
    text: '扫描设备中...',
  },
  {
    percent: 66,
    text: '綁定设备中...',
  },
  {
    percent: 100,
    text: '綁定完成, 开始运动吧~',
  },
];

export default class CardReader extends React.Component {
  state = {
    stage: 0,
  };

  render() {
    const { percent, text } = stages[this.state.stage];

    return (
      <Layout className={styles.container}>
        <Progress type="circle" percent={percent} />
        <div className={styles.tipWrapper}>
          <Spin size="small" />
          <span className={styles.tipText}>{text}</span>
        </div>
      </Layout>
    );
  }
}
