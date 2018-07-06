import * as React from 'react';
import * as R from 'ramda';
import { Table, Layout, Spin, Progress, Steps, Button } from 'antd';

import styles from './EquipBorrow.scss';
import * as equips from '@/sources/equips';

const { Fragment } = React;
const { Step } = Steps;
const { ColumnGroup, Column } = Table;

class EquipBorrow extends React.Component {
  state = {
    currentStage: 0,
    isFailed: false,
    equipData: [],
  };

  handleReset = () => {
    this.setState({
      currentStage: 0,
    });
  };

  startScan = async () => {
    this.setState({
      currentStage: 1,
    });

    const equipData = await equips.scanAndView();

    this.setState({
      equipData,
      currentStage: 2,
    });
  };

  handleConfirm = () => {
    this.setState({
      currentStage: 3,
    });
  };

  renderSteps = steps =>
    steps.map(stepOpt => (
      <Step
        title={stepOpt.title}
        description={stepOpt.desc}
        key={stepOpt.name}
      />
    ));
  renderContent = steps => steps[this.state.currentStage].render();

  renderTable = () => {
    const { equipData } = this.state;
    function renderTime({ hour, minute }) {
      return `${hour} 时 ${minute} 分`;
    }

    console.log(equipData);

    return (
      <Fragment>
        <Table rowKey="id" bordered dataSource={equipData}>
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
        <Button type="primary" onClick={this.handleConfirm}>
          确认借用
        </Button>
      </Fragment>
    );
  };
  render() {
    const { currentStage, isFailed } = this.state;
    const steps = [
      {
        name: 'start',
        title: '开始',
        render: () => (
          <Fragment>
            <p className={styles.readyTip}>
              请准备好你要借的器材，并找到其上的标签所在处
            </p>
            <Button primary onClick={this.startScan}>
              开始借用
            </Button>
          </Fragment>
        ),
      },
      {
        name: 'scan',
        title: '扫描电子标签',
        render: () => (
          <div className={styles.scanTip}>
            <Spin size="small" />扫描中
          </div>
        ),
      },
      {
        name: 'confirm',
        title: '确认设备信息',
        render: this.renderTable,
      },
      {
        name: 'finish',
        title: '查看借用单',
        render: () => {
          return '';
        },
      },
    ];

    return (
      <div className={styles.container}>
        <Steps current={currentStage}>{this.renderSteps(steps)}</Steps>
        <div className={styles.content}>
          {this.renderContent(steps)}
          {currentStage >= 2 || (currentStage > 0 && isFailed) ? (
            <Button style={{ marginTop: 10 }} onClick={this.handleReset}>
              重新开始
            </Button>
          ) : null}
        </div>
      </div>
    );
  }
}

export default EquipBorrow;
