import React from 'react';
import { DateTime } from 'luxon';
import * as R from 'ramda';
import _ from 'lodash';
import { Layout, Timeline, Button, Alert } from 'antd';

import styles from './SportStatus.scss';
import * as localSence from '@/sources/localSence';

const centerLngLat = [114.431282, 30.512939];
const startLngLat = [centerLngLat[0] - 0.0005, centerLngLat[1] - 0.001];

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

    if (!this.props.isFinished) {
      localSence.subscribe(this.posDataHandler);
    }
  }

  componentDidUpdate({ sportRecord: prevSR }) {
    const { sportRecord } = this.props;

    if (sportRecord.path.length !== prevSR.path.length) {
      const aPath = sportRecord.path.map(
        ({ x, y }) =>
          new AMap.LngLat(
            startLngLat[0] + x / 800000,
            startLngLat[1] + y / 800000,
          ),
      );
      aPath.unshift(new AMap.LngLat(...startLngLat));

      const aLine = new AMap.Polyline({
        path: aPath,
        borderWeight: 2,
        strokeColor: 'blue',
        lineJoin: 'round',
      });

      this.state.amapIns.add(aLine);
    }
  }

  componentWillUnmount() {
    this.state.amapIns.destroy();
    clearInterval(this.state.timer);
  }

  mapRef = React.createRef();

  posDataHandler = _.throttle(posData => {
    if (this.props.isFinished) {
      return;
    }

    const loc = R.find(
      R.propEq('id', Number(this.props.tracker.channel)),
      posData,
    );
    if (loc) {
      const { sportRecord } = this.props;
      const newSportRecord = {
        ...sportRecord,
        path: [
          ...sportRecord.path,
          {
            x: loc.x,
            y: loc.y,
          },
        ],
      };
      this.props.updateSportRecord(newSportRecord);
    }
  }, 1500);

  mountMap() {
    const amapIns = new AMap.Map(this.mapRef.current, {
      center: centerLngLat,
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
