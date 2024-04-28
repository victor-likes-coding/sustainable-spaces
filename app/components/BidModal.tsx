import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { Form } from "@remix-run/react";
import { useState } from "react";

export interface InfoObject {
  address: string;
  price: number;
  propertyId: number;
  bid: number;
}

interface ModalObject {
  renderModal: () => JSX.Element; // Function to render the modal
  isOpen: boolean; // Boolean to check if the modal is open
  onOpen: () => void; // Function to open the modal
  onOpenChange: () => void; // Function to close the modal
  setInfo: (info: InfoObject) => void; // Function to set the address in the modal
}

function useModal(): ModalObject {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [info, setInfo] = useState({
    address: "",
    price: 0,
    propertyId: 0,
    bid: 0,
  });

  // Function to render the modal, can be called in the component where the hook is used
  const renderModal = () => (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      className="mx-4"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <Form action={`/property/${info.propertyId}/bid`} method="POST">
              <ModalHeader className="flex flex-col gap-1">
                <h3 className="text-lg font-bold">Bidding</h3>
                <p className="text-xs text-gray-500">
                  Enter your bid for {info.address}.
                </p>
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Bid Amount"
                  placeholder="0"
                  value={info.bid
                    .toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })
                    .replace(/\.\d+/, "")}
                  onChange={(e) => {
                    setInfo((prev) => {
                      // convert the currency back to an integer
                      const bid = parseInt(
                        e.target.value.replace(/[^0-9.-]+/g, "")
                      );
                      return {
                        ...prev,
                        bid: isNaN(bid) ? 0 : bid,
                      };
                    });
                  }}
                  name="bid"
                  type="text"
                />

                <Input
                  name="propertyId"
                  className="hidden"
                  readOnly
                  value={info.propertyId.toString()} // Convert info.propertyId to a string
                />
                <p className="text-xs text-gray-500 mt-2">
                  Current Ask Price: ${info.price.toLocaleString()}
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  type="button"
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  variant="solid"
                  onPress={() => {}}
                  type="submit"
                >
                  Send
                </Button>
              </ModalFooter>
            </Form>
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
    setInfo,
  };
}

export default useModal;
