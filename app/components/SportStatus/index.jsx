import React from 'react';
import { Layout } from 'antd';

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
      zoom: 18,
    });
    this.setState(() => ({
      amapIns,
    }));
  }

  render() {
    return (
      <Layout className={styles.container}>
        <div className={styles.mapContainer} ref={this.mapRef} />
        <div>

        </div>
      </Layout>
    );
  }
}
