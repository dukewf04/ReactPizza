import axios from 'axios';
import { useRef, useState } from 'react';
import { Form, Row, Col, Spinner } from 'react-bootstrap';
import { errorHandler, showError, successHandler } from '../utils/alarmHandler';
import { BASE_URL } from '../config/global';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { editableFieldColor } from '../pages/Profile';
import { useClickAway } from 'ahooks';

const ProfileInputField = ({ title, value, name, user_id, isFetching, isPassword = false }) => {
  const inputRef = useRef(null);
  const [editable, setEditable] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useClickAway(() => {
    if (!isSaving) setEditable(false);
  }, [...document.getElementsByClassName(`${name}-edit`)]);

  // Изменение данных пользователя
  const handleChangeData = async (values) => {
    setIsSaving(true);
    axios
      .patch(
        `${BASE_URL}user`,
        { user_id, [name]: inputRef.current.value },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .then((res) => {
        successHandler('Данные успешно отредактированы');
        setEditable(false);
      })
      .catch((error) => {
        errorHandler(error);
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  const handleSave = () => {
    if (inputRef.current.value === '') {
      showError('Редактируемое поле пустое');
      return;
    }
    handleChangeData();
  };

  const handleEdit = () => {
    setEditable(true);
    inputRef.current.focus();
    //  После фокусировки, устанавливаем курсор в конец строки
    inputRef.current.setSelectionRange(
      inputRef.current.value.length,
      inputRef.current.value.length,
    );
  };

  return (
    <Form.Group className="mb-3">
      {title !== '' && <Form.Label>{title}</Form.Label>}

      <Row>
        <Col sm={10}>
          <Form.Control
            ref={inputRef}
            type={!isPassword ? 'text' : 'password'}
            placeholder={isPassword ? '********' : isFetching ? 'загрузка данных...' : !value && 'отсутствует'}
            defaultValue={!isPassword ? value : ''}
            plaintext={!editable}
            readOnly={!editable}
            disabled={isSaving}
            style={{ backgroundColor: `${editable ? editableFieldColor : ''}` }}
            className={`${name}-edit`}
          />
        </Col>
        <Col className="ps-0" sm={2}>
          {isSaving ? (
            <IconButton disabled>
              <Spinner animation="border" variant="primary" size="sm" />
            </IconButton>
          ) : editable ? (
            <IconButton className={`${name}-edit`} onClick={() => handleSave()}>
              <SaveIcon style={{ pointerEvents: 'none' }} className={`${name}-edit`} />
            </IconButton>
          ) : (
            <IconButton className={`${name}-edit`} onClick={() => handleEdit()}>
              <EditIcon
                style={{ opacity: 0.4, pointerEvents: 'none' }}
                className={`${name}-edit`}
              />
            </IconButton>
          )}
        </Col>
      </Row>
    </Form.Group>
  );
};

export default ProfileInputField;
