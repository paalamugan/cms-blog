import React, { useEffect, useState, useRef } from "react";
import PropTypes from 'prop-types';
import { 
  Button, 
  Grid, 
  Paper,
  Divider } from "@material-ui/core";
import { connect } from "react-redux";
import { getAllUser, addAndEditUser } from "app/redux/actions/UserActions";
import { 
  BlogNoData, 
  BlogLoading,
  BlogCustomizedSnackbar } from "blog";
import { isAdmin } from "app/constant";
import UserTable from "./shared/UserTable";
import AddAndEditDialog from './shared/AddAndEditDialog';
import { useRefresh } from "app/custom-hooks";

const UserLists = ({ addAndEditUser, users, session, getAllUser }) => {

  const [loading, setLoading] = useState(true);
  const snackBarRef = useRef();
  const addAndEditDialogRef = useRef();
  const refresh = useRefresh();

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {

    if (session.username) {

      setLoading(true);
      getAllUser().then(({ success, data }) => {

        if (!success && snackBarRef.current) {
          snackBarRef.current.open({ message: data });
        }

        setLoading(false);

      });
    }

  }, [refresh]);

  return (
    <div className="m-sm-30"> 
      <BlogCustomizedSnackbar ref={snackBarRef} />
      <AddAndEditDialog ref={addAndEditDialogRef} snackBarRef={snackBarRef} addAndEditUser={addAndEditUser} />

      <div className="flex justify-between items-center items-center mb-6">
        <h3 className="m-0">All Users</h3>
        <div>
          <Button
            variant="outlined"
            className="mr-3"
            onClick={refresh}>
              Refresh
          </Button>
          {
            isAdmin(session.role) ?
              ( <Button
                  variant="contained"
                  onClick={() => addAndEditDialogRef.current.open()}
                  color="primary">
                    Create a New User
                </Button>
              ) : null
          }
        </div>
      </div>
      <Divider className="mb-6" />
      { loading ? <BlogLoading /> :
        (
          <Grid container>
            {
              users.length ? (
                <Paper className="w-full overflow-auto">
                  <UserTable 
                    users={users} 
                    snackBarRef={snackBarRef} 
                    addAndEditDialogRef={addAndEditDialogRef} />
                </Paper>
              ) :
              (<BlogNoData className="mt-10">
              <p className="text-18 mt-6">Yet no users created!</p>
                {isAdmin(session.role) ? 
                  (<Button
                      className="uppercase"
                      size="large"
                      variant="contained"
                      onClick={() => addAndEditDialogRef.current.open()}
                      color="primary"
                    >
                      Create a new User
                    </Button>) : null
                }
              </BlogNoData>)
            }
          </Grid>
        )
      }
    </div>
  );
}

UserLists.propTypes = {
  getAllUser: PropTypes.func.isRequired,
  addAndEditUser: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  getAllUser: PropTypes.func.isRequired,
  addAndEditUser: PropTypes.func.isRequired,
  users: state.user.lists,
  session: state.session
})

export default connect(mapStateToProps, { getAllUser, addAndEditUser })(UserLists);
