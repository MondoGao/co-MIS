import * as React from 'react';
import * as R from 'ramda';
import { connect } from 'react-redux';
import { Form, Button, Modal, Input, Row, Col, message } from 'antd';

import { login, add } from '@/sources/user';
import * as cards from '@/sources/cards';
import { actions } from '@/reducers/user';

const FormItem = Form.Item;

class LoginForm extends React.Component {
  state = {
    isLogining: false,
    isSignuping: false,
    isScanning: false,
    isModalVisible: false,
  };

  handleLoginClick = async () => {
    if (this.state.isLogining) {
      return;
    }

    const { loginAction } = this.props;

    this.setState({
      isLogining: true,
    });

    const hide = message.loading('请将校园卡放在读卡器上进行读写', 0);

    const error = () => {
      hide();
      this.setState({
        isLogining: false,
      });
    };

    try {
      const data = await login();
      const user = R.path(['users', 0], data);

      if (!user) {
        error();
        message.error('此用户未注册！');
        return;
      }

      loginAction(user);
      hide();
      message.success('登录成功！');
    } catch (e) {
      console.log(e);
      error();
      message.error('登录失败，请重试');
    }
  };
  handleSignupClick = () => {
    this.setState({
      isModalVisible: true,
    });
  };

  handleModalCancel = () => {
    this.setState({
      isModalVisible: false,
    });
  };

  async uploadData(user) {
    this.setState({
      isSignuping: true,
    });

    await add(user);

    message.success('注册成功！请重新登录');

    this.setState({
      isSignuping: false,
    });

    this.props.form.resetFields();
    this.handleModalCancel();
  }

  handleModalOk = () => {
    this.props.form.validateFields((err, values) => {
      if (err) {
        message.error('表单不完整，请检查');
        return;
      }

      const user = {
        name: values.name,
        rfid: values.rfid,
      };

      console.log(user);
      this.uploadData(user);
    });
  };

  scanRfid = async () => {
    this.setState({
      isScanning: true,
    });

    const hideMsg = message.loading('扫描电子标签中', 0);
    try {
      const arr = await cards.getCards();

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

  renderSignupForm() {
    const { isModalVisible, isSignuping, isScanning } = this.state;
    const { getFieldDecorator } = this.props.form;

    return (
      <Modal
        visible={isModalVisible}
        loading={isSignuping}
        title="注册"
        okText="提交"
        onCancel={this.handleModalCancel}
        onOk={this.handleModalOk}
      >
        <Form layout="vertical">
          <FormItem label="用户名">
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: '请输入用户名！',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="电子标签编号">
            <Row gutter={8}>
              <Col span={16}>
                {getFieldDecorator('rfid', {
                  rules: [
                    {
                      required: true,
                      message: '请输入电子标签编号',
                    },
                  ],
                })(<Input disabled={isScanning || isSignuping} />)}
              </Col>
              <Col span={8}>
                <Button
                  disabled={isSignuping}
                  loading={isScanning}
                  onClick={this.scanRfid}
                >
                  扫描电子标签
                </Button>
              </Col>
            </Row>
          </FormItem>
        </Form>
      </Modal>
    );
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { isLogining, isSignuping } = this.state;

    return (
      <div>
        <Button.Group size="big">
          <Button loading={isLogining} onClick={this.handleLoginClick}>
            登录
          </Button>
          <Button loading={isSignuping} onClick={this.handleSignupClick}>
            注册
          </Button>
        </Button.Group>
        {this.renderSignupForm()}
      </div>
    );
  }
}

export default R.compose(
  connect(
    null,
    {
      loginAction: actions.user.login,
    },
  ),
  Form.create(),
)(LoginForm);
