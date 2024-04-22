import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useState } from "react";

type Props<T> = {
  errors: T;
};

function useModal<T>({ errors: err }: Props<T>) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [errors, setErrors] = useState(err);
  const [key, setKey] = useState<keyof T>("" as keyof T);

  // Function to render the modal, can be called in the component where the hook is used
  const renderModal = () => (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Ooops, Something went wrong!
            </ModalHeader>
            <ModalBody>
              <p>{(key as string).length > 0 && (errors[key] as string)}</p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );

  return {
    renderModal,
    isOpen,
    onOpen,
    onOpenChange,
    setErrors,
    setKey,
    errors,
  };
}

export default useModal;
