import { useState } from 'react';
import Modal from "./component/setting/Setting.tsx";

export default function Setting() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <button onClick={handleOpenModal}>Open Modal</button>
      {isModalOpen && <Modal onClose={handleCloseModal} />}
    </div>
  );
}

