import React from 'react';
import { Table, Button } from 'antd';

import { sports } from '@/sources';

const { Column, ColumnGroup } = Table;

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

    const newData = await sports.all();
    console.log(newData);

    this.setState({
      data: newData,
      isLoading: false,
    });
  };

  render() {
    const { data, isLoading } = this.state;

    return (
      <Table rowKey="id" bordered dataSource={data} loading={isLoading}>
        <Column title="运动编号" dataIndex="id" key="id" />
        <Column title="开始时间" dataIndex="startTime" key="startTime" />
        <Column title="是否结束" dataIndex="isFinished" key="isFinishes" />
        <Column
          title="操作"
          key="action"
          render={(text, record) => (
            <span>
              <Button>查看路径</Button>
            </span>
          )}
        />
      </Table>
    );
  }
}
