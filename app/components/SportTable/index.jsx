import React from 'react';
import { Table, Button } from 'antd';
import { DateTime } from 'luxon';

import { sports } from '@/sources';

const { Column, ColumnGroup } = Table;
const { Fragment } = React;

export default class SportTable extends React.Component {
  state = {
    data: [],
    isLoading: true,
  };

  componentDidMount() {
    this.loadData();
  }

  loadData = async () => {
    this.setState({
      isLoading: true,
    });

    const newData = await sports.queryData();
    console.log(newData);

    this.setState({
      data: newData,
      isLoading: false,
    });
  };

  render() {
    const { data, isLoading } = this.state;
    const actons = (
      <Column
        title="操作"
        key="action"
        render={(text, record) => (
          <span>
            <Button>查看路径</Button>
          </span>
        )}
      />
    );

    return (
      <Fragment>
        <Button onClick={this.loadData}>刷新</Button>
        <Table rowKey="id" bordered dataSource={data} loading={isLoading}>
          <Column title="运动编号" dataIndex="id" key="id" />
          <Column
            title="用户名"
            dataIndex="user"
            key="userName"
            render={user => user.name}
          />
          <Column
            title="追踪器编号"
            dataIndex="tracker"
            key="trackerChannel"
            render={tracker => tracker.channel}
          />
          <Column
            title="开始时间"
            dataIndex="startTime"
            key="startTime"
            render={text => {
              return DateTime.fromISO(text).toLocaleString(
                DateTime.DATETIME_SHORT_WITH_SECONDS,
              );
            }}
          />
          <Column
            title="结束时间"
            dataIndex="endTime"
            key="endTime"
            render={text => {
              if (!text) {
                return '未结束';
              }

              return DateTime.fromISO(text).toLocaleString(
                DateTime.DATETIME_SHORT_WITH_SECONDS,
              );
            }}
          />
        </Table>
      </Fragment>
    );
  }
}
