import { CNHEvent } from "./CNHEvent";

export default interface ModalProps {
  event: CNHEvent;
  isOpen: boolean;
  closeModal: () => void;
}
