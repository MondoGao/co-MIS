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
    } catch (e) {
      console.log(e);
      error();
      message.error('登录失败，请重试');
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
