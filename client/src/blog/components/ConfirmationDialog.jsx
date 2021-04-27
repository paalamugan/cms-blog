import React from "react";
import { Dialog, Button } from "@material-ui/core";

const ConfirmationDialog = ({
  open,
  onConfirmDialogClose,
  text,
  title = "confirm",
  onYesClick
}) => {
  return (
    <Dialog
      maxWidth="xs"
      fullWidth={true}
      open={open}
      onClose={onConfirmDialogClose}
    >
      <div className="p-5 pb-2">
        <h4 className="capitalize m-0 mb-2">{title}</h4>
        <p>{text}</p>
        <div className="flex justify-end pt-2">
          <Button className="mr-2" onClick={onYesClick} variant="outlined" color="primary">
            Confirm
          </Button>
          <Button
            onClick={onConfirmDialogClose}
            variant="contained"
          >
            Cancel
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default ConfirmationDialog;
