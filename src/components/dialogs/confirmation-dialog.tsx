export interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmationDialog = (props: ConfirmationDialogProps) => {
  return props.isOpen ? (
    <dialog className="modal" open={props.isOpen}>
      <div className="modal-box border border-current overflow-y-visible">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={props.onClose}
        >
          ✕
        </button>
        <div className="gap-4 work-assignments-header">
          <h3 className="font-bold text-lg">{props.title}</h3>
        </div>
        <div className="whitespace-pre-line pt-4">{props.message}</div>
        <div className="modal-action">
          <button className="btn btn-outline btn-sm" onClick={props.onClose}>
            Cancel
          </button>
          <button className="btn btn-outline btn-sm" onClick={props.onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </dialog>
  ) : (
    <></>
  );
};

export default ConfirmationDialog;
