import React, { useCallback, useState } from 'react';
import { Button, Dimmer, Divider, Form, FormProps, Header, InputOnChangeData, Loader, Message, Segment } from "semantic-ui-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import './LoginPage.scss';

import { toast } from 'react-toastify';
import useLocalUser from '../hooks/useLocalUser';

interface FormFields {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { login, user } = useLocalUser(false);
  const [data, setData] = useState<FormFields>({email: '', password: ''});
  const navigate = useNavigate();

  const onChange = useCallback((e: any, {name, value}: InputOnChangeData) => {
    setData(prevState => ({...prevState, [name]: value}))
  }, [])
  
  const onSubmit = useCallback(async () => {
    try {
      console.log(data)
      const response = await login(data.email, data.password);
      console.log(response)
      if (response.status === 'success') navigate('/tic');
    } catch (e: any) {
      toast.error(e.response.data.message);
    }
  }, [navigate, data, login]);

  if (user) return <Navigate to="/tic" />
  
  return (
    <div className="LoginPage">
      <div className="content">
        <Segment>
          <Header as='h2' textAlign='center'>
            Log in to your account
          </Header>
          <Form onSubmit={onSubmit}>
            <Form.Input label="Email" required name="email" onChange={onChange} />
            <Form.Input label="Password" required name="password" type="password" onChange={onChange} />
            <Button fluid type="submit" content="Submit" size="large" color="black" />
          </Form>
        </Segment>
        <Message>
          Want to join us? <Link to="/register">Setup an account</Link>
        </Message>
      </div>
    </div>
  );
}
