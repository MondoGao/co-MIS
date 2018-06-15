import * as React from 'react';
import * as R from 'ramda';
import {
  Form,
  Input,
  Select,
  Row,
  Col,
  Button,
  message,
  TimePicker,
} from 'antd';

import { equips, cards } from '@/sources';

const { Item } = Form;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

class EquipAdd extends React.Component {
  state = {
    types: [],
    isLoading: true,
    isScanning: false,
  };
  componentDidMount() {
    this.loadData();
  }

  loadData = async () => {
    this.setState({
      isLoading: true,
    });

    const hideMsg = message.loading('加载数据中', 0);

    const types = await equips.queryTypeData();
    this.setState({
      types,
    });

    this.setState({
      isLoading: false,
    });

    hideMsg();
  };

  scanRfid = async () => {
    this.setState({
      isScanning: true,
    });

    const hideMsg = message.loading('扫描电子标签中', 0);
    try {
      const arr = await cards.getCards(1);

      this.props.form.setFieldsValue({
        rfid: arr[0].EPCString,
      });
    } catch (e) {
      message.error(e.message);
    }

    this.setState({
      isScanning: false,
    });
    hideMsg();
  };

  async uploadData(equip) {
    this.setState({
      isLoading: true,
    });

    await equips.edit(equip);

    message.success('增加器材成功！');

    this.setState({
      isLoading: false,
    });

    this.reset();
  }

  reset = () => {
    this.props.form.resetFields();
  };

  submit = () => {
    this.props.form.validateFields((err, values) => {
      if (err) {
        message.error('表单不完整，请检查');
        return;
      }

      if (values.timeStart.diff(values.timeEnd) > 0) {
        message.error('开始时间不能大于结束时间');
        return;
      }

      const equip = {
        ...R.omit(['timeStart', 'timeEnd'], values),
        isAvaliable: true,
        avaliableDuration: {
          start: {
            hour: values.timeStart.hour(),
            minute: values.timeStart.minute(),
          },
          end: {
            hour: values.timeEnd.hour(),
            minute: values.timeEnd.minute(),
          },
        },
      };

      console.log(equip);
      this.uploadData(equip);
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { isScanning, isLoading, types } = this.state;

    return (
      <div style={{ padding: '0 30px' }}>
        <Form>
          <Item {...formItemLayout} label="器材名称">
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: '请输入名称',
                },
              ],
            })(<Input disabled={isLoading} />)}
          </Item>
          <Item {...formItemLayout} label="器材类型">
            {getFieldDecorator('type', {
              rules: [
                {
                  required: true,
                  message: '请输入类型',
                },
              ],
            })(
              <Select disabled={isLoading}>
                {types.map(type => (
                  <Option key={type.id} value={type.id}>
                    {type.name}
                  </Option>
                ))}
              </Select>,
            )}
          </Item>
          <Item {...formItemLayout} label="电子标签编号">
            <Row gutter={8}>
              <Col span={12}>
                {getFieldDecorator('rfid', {
                  rules: [
                    {
                      required: true,
                      message: '请输入电子标签编号',
                    },
                  ],
                })(<Input disabled={isScanning || isLoading} />)}
              </Col>
              <Col span={12}>
                <Button
                  disabled={isLoading}
                  loading={isScanning}
                  onClick={this.scanRfid}
                >
                  扫描电子标签
                </Button>
              </Col>
            </Row>
          </Item>
          <Item {...formItemLayout} label="可用时间起点">
            {getFieldDecorator('timeStart', {
              rules: [
                {
                  required: true,
                  message: '请输入时间起点',
                },
              ],
            })(<TimePicker format="HH:mm" minuteStep={15} />)}
          </Item>
          <Item {...formItemLayout} label="可用时间终点">
            {getFieldDecorator('timeEnd', {
              rules: [
                {
                  required: true,
                  message: '请输入时间终点',
                },
              ],
            })(<TimePicker format="HH:mm" minuteStep={15} />)}
          </Item>
          <Item {...tailFormItemLayout}>
            <Button.Group>
              <Button loading={isLoading} type="primary" onClick={this.submit}>
                提交
              </Button>
              <Button disabled={isLoading} onClick={this.reset}>
                重置
              </Button>
            </Button.Group>
          </Item>
        </Form>
      </div>
    );
  }
}

export default Form.create()(EquipAdd);
