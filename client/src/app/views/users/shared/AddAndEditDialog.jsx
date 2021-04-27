import React, { useState, forwardRef, useImperativeHandle } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import Form from "./Form";

const AddAndEditDialog = ({ addAndEditUser, snackBarRef }, ref) => {

  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({ username: '', email: '', password: '', role: 'user' });

  useImperativeHandle(ref, () => ({
    open(selectedUser) {

      if(selectedUser) {
        setUser({ ...user, ...selectedUser, password: '' });
      } else {
        setUser({ username: '', email: '', password: '', role: 'user' });
      }

      setOpen(true);

    }
  }));

  const onSubmit = () => {
    addAndEditUser(user).then(({ success, data }) => {
      if (!success) {
        return snackBarRef.current.open({ message: data })
      }
      handleClose();
    })
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{!user._id ? 'Add a new User' : 'Edit User'}</DialogTitle>
        <DialogContent>
          <Form user={user} setUser={setUser} onSubmit={onSubmit}/>
        </DialogContent>
        <Divider />
        <DialogActions className="mt-1 mb-3 mr-4">
          <Button 
            onClick={handleClose}
            disableElevation 
            variant="contained">
            Cancel
          </Button>
          <Button 
            onClick={onSubmit} 
            variant="contained"
            disableElevation 
            color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default forwardRef(AddAndEditDialog);
