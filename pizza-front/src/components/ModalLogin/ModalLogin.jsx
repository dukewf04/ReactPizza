import { Modal } from 'react-bootstrap';
import LoginForm from './LoginForm';
import { useState } from 'react';
import RegisterForm from './RegisterForm';

const ModalLogin = ({ showModal, setShowModal }) => {
  const [showForm, setShowForm] = useState('Login');

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Body>
        {showForm === 'Login' ? (
          <LoginForm setShowForm={setShowForm} handleCloseModal={handleCloseModal} />
        ) : (
          <RegisterForm setShowForm={setShowForm} handleCloseModal={handleCloseModal} />
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ModalLogin;
