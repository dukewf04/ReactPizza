import { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import Logo from '../../assets/img/pizza-logo.svg';
import axios from 'axios';
import { errorHandler, successHandler } from '../../utils/alarmHandler';
import { validateFields } from './validateFields';
import UserAuth from '../../services/userAuth/userAuth';
import { BASE_URL } from '../../config/global';

const LoginForm = ({ setShowForm, handleCloseModal }) => {
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Авторизация пользователя
  const login = () => {
    if (!validateFields(null, inputEmail, inputPassword, null)) return;

    let form = new FormData();
    form.append('email', inputEmail);
    form.append('password', inputPassword);

    setLoading(true);
    axios
      .post(`${BASE_URL}login`, form, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        const user = new UserAuth();
        const userName = user.getDecodedData() ? user.getDecodedData().username : null;
        successHandler(`Добро пожаловать${userName ? ' ' + userName : ''}!`);
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
        <div className="h4 mb-2 text-center">Авторизация</div>
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
        <br />
        {!loading ? (
          <Button className="w-100" variant="primary" onClick={() => login()}>
            Войти
          </Button>
        ) : (
          <Button className="w-100" variant="primary" disabled>
            Вход...
          </Button>
        )}
        <div className="d-grid justify-content-end">
          <Button
            className="text-muted px-0"
            variant="link"
            onClick={() => {
              setShowForm('Auth');
            }}
          >
            Не авторизованы?
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default LoginForm;
