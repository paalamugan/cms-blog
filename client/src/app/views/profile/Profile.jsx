import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Paper, Divider } from "@material-ui/core";
import { BlogLoading } from "blog";
import { connect } from "react-redux";
/* eslint-disable no-unused-vars */
import { Grid, TextField, Typography, Icon, Button } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import { BlogCustomizedSnackbar,ConfirmationDialog } from "blog";
import { api } from "app/services/backendService";
import { deleteUser } from "app/redux/actions/UserActions";
import { logoutSession } from "app/redux/actions/SessionActions";

const Profile = ({ logoutSession, deleteUser }) => {

  const [state, setState] = useState({ _id: '', email: '', username: '', password: '', newPassword: '', repeatNewPassword: '' });
  const [loading, setLoading] = useState(true);
  const [deleteSelectedId, setDeleteSelectedId] = useState(null);
  const [disableEmailInput, setDisableEmailInput] = useState(true);
  const [timer, setTimer] = useState(null);
  
  const snackBarRef = useRef();

    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
  
      setLoading(true);
  
      api.get('users/me').then(({ success, data }) => {
  
        if (!success) {
          return snackBarRef.current.open({ message: data });
        }
  
        setState({ email: '', username: '', password: '', newPassword: '', repeatNewPassword: '' , ...data });
        setLoading(false);
  
      });

      return () => {
        clearTimeout(timer);
      }
  
    }, []);
  
    const handleInputChange = (event) => {
      setState({ ...state, [event.target.name]: event.target.value });
    }
  
    const onConfirmDelete = () => {
      deleteUser(deleteSelectedId).then(({ success, data }) => {
  
        if (!success) {
          return snackBarRef.current.open({ message: data })
        }

        logoutSession();
        
      })
    }
    
    const onUpdate = (event) => {
  
        event.preventDefault();
        event.stopPropagation();

        api.put('users/me', state).then(({ success, data }) => {
  
          if (!success) {
            return snackBarRef.current.open({ message: data });
          }

          snackBarRef.current.open({ message: data.salt ? "Successfully password updated. After 2 second you will be redirect to login page!" : "Successfully Updated!", variant: "success" });

          if (data.salt) {
            let timer = setTimeout(() => {
              logoutSession();
            }, 2000);
            setTimer(timer);
          }
    
        });
    }

  return (
    <div className="m-sm-30">
      <Paper elevation={3}>
        <div className="flex p-4 justify-between">
          <h4 className="m-0">Edit your profile</h4>
        </div>
        <Divider className="mb-3" />
        <BlogCustomizedSnackbar ref={snackBarRef} />
        <ConfirmationDialog 
          open={!!deleteSelectedId} 
          title="Delete Confirm" 
          text="Are you sure you want to delete this account? This cannot be undone."
          onYesClick={onConfirmDelete}
          onConfirmDialogClose={() => setDeleteSelectedId(null)} />
        <form name="form" className="p-4 min-h-300" autoComplete="off">
        {loading ? <BlogLoading /> :
          (
            <Grid container spacing={1} direction="column" >
              <Grid item xs={12} md={9} lg={7}>
                <div className="mb-3">
                  <Typography 
                    variant="subtitle1"
                    gutterBottom>
                    <b>Your email address</b>
                  </Typography>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={10}>
                      <TextField 
                      id="email"
                      name="email" 
                      variant="outlined"
                      fullWidth
                      value={state.email}
                      disabled={disableEmailInput}
                      required
                      onChange={handleInputChange}
                      size="small" />
                    </Grid>
                    <Grid item xs={1}>
                      <Button 
                        variant="contained"
                        color="default"
                        size="small"
                        startIcon={<Icon>edit</Icon>}
                        onClick={() => setDisableEmailInput((value) => !value)}
                        >
                          Edit
                      </Button>
                    </Grid>
                  </Grid>
                </div>
              </Grid>
              <Grid item xs={12} md={8} lg={6}>
                <div className="mb-3">
                  <Typography 
                    variant="subtitle1"
                    gutterBottom>
                    <b>Username</b>
                  </Typography>
                  <TextField 
                    id="username"
                    name="username" 
                    variant="outlined"
                    fullWidth
                    value={state.username}
                    required
                    onChange={handleInputChange}
                    size="small" />
                </div>
              </Grid>
              <Grid item xs={12} md={8} lg={6}>
                <div className="mb-3">
                  <Typography 
                    variant="subtitle1" 
                    gutterBottom>
                    <b>Current password</b>
                  </Typography>
                  <TextField 
                    id="password"
                    name="password"
                    type="password" 
                    variant="outlined"
                    fullWidth
                    value={state.password}
                    onChange={handleInputChange}
                    size="small" />
                </div>
              </Grid>
              <Grid item xs={12} md={8} lg={6}>
                <div className="mb-3">
                  <Typography 
                    variant="subtitle1" 
                    gutterBottom>
                    <b>New password</b>
                  </Typography>
                  <TextField 
                    id="newPassword"
                    name="newPassword"
                    type="password" 
                    variant="outlined"
                    fullWidth
                    value={state.newPassword}
                    onChange={handleInputChange}
                    size="small" />
                </div>
              </Grid>
              <Grid item xs={12} md={8} lg={6}>
                <div className="mb-3">
                  <Typography 
                    variant="subtitle1" 
                    gutterBottom>
                    <b>Repeat new password</b>
                  </Typography>
                  <TextField 
                    id="repeatNewPassword"
                    name="repeatNewPassword"
                    type="password" 
                    variant="outlined"
                    fullWidth
                    value={state.repeatNewPassword}
                    onChange={handleInputChange}
                    size="small" />
                </div>
              </Grid>
              <Grid item xs={12}>
                <div className="mb-3">
                <Button 
                    variant="contained"
                    onClick={onUpdate}
                    color="primary"
                    startIcon={<SaveIcon />}
                    className="mr-3"
                    >
                      Update
                  </Button>
                  <Button 
                    variant="contained"
                    color="default"
                    className="bg-error"
                    startIcon={<DeleteIcon />}
                    onClick={() => setDeleteSelectedId(state._id)}
                    >
                      Delete
                  </Button>
                </div>
              </Grid>
            </Grid>
          )
        }
      </form>
      </Paper>
    </div>
  );
}

const mapStateToProps = state => ({
  logoutSession: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired
});

export default connect(mapStateToProps, { logoutSession, deleteUser })(Profile);
