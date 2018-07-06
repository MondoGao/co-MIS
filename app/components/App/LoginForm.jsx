import * as React from 'react';
import { Form, Input, Icon, Button } from 'antd';

const FormItem = Form.Item;

class LoginForm extends React.Component {
  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div>
        <Button.Group size="big">
          <Button>登录</Button>
          <Button>注册</Button>
        </Button.Group>
      </div>
    );
  }
}

export default Form.create()(LoginForm);
