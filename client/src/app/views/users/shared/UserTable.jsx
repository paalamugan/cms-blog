import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment from "moment";
import {
  Table,
  TableHead,
  TableCell,
  TableBody,
  IconButton,
  Icon,
  TableRow,
  Avatar  
} from "@material-ui/core";
import { deleteUser } from "app/redux/actions/UserActions";
import { ConfirmationDialog } from "blog";
import { isAdmin } from "app/constant";

const UserTable = ({ users, session, snackBarRef, addAndEditDialogRef, deleteUser }) => {

  const [deleteSelectedId, setDeleteSelectedId] = useState(null);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (deleteSelectedId) {
      setDeleteSelectedId(null);
    }
  }, [users]);

  const onConfirmDelete = () => {
    deleteUser(deleteSelectedId).then(({ success, data }) => {

      if (!success) {
        return snackBarRef.current.open({ message: data })
      }
      
    })
  }

  return (
    <div className="w-full overflow-auto">
      <ConfirmationDialog 
      open={!!deleteSelectedId} 
      title="Delete Confirm" 
      text="Are you sure you want to delete this user? This cannot be undone."
      onYesClick={onConfirmDelete}
      onConfirmDialogClose={() => setDeleteSelectedId(null)} />
      <Table className="whitespace-pre crud-table table-auto">
        <TableHead>
          <TableRow>
            <TableCell width={50}>Avatar</TableCell>
            <TableCell>Username</TableCell>
            <TableCell align="center">Role</TableCell>
            <TableCell align="center">Email</TableCell>
            <TableCell align="center">Created At</TableCell>
            {isAdmin(session.role) ? (<TableCell align="center">Action</TableCell>) : null }
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user, index) => (
            <TableRow key={index}>
              <TableCell width={50} align="left">
                <Avatar src={user.avatarUrl || '/assets/images/avatar.png'}></Avatar>
              </TableCell>
              <TableCell width={200} align="left">
                {user.username}
              </TableCell>
              <TableCell className="capitalize" align="center">
                {user.role}
              </TableCell>
              <TableCell align="center">
                {user.email || '-'}
              </TableCell>
              <TableCell align="center">
                {moment(user.createdAt).format("YYYY-MM-DD hh:mm a")}
              </TableCell>
              {
                isAdmin(session.role) ? 
                (
                  <TableCell className="px-0" align="center">
                    <IconButton onClick={() => addAndEditDialogRef.current.open(user)}>
                      <Icon color="primary">edit</Icon>
                    </IconButton>
                    <IconButton onClick={() => setDeleteSelectedId(user._id)}>
                      <Icon color="error">delete</Icon>
                    </IconButton>
                  </TableCell>
                ) : null
              }

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const mapStateToProps = (state) => ({
  deleteUser: PropTypes.func.isRequired,
  users: state.user.lists,
  session: state.session
})

export default connect(mapStateToProps, { deleteUser })(UserTable);
