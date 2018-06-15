import React from 'react';
import { Table, Button, Divider } from 'antd';
import * as R from 'ramda';

import { equips } from '@/sources';

const { Column, ColumnGroup } = Table;
const { Fragment } = React;

export default class EquipData extends React.Component {
  state = {
    data: [],
    isLoading: false,
  };

  componentDidMount() {
    this.loadData();
  }

  loadData = async () => {
    this.setState({
      isLoading: true,
    });

    const newData = await equips.queryData();

    console.log(newData);

    this.setState({
      data: newData,
      isLoading: false,
    });
  };

  render() {
    const { isLoading, data } = this.state;

    function renderTime({ hour, minute }) {
      return `${hour} 时 ${minute} 分`;
    }

    return (
      <Fragment>
        <Button loading={isLoading} onClick={this.loadData}>
          刷新
        </Button>
        <Divider />
        <Table rowKey="id" bordered dataSource={data} loading={isLoading}>
          <Column title="器材编号" dataIndex="id" key="id" />
          <Column title="名称" dataIndex="name" key="name" />
          <Column title="类型" dataIndex="type.name" key="type" />
          <Column
            title="电子标签编号"
            dataIndex="rfid"
            key="rfid"
            render={text => (text ? text : '无')}
          />
          <ColumnGroup title="可用时间">
            <Column
              title="起点"
              dataIndex="avaliableDuration.start"
              key="avaliableDurationStart"
              render={renderTime}
            />
            <Column
              title="终点"
              dataIndex="avaliableDuration.end"
              key="avaliableDurationEnd"
              render={renderTime}
            />
          </ColumnGroup>
        </Table>
      </Fragment>
    );
  }
}
