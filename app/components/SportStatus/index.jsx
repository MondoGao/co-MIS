import React from 'react';
import { DateTime } from 'luxon';
import * as R from 'ramda';
import { Layout, Timeline, Button, Alert } from 'antd';

import styles from './SportStatus.scss';

export default class SportStatus extends React.Component {
  state = {
    amapIns: null,
    nowISO: DateTime.local().toISO(),
    timer: null,
  };

  componentDidMount() {
    this.mountMap();
    this.setState({
      timer: setInterval(() => {
        this.setState({
          nowISO: DateTime.local().toISO(),
        });
      }, 1000),
    });
  }

  componentWillUnmount() {
    this.state.amapIns.destroy();
    clearInterval(this.state.timer);
  }

  mapRef = React.createRef();

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
    const { sportRecord } = this.props;
    const { nowISO } = this.state;

    const { startTime, endTime } = sportRecord;

    const endISO = R.defaultTo(nowISO, endTime);
    const endDt = DateTime.fromISO(endISO);

    const stDt = DateTime.fromISO(sportRecord.startTime);
    const startTimeStr = stDt.toLocaleString(
      DateTime.DATETIME_SHORT_WITH_SECONDS,
    );

    const dr = endDt.diff(stDt, ['minutes', 'seconds', 'hours']).toObject();

    function getTime(num) {
      return Math.round(R.defaultTo(0, num));
    }
    const dataStr = `已用时 ${getTime(dr.hours)} 时 ${getTime(
      dr.minutes,
    )} 分 ${getTime(dr.seconds)} 秒`;

    let timeline = (
      <Timeline pending={dataStr}>
        <Timeline.Item color="green">开始时间: {startTimeStr}</Timeline.Item>
      </Timeline>
    );

    if (this.props.isFinished) {
      timeline = (
        <Timeline>
          <Timeline.Item color="green">开始时间: {startTimeStr}</Timeline.Item>
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
