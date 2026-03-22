import { useEffect } from "react";
import { Button } from "@vkontakte/vkui";
import "./Modal.css";

interface ModalProps {
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function Modal(props: ModalProps) {
  const { title, description, confirmLabel, cancelLabel, onConfirm, onCancel } = props;

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onCancel]);

  return (
    <div className="modal-backdrop" onClick={onCancel} role="presentation">
      <div
        className="modal-card surface-card"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="favorites-modal-title"
      >
        <h2 id="favorites-modal-title">{title}</h2>
        <p>{description}</p>
        <div className="modal-actions">
          <Button mode="secondary" size="m" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button mode="primary" size="m" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
