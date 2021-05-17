import cloneDeep from "lodash";
import allNavigations from "app/navigations";
import { setSessionData } from "./SessionActions";

export const SET_USER_NAVIGATION = "SET_USER_NAVIGATION";

const getfilteredNavigations = (navList = [], role) => {
  return navList.reduce((array, nav) => {
    if (nav.auth) {
      if (nav.auth.includes(role)) {
        array.push(nav);
      }
    } else {
      if (nav.children) {
        nav.children = getfilteredNavigations(nav.children, role);
        array.push(nav);
      } else {
        array.push(nav);
      }
    }
    return array;
  }, []);
};

export function getNavigationByUser() {
  return (dispatch, getState) => {

    let { session, navigations = [] } = getState();

    if (!navigations.length) {
      navigations = cloneDeep(allNavigations);
    }

    let filteredNavigations = getfilteredNavigations(navigations, session.role);

    dispatch({
      type: SET_USER_NAVIGATION,
      payload: [...filteredNavigations]
    });
  };
}

export function resetNavigationByUser() {
  return (dispatch) => {
    dispatch({
      type: SET_USER_NAVIGATION,
      payload: []
    })
  }
}

export function refreshNavigationByUser(user) {
  return (dispatch, getState) => { 
    resetNavigationByUser()(dispatch);
    setSessionData(user)(dispatch);
    getNavigationByUser()(dispatch, getState);
  }
}
