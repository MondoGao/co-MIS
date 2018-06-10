import React from 'react';
import { Layout, Timeline, Button } from 'antd';

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

  render() {
    return (
      <Layout className={styles.container}>
        <div className={styles.mapContainer} ref={this.mapRef} />
        <div className={styles.timelineContainer}>
          <Timeline pending="已跑 1 km, 用时 1 分">
            <Timeline.Item color="green">开始时间: {1}</Timeline.Item>
          </Timeline>
        </div>
        <Button onClick={this.handleFinish}>结束运动</Button>
      </Layout>
    );
  }
}
