import React from 'react';
import { Layout, Timeline, Button, Alert } from 'antd';

import styles from './SportStatus.scss';

export default class SportStatus extends React.Component {
  state = {
    amapIns: null,
  };
  mapRef = React.createRef();

  componentDidMount() {
    this.mountMap();
  }

  mountMap() {
    const amapIns = new AMap.Map(this.mapRef.current, {
      center: [114.431282, 30.512939],
      zoom: 19,
      zooms: [17, 19],
    });
    this.setState(() => ({
      amapIns,
    }));
  }

  handleFinish = () => {
    this.props.next();
  };

  handleRestart = () => {
    this.props.restart();
  };

  renderTip() {
    if (!this.props.isFinished) {
      return null;
    }

    return <Alert message="成功完成运动!" type="success" showIcon />;
  }
  renderTimeline() {
    const dataStr = '已跑 1 km, 用时 1 分';
    const startTime = 1;

    let timeline = (
      <Timeline pending={dataStr}>
        <Timeline.Item color="green">开始时间: {startTime}</Timeline.Item>
      </Timeline>
    );

    if (this.props.isFinished) {
      timeline = (
        <Timeline>
          <Timeline.Item color="green">开始时间: {startTime}</Timeline.Item>
          <Timeline.Item color="green">{dataStr}</Timeline.Item>
        </Timeline>
      );
    }

    return <div className={styles.timelineContainer}>{timeline}</div>;
  }
  renderButton() {
    if (this.props.isFinished) {
      return <Button onClick={this.handleRestart}>重新开始</Button>;
    }
    return <Button onClick={this.handleFinish}>结束运动</Button>;
  }

  render() {
    return (
      <Layout className={styles.container}>
        {this.renderTip()}
        <div className={styles.mapContainer} ref={this.mapRef} />
        {this.renderTimeline()}
        {this.renderButton()}
      </Layout>
    );
  }
}
