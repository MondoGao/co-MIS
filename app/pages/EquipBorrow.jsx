import * as React from 'react';
import * as R from 'ramda';
import { Table, Layout, Spin, Progress, Steps, Button } from 'antd';
import { DateTime } from 'luxon';
import { connect } from 'react-redux';

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
  receiptRef = React.createRef();

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

  renderTable = props => {
    const { equipData } = this.state;
    function renderTime({ hour, minute }) {
      return `${hour} 时 ${minute} 分`;
    }

    console.log(equipData);

    return (
      <Table rowKey="id" bordered dataSource={equipData} {...props}>
        <Column title="名称" dataIndex="name" key="name" />
        <Column title="类型" dataIndex="type.name" key="type" />
        <Column
          title="电子标签编号"
          dataIndex="rfid"
          key="rfid"
          render={text => (text ? text : '无')}
        />
      </Table>
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
            <Button type="primary" onClick={this.startScan}>
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
        render: () => (
          <Fragment>
            {this.renderTable()}
            <Button type="primary" onClick={this.handleConfirm}>
              确认借用
            </Button>
          </Fragment>
        ),
      },
      {
        name: 'finish',
        title: '查看借用单',
        render: () => {
          const { equipData } = this.state;
          const { user } = this.props;
          return (
            <Fragment>
              <div className={styles.receipt} ref={this.receiptRef}>
                <h4>器材借用单</h4>
                <p>
                  <span>
                    日期：{DateTime.local().toLocaleString(
                      DateTime.DATETIME_SHORT,
                    )}
                  </span>
                  <span>借用人：{user.name}</span>
                </p>
                {this.renderTable({ pagination: false })}
                <p>本单据由系统自动生成</p>
              </div>
              <Button
                style={{ marginTop: 20 }}
                type="primary"
                onClick={() => {
                  console.log(this.receiptRef);
                  var divToPrint = this.receiptRef;
                  window.print();
                }}
              >
                打印
              </Button>
            </Fragment>
          );
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

export default connect(state => ({
  user: state.user.current,
}))(EquipBorrow);
