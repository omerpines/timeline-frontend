import { take, fork, put, call } from 'redux-saga/effects';
import axios from 'axios';
import config from 'constants/config';
import types from 'store/actionTypes';
import { failureEmail, successEmail } from 'store/actionCreators/email';


function* processEmail({ name, email, message, content, close }) {
  try {
    console.log(email, message, content, name)
    yield call(axios.post, `https://play.grwth.hk/send-email`, {
      // to: config.EMAIL_SEND_TO,
      // from: config.EMAIL_SEND_FROM || email,
      to: 'trollwizard410@gmail.com',
      from: email,
      subject: `${content} <${email}>`,
      message: `<div><h3>Name: ${name}</h3><h3>Email: ${email}</h3><p>Content: ${message}</p></div>`,
    });
    yield put(successEmail());
    if (close) close();
  } catch (e) {
    yield put(failureEmail(e));
  }
}

export function* onRequestEmail() {
  while (true) {
    const action = yield take(types.EMAIL_REQUEST);
    yield fork(processEmail, action);
  }
}