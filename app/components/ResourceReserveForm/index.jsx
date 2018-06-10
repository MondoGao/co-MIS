import React from 'react';
import { Form, Input } from 'antd';

class ResourceReserveForm extends React.Component {
  render() {
    const { form } = this.props;
    console.log(this.props);
    const { getFieldDecorator } = form;
    return (
      <Form>
        <Form.Item label="E-mail">
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ],
          })(<Input />)}
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create()(ResourceReserveForm);
