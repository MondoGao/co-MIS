import * as React from 'react';
import * as R from 'ramda';
import { connect } from 'react-redux';
import { Form, Button, message } from 'antd';

import { login, add } from '@/sources/user';
import { actions } from '@/reducers/user';

const FormItem = Form.Item;

class LoginForm extends React.Component {
  state = {
    isLogining: false,
    isSignuping: false,
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
      message.error('登录失败，请重试');
      this.setState({
        isLogining: false,
      });
    };

    try {
      const { users } = await login();
      const user = users[0];

      if (!user) {
        error();
      }

      loginAction(user);
    } catch (e) {
      error();
    }
  };
  handleSignupClick = () => {};

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
