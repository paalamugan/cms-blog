import React, { useEffect, useRef, Fragment } from "react";
import PropTypes from "prop-types";
import { auth } from "app/services/backendService";
import { BlogCustomizedSnackbar } from "blog";
import { refreshNavigationByUser } from "app/redux/actions/NavigationAction";
import { connect } from "react-redux";

const AccountVerify = ({ history, match, refreshNavigationByUser }) => {

  let snackbarRef = useRef(null);

  useEffect(() => {
    auth.get(`/verify/${match.params.token}`)
    .then(({ success, data }) => {

      if (!success) {
        return snackbarRef.current.open({ variant: "error", message: data });
      }

      refreshNavigationByUser(data.user);

      history.push({
        pathname: '/'
      });

    })
  }, [history, match.params.token, refreshNavigationByUser]);

  return (
    <Fragment>
      <BlogCustomizedSnackbar ref={snackbarRef} />
    </Fragment>
  )
}

const mapStateToProps = state => ({
  refreshNavigationByUser: PropTypes.func.isRequired,
});

export default connect(mapStateToProps, { refreshNavigationByUser })(AccountVerify);
