import { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import Logo from '../../assets/img/pizza-logo.svg';
import axios from 'axios';
import { errorHandler, successHandler } from '../../utils/alarmHandler';
import { validateFields } from './validateFields';
import { BASE_URL } from '../../config/global';

const RegisterForm = ({ setShowForm, handleCloseModal }) => {
  const [inputUserName, setInputUserName] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [inputVerifyPassword, setInputVerifyPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Регистрация пользователя
  const register = () => {
    if (!validateFields(inputUserName, inputEmail, inputPassword, inputVerifyPassword)) return;

    let form = new FormData();
    form.append('name', inputUserName);
    form.append('email', inputEmail);
    form.append('password', inputPassword);

    setLoading(true);
    axios
      .post(`${BASE_URL}register`, form, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        successHandler('Вы зарегистрированы!');
        handleCloseModal();
      })
      .catch((error) => {
        if (error) {
          errorHandler(error);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="sign-in__wrapper">
      {/* Form */}
      <Form className="p-4 bg-white rounded">
        {/* Header */}
        <img className="img-thumbnail mx-auto d-block mb-2" src={Logo} alt="logo" />
        <div className="h4 mb-2 text-center">Регистрация</div>

        {/* Имя пользователя */}
        <Form.Group className="mb-2" controlId="Username">
          <Form.Label>Имя пользователя</Form.Label>
          <Form.Control
            type="text"
            value={inputUserName}
            placeholder="Имя пользователя"
            onChange={(e) => setInputUserName(e.target.value)}
            required
          />
        </Form.Group>

        {/* Email */}
        <Form.Group className="mb-2" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="text"
            value={inputEmail}
            placeholder="Email"
            onChange={(e) => setInputEmail(e.target.value)}
            required
          />
        </Form.Group>

        {/* Пароль */}
        <Form.Group className="mb-2" controlId="password">
          <Form.Label>Пароль</Form.Label>
          <Form.Control
            type="password"
            value={inputPassword}
            placeholder="Пароль"
            onChange={(e) => setInputPassword(e.target.value)}
            required
          />
        </Form.Group>

        {/* Подтверждение пароля */}
        <Form.Group className="mb-2" controlId="password">
          <Form.Label>Подтверждение пароля</Form.Label>
          <Form.Control
            type="password"
            value={inputVerifyPassword}
            placeholder="Подтверждение пароля"
            onChange={(e) => setInputVerifyPassword(e.target.value)}
            required
          />
        </Form.Group>
        <br />
        {!loading ? (
          <Button className="w-100" variant="primary" onClick={() => register()}>
            Регистрация
          </Button>
        ) : (
          <Button className="w-100" variant="primary" disabled>
            Регистрация...
          </Button>
        )}
        <div className="d-grid justify-content-end">
          <Button
            className="text-muted px-0"
            variant="link"
            onClick={() => {
              setShowForm('Login');
            }}
          >
            Авторизация
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default RegisterForm;
