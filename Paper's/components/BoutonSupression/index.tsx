import React, { useState } from "react";
import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

interface BoutonSuppressionProps {
  onDelete: () => void;
  children?: React.ReactNode; // Assurez-vous que children est déclaré ici
}

const BoutonSuppression: React.FC<BoutonSuppressionProps> = ({
  onDelete,
  children,
}) => {
  const [openModal, setOpenModal] = useState(false);

  const handleDelete = () => {
    onDelete();
    setOpenModal(false);
  };

  return (
    <>
      <Button className=" bg-c6 hover:bg-c7" onClick={() => setOpenModal(true)}>
        {children || "Supprimer"}{" "}
        {/* Affiche "Supprimer" si children n'est pas fourni */}
      </Button>
      <Modal
        show={openModal}
        size="md"
        onClose={() => setOpenModal(false)}
        popup
        position="center"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Êtes-vous sûr de vouloir le supprimer ?
            </h3>
            <div className="flex justify-center gap-4">
              <Button className="bg-c7" onClick={handleDelete}>
                Oui, je suis sûr
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                Non, annuler
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default BoutonSuppression;
