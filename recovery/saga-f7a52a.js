import React from 'react';
import { put, fork, takeEvery, select } from 'redux-saga/effects';
import { push } from 'connected-react-router';

import { notification, Icon } from 'antd';

import {
  REGISTER_USER_REQUEST_SUCCESS,
  REGISTER_USER_REQUEST_FAILURE,
  AUTHENTICATE_USER_REQUEST_SUCCESS,
  AUTHENTICATE_USER_REQUEST_FAILURE,
  REQUEST_PASSWORD_RESET_REQUEST_SUCCESS,
  SET_NEW_PASSWORD_RESET_REQUEST_SUCCESS,
  LOGOUT,
} from './types';

function* afterRegistrationSuccess() {
  yield notification.open({
    duration: 0,
    message: 'Registration succeeded!',
    description: 'You can log in to the app now!',
    icon: <Icon type="smile" style={{ color: '#108ee9' }} />,
  });
}

function* afterRegistrationFailure() {
  const state = yield select()

  yield notification.open({
    duration: 0,
    message: 'Buu! Registration failed.',
    description: state.auth.register_response.message,
    icon: <Icon type="frown" style={{ color: '#ff0000' }} />,
  });
}

function* afterLoginSuccess() {
  const state = yield select();

  yield localStorage.setItem('AUTH_GROUP_ID', state.auth.groupId);
  yield localStorage.setItem('AUTH_USER_ID', state.auth.userId);
  yield localStorage.setItem('AUTH_TOKEN', state.auth.token);
  yield localStorage.setItem('AUTH_EXPIRES_AT', state.auth.expires);
}

function* afterLoginFailure() {
  const state = yield select()

  yield notification.open({
    duration: 0,
    message: 'Buu! Login failed.',
    description: state.auth.login_response,
    icon: <Icon type="frown" style={{ color: '#ff0000' }} />,
  });
}

function* afterRequestResetPasswordSuccess() {
  yield notification.open({
    duration: 0,
    message: 'Requested password reset.',
    description: 'We\'ve just sent you an email with instructions on how to reset your password.',
    icon: <Icon type="smile" style={{ color: '#108ee9' }} />,
  });
}

function* afterSetNewPassword() {
  yield put(push('/'));
}

function* afterLogout() {
  yield localStorage.removeItem('AUTH_GROUP_ID');
  yield localStorage.removeItem('AUTH_USER_ID');
  yield localStorage.removeItem('AUTH_TOKEN');
  yield localStorage.removeItem('AUTH_EXPIRES_AT');

  yield put(push('/'));
}

export default function* authSaga() {
  yield fork(takeEvery, REGISTER_USER_REQUEST_SUCCESS, afterRegistrationSuccess);
  yield fork(takeEvery, REGISTER_USER_REQUEST_FAILURE, afterRegistrationFailure);
  yield fork(takeEvery, AUTHENTICATE_USER_REQUEST_SUCCESS, afterLoginSuccess);
  yield fork(takeEvery, AUTHENTICATE_USER_REQUEST_FAILURE, afterLoginFailure);
  yield fork(takeEvery, REQUEST_PASSWORD_RESET_REQUEST_SUCCESS, afterRequestResetPasswordSuccess);
  yield fork(takeEvery, SET_NEW_PASSWORD_RESET_REQUEST_SUCCESS, afterSetNewPassword);

  yield fork(takeEvery, LOGOUT, afterLogout);
}
