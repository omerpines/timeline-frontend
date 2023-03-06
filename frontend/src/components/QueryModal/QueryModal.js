import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Modal from "components/Modal";
import { requestAuthentication } from "store/actionCreators/authentication";
import {
  isAuthenticationLoading,
  isAuthenticated,
} from "store/selectors/authentication";
import "./style.css";

const QueryModal = ({ onClose }) => {
  const { t } = useTranslation();

  function myFunction() {
    var input = document.getElementById("myInput");
    var filter = input.value.toUpperCase();
    var table = document.getElementById("myTable");
    var tr = table.getElementsByTagName("tr");
    var td, i;

    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[2];
      if (td) {
        if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }
  return (
    <Modal onClose={onClose}>
      <div className="modal__box auth__box">
        <header className="modal__header auth__header">
         <img src="/cross.png" onClick={onClose}/>
          <div className="modal__title auth__title">צרו איתנו קשר</div>
        </header>
        <div className="modal__body auth__body">
          <p>
            אנחנו מקווים שציר הזמן התנ"כי ישמש לכם כעזר לכל מטרה ויתן לכם נקודת
            הסתכלות :חדשה. במידה ומצאתם טעות, נתקלתם בבעיה או שיש לכם רעיון
            לשיפור, אנא כתבו אלינו
          </p>
          <form>
          <div className="formDiv">
            <div className="multiInputDiv">
              <div className="inputDiv">
                <label>שם מלא</label>
                <input />
              </div>
              <div className="inputDiv">
                <label>שם מלא</label>
                <input />
              </div>
            </div>
            <div className="inputDiv">
                <label>שם מלא</label>
               <textarea></textarea>
              </div>
          </div>
          <button onClick={onClose} className="formBtn">המשך</button>
          </form>
        </div>
        <footer className="modal__footer auth__footer">
          {/* <button className="auth__confirm-button" disabled={authenticationDisabled}>
            {t('auth.login')}
          </button> */}
        </footer>
      </div>
    </Modal>
  );
};

export default QueryModal;
