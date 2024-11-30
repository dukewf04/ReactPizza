import { Button, Form, Modal } from 'react-bootstrap';
import { useEffect, useRef } from 'react';
import useState from 'react-usestateref';
import UserAuth from '../../services/userAuth/userAuth';
import axios from 'axios';
import { BASE_URL } from '../../config/global';
import { showError, successHandler } from '../../utils/alarmHandler';
import { useSelector } from 'react-redux';

// Оформление доставки
const ModalDelivery = ({ showModal, setShowModal }) => {
  const user = new UserAuth();
  const [userData, setUserData] = useState({});
  const userId = user.getDecodedData() ? user.getDecodedData().user_id : null;
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const addressRef = useRef(null);
  const phoneRef = useRef(null);
  const [fieldsValid, setFieldsValid, fieldsValidRef] = useState({
    name: true,
    email: true,
    address: true,
    phone: true,
  });
  const { items } = useSelector((state) => state.cart);

  const errorNotification = 'поле обязательно к заполнению';

  // Валидация заполнения формы доставки
  const validateForm = () => {
    setFieldsValid((prev) => ({ ...prev, phone: phoneRef.current.value !== '' }));
    if (!user.isValid()) {
      setFieldsValid((prev) => ({ ...prev, name: nameRef.current.value !== '' }));
      setFieldsValid((prev) => ({ ...prev, email: emailRef.current.value !== '' }));
      setFieldsValid((prev) => ({ ...prev, address: addressRef.current.value !== '' }));
    }

    if (Object.values(fieldsValidRef.current).every((d) => d)) {
      const data = {
        user_id: userData.user_id,
        order: JSON.stringify(
          items.map((item) => {
            const { id, image, ...rest } = item;
            return rest;
          }),
        ),
      };
      axios
        .post(`${BASE_URL}order`, data, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((res) => {
          successHandler('Заказ успешно оформлен!');
        })
        .catch((error) => {
          showError('Ошибка при оформлении заказа. Попробуйте еще раз.');
        });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Запрашиваем данные о пользователе с сервера, если авторизован
  useEffect(() => {
    if (!user.isValid()) {
      return;
    }

    axios
      .get(`${BASE_URL}user_info?user_id=${Number(userId)}`)
      .then((res) => {
        setUserData(res.data);
      })
      .catch((error) => {});
  }, []);

  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header className="fs-4" closeButton={true}>
        Оформление доставки
      </Modal.Header>
      <Modal.Body>
        <Form>
          <h5>Ваши контакты</h5>
          <br />
          {!user.isValid() && (
            <>
              <Form.Group className="mb-3" controlId="FormName">
                <Form.Label>Имя</Form.Label>
                <Form.Control ref={nameRef} type="text" placeholder="Введите имя" />
                <Form.Text className="text-danger">
                  {!fieldsValid.name && errorNotification}
                </Form.Text>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>E-mail</Form.Label>
                <Form.Control ref={emailRef} type="email" placeholder="example@gmail.com" />
                <Form.Text className="text-danger">
                  {!fieldsValid.email && errorNotification}
                </Form.Text>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formAddress">
                <Form.Label>Адрес</Form.Label>
                <Form.Control ref={addressRef} type="text" placeholder="Введите адрес" />
                <Form.Text className="text-danger">
                  {!fieldsValid.address && errorNotification}
                </Form.Text>
              </Form.Group>
            </>
          )}

          <Form.Group className="mb-3" controlId="formPhone">
            <Form.Label>Номер телефона</Form.Label>
            <Form.Control
              ref={phoneRef}
              type="text"
              placeholder="+7"
              defaultValue={userData.phone ?? ''}
            />
            <Form.Text className="text-danger">{!fieldsValid.phone && errorNotification}</Form.Text>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={() => validateForm()}>
          Заказать
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalDelivery;
