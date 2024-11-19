import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Form, Row, Col, Spinner } from 'react-bootstrap';
import UserAuth from '../services/userAuth/userAuth';
import { errorHandler, showError, successHandler } from '../utils/alarmHandler';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config/global';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import ProfileInputField from '../components/ProfileInputField';

export const editableFieldColor = '#f0f0f0';

const Profile = () => {
  const [userData, setUserData] = useState({});
  const [isFetching, setIsFetching] = useState(false);
  const [isSavingAvatar, setIsSavingAvatar] = useState(false);
  const [isSavingNotification, setIsSavingNotification] = useState({
    advertising: false,
    promotions: false,
  });
  const [base64Image, setBase64Image] = useState(null);
  const navigate = useNavigate();

  const user = new UserAuth();
  const userId = user.getDecodedData() ? user.getDecodedData().user_id : null;

  // Изменение аватара пользователя
  const handleChangeAvatar = async () => {
    setIsSavingAvatar(true);
    axios
      .patch(
        `${BASE_URL}user`,
        { user_id: userData.user_id, avatar: base64Image },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .then((res) => {
        successHandler('Данные успешно отредактированы');
        setUserData((prev) => ({ ...prev, avatar: base64Image }));
      })
      .catch((error) => {
        errorHandler(error);
      })
      .finally(() => setIsSavingAvatar(false));
  };

  // Изменение подписок на рекламу, акции
  const handleChangeNotification = async (name, value) => {
    setIsSavingNotification((prev) => ({ ...prev, [name]: true }));
    axios
      .patch(
        `${BASE_URL}user`,
        { user_id: userData.user_id, notification: { ...userData.notification, [name]: value } },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .then((res) => {
        successHandler('Данные успешно отредактированы');
      })
      .catch((error) => {
        errorHandler(error);
      })
      .finally(() => setIsSavingNotification((prev) => ({ ...prev, [name]: false })));
  };

  // Запрашиваем данные с сервера
  useEffect(() => {
    if (!user.isValid()) {
      navigate('/');
      return;
    }

    window.scrollTo(0, 0);
    setIsFetching(true);
    axios
      .get(`${BASE_URL}user_info?user_id=${Number(userId)}`)
      .then((res) => {
        setUserData(res.data);
      })
      .catch((error) => {
        if (error) {
          errorHandler(error);
          navigate('/');
        }
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, []);

  useEffect(() => {
    if (['null', null, undefined, ''].includes(base64Image)) return;
    handleChangeAvatar();
  }, [base64Image]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Проверка формата файла
    if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
      showError('Файл должен быть формата PNG или JPEG');
      return;
    }

    // Проверка размера файла
    if (file.size > 1024 * 1024) {
      showError('Размер файла не должен превышать 1 мегабайта');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setBase64Image(String(reader.result));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="container container--profile">
      <div className="profile--aside">
        {/* Аватар пользователя */}
        <div className="profile--aside__avatar">
          <img
            src={userData.avatar}
            style={{
              animation: `${isSavingAvatar ? 'border-animation 1.5s linear infinite' : ''}`,
            }}
          />

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            onClick={() => document.getElementById('imageInput').click()}
            style={{ display: `${isSavingAvatar ? 'none' : 'block'}` }}
          >
            <path
              fill="currentColor"
              d="M9.5 9L11 6h10l1.5 3H26a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V11a2 2 0 012-2zM16 24a6 6 0 10-6-6 6 6 0 006 6zm0-2a4 4 0 114-4 4 4 0 01-4 4z"
            ></path>
          </svg>

          {/* Форма выбора файла (скрыта по умолчанию) */}
          <input
            type="file"
            id="imageInput"
            accept="image/png, image/jpeg"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
        </div>

        {/* Имя пользователя */}
        <ProfileInputField
          title={''}
          value={userData.name}
          name={'name'}
          user_id={userData.user_id}
          isFetching={isFetching}
        />

        <div className="profile--aside__bonuses mb-2">{`Ваш кешбэк: ${isFetching ? '...' : userData.cashback ? userData.cashback + '%' : '0%'}`}</div>
        <div className="profile--aside__bonuses mb-5">{`Crazy Бонусы: ${isFetching ? '...' : userData.bonus ? userData.bonus : 0}`}</div>

        <Form className="profile--aside__form">
          {/* Номер телефона */}
          <ProfileInputField
            title={'Номер телефона'}
            value={userData.phone}
            name={'phone'}
            user_id={userData.user_id}
            isFetching={isFetching}
          />

          {/* E-mail */}
          <ProfileInputField
            title={'E-mail'}
            value={userData.email}
            name={'email'}
            user_id={userData.user_id}
            isFetching={isFetching}
          />

          {/* Дата рождения */}
          <ProfileInputField
            title={'Дата рождения '}
            value={userData.birthday}
            name={'birthday'}
            user_id={userData.user_id}
            isFetching={isFetching}
          />

          {/* Смена пароля */}
          <ProfileInputField
            title={'Смена пароля '}
            value={userData.password}
            name={'password'}
            user_id={userData.user_id}
            isFetching={isFetching}
            isPassword={true}
          />
        </Form>
      </div>

      {/* История заказов */}
      <div className="profile--main">
        <div className="profile--main__card text-muted">
          <div className="mb-3">История заказов</div>
          <hr />
          <div>
            <i style={{ fontSize: '15px' }}>Заказов не было...</i>
          </div>
        </div>

        {/* Адрес */}
        <div className="profile--main__card text-muted">
          <div className="mb-3">Адрес</div>
          <hr />
          <ProfileInputField
            title={''}
            value={userData.address}
            name={'address'}
            user_id={userData.user_id}
            isFetching={isFetching}
          />
        </div>

        {/*Привязанные карты  */}
        <div className="profile--main__card text-muted">
          <div className="mb-3">Привязанные карты</div>
          <hr />
          <ProfileInputField
            title={''}
            value={userData.card}
            name={'card'}
            user_id={userData.user_id}
            isFetching={isFetching}
          />
        </div>

        {/* Уведомления */}
        <div className="profile--main__card text-muted">
          Уведомления
          <hr />
          <Row>
            <Col>
              <Form.Group style={{ whiteSpace: 'nowrap' }} className="mb-3">
                <span className="d-flex align-items-center">
                  <Form.Label className="profile--main__card__label pt-1">
                    Рекламаные рассылки
                  </Form.Label>
                  <Form.Check
                    type="switch"
                    id="advertising-switch"
                    defaultChecked={userData.notification?.advertising}
                    disabled={isSavingNotification.advertising}
                    onClick={(e) => handleChangeNotification('advertising', e.target.checked)}
                  />
                  {isSavingNotification.advertising && (
                    <Spinner animation="border" variant="primary" size="sm" />
                  )}
                </span>
              </Form.Group>
            </Col>

            <Col>
              <Form.Group style={{ whiteSpace: 'nowrap' }} className="mb-3">
                <span className="d-flex align-items-center">
                  <Form.Label className="profile--main__card__label pt-1">
                    Акции компании
                  </Form.Label>
                  <Form.Check
                    type="switch"
                    id="promotions-switch"
                    defaultChecked={userData.notification?.promotions}
                    disabled={isSavingNotification.promotions}
                    onClick={(e) => handleChangeNotification('promotions', e.target.checked)}
                  />
                  {isSavingNotification.promotions && (
                    <Spinner animation="border" variant="primary" size="sm" />
                  )}
                </span>
              </Form.Group>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default Profile;
