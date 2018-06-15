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

    const rfidFilters = R.uniq(data.map(({ rfid }) => rfid)).map(name => {
      if (name == null) {
        return {
          text: '无标签',
          value: 'none',
        };
      }
      return {
        text: name,
        value: name,
      };
    });

    const typeFilters = R.uniq(data.map(({ type }) => type.name)).map(name => ({
      text: name,
      value: name,
    }));

    return (
      <Fragment>
        <Button loading={isLoading} onClick={this.loadData}>
          刷新
        </Button>
        <Divider />
        <Table rowKey="id" bordered dataSource={data} loading={isLoading}>
          <Column title="器材编号" dataIndex="id" key="id" />
          <Column title="名称" dataIndex="name" key="name" />
          <Column
            title="类型"
            dataIndex="type.name"
            key="type"
            filters={typeFilters}
            onFilter={(value, record) => record.type.name.indexOf(value) === 0}
          />
          <Column
            title="电子标签编号"
            dataIndex="rfid"
            key="rfid"
            render={text => (text ? text : '无')}
            filters={rfidFilters}
            onFilter={(value, record) => {
              if (value === 'none') {
                return record.rfid == null;
              }

              if (record.rfid == null) {
                return false;
              }

              return record.rfid.indexOf(value) === 0;
            }}
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
