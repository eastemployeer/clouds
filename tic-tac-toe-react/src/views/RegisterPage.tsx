import React, { FormEvent, useCallback, useState } from "react";
import { Button, Form, FormProps, Header, InputOnChangeData, Message, Segment } from "semantic-ui-react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../utils/api/auth";
import './RegisterPage.scss';

export default function RegisterPage() {
  const [data, setData] = useState({email: '', password: ''});
  const navigate = useNavigate();

  const onChange = useCallback((e: any, {name, value}: InputOnChangeData) => {
    setData(prevState => ({...prevState, [name]: value}))
  }, [])
  
  const onSubmit = useCallback(async () => {
    console.log(data)
    await register(data.email, data.password)
    navigate('/login');
  }, [navigate, data]);
  
  return (
    <div className="RegisterPage">
      <div className="content">
        <Segment>
          <Header as='h2' color='black' textAlign='center'>
            Registration
          </Header>
          <Form onSubmit={onSubmit} >
            <div className="formContainer">
                <Form.Input label="Email" required name="email" onChange={onChange} />
                <Form.Input label="Password" required name="password" type="password" onChange={onChange} />
            </div>
            <Form.Button fluid content="Submit" size="large" color="black" />
          </Form>
        </Segment>
        <Message>
          Already registered? <Link to="/login">Log in</Link>
        </Message>
      </div>
    </div>
  );
}
