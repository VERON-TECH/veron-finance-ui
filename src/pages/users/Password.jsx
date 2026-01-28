import { useActionState, useRef } from "react";
import { isNotEmpty } from "../../utils/validation";
import { noteActions } from "../../store/noteSlice";
import { useDispatch, useSelector } from "react-redux";
import { updatePassword } from "../../utils/http";
import { useAnimate } from "framer-motion";
import Input from "../../layout/Input";
import Submit from "../../layout/Submit";
import Notification from "../../layout/Notification";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function PasswordPage() {

  const inputPwd = useRef();
  const inputPwdConfirm = useRef();
  const loginRef = useRef();
  const dispatch = useDispatch()
  const errorNotification = useSelector(state => state.note.error);
  const relaunch = useSelector(state => state.note.relaunch);
  const dataItem = useSelector(state => state.note.dataItem)
  const [scope, animate] = useAnimate()
  const user = JSON.parse(localStorage.getItem("user"))
  const navigate = useNavigate()

  async function handleUpdatePassword(prev, formData) {
    const allData = Object.fromEntries(formData.entries());
    const username = formData.get("username");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");
    let errors = [];

    if (!isNotEmpty(username)) {
      errors.push("Le mot de passe est obligatoire");
    }

    if (!isNotEmpty(password)) {
      errors.push("Le mot de passe est obligatoire");
    }

    if (!isNotEmpty(confirmPassword)) {
      errors.push("Le mot de passe est obligatoire");
    }

    if (errors.length > 0) {
      dispatch(noteActions.show());
      dispatch(noteActions.relaunch());
      dispatch(noteActions.error(true));
      dispatch(noteActions.sendData(errors))
      return {
        errors
      };
    }

    const responseData = await updatePassword(allData);

    dispatch(noteActions.show());
    dispatch(noteActions.relaunch());
    dispatch(noteActions.sendData(responseData))
    if (!responseData.includes("Mot de passe mis à jour")) {
      dispatch(noteActions.error(true));
    } else {
      dispatch(noteActions.error(false));
    }
  }



  function handleBlurPassword(identifier, value) {

    if (identifier === "password") {
      if (!isNotEmpty(value)) {
        animate(inputPwd.current, { x: [0, 15, 0] }, { bounce: 0.75 })
      }
    }

    if (identifier === "passwordConfirm") {
      if (!isNotEmpty(value)) {
        animate(inputPwdConfirm.current, { x: [0, 15, 0] }, { bounce: 0.75 })
      }
    }

  }

  const [formState, formAction] = useActionState(handleUpdatePassword, { errors: null })


  return <>
    <motion.form whileHover={{ scale: 1.1 }} transition={{ duration: 1 }} className="bg-green-950 text-green-50 border-1 p-8 rounded-xl absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center flex-col items-center gap-4 shadow-2xl shadow-green-950" action={formAction} ref={scope}>
      <input type="text" name="username" defaultValue={user?.refUsers} placeholder="Login *" className="text-green-50 rounded p-1 w-48 border border-green-50" ref={loginRef} readOnly />
      <input type="password" name="password" placeholder="Mot de passe" className="text-green-50 rounded p-1 w-48 border border-green-50" onBlur={(event) => handleBlurPassword("password", event.target.value)} ref={inputPwd} />
      <input label="onfirmer *" type="password" name="confirmPassword" placeholder="Confirmer" className="text-green-50 rounded p-1 w-48 border border-green-50" onBlur={(event) => handleBlurPassword("passwordConfirm", event.target.value)} ref={inputPwdConfirm} />
      <Submit>
        Enregistrer
      </Submit>
    </motion.form>
    {dataItem.length > 0 && <Notification key={relaunch} error={errorNotification} messages={dataItem} />}

  </>
}