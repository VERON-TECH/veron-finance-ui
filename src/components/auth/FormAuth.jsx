import Input from "../../layout/Input";
import Submit from "../../layout/Submit";
import { isNotEmpty } from "../../utils/validation";
import { useActionState, useState } from "react";
import Notification from "../../layout/Notification";
import { AnimatePresence, motion, useAnimate } from "framer-motion";
import { useDispatch } from "react-redux";
import { noteActions } from "../../store/noteSlice";
import { useRef } from "react";
import { authActions } from "../../store/authSlice";
import { useNavigate, useSubmit } from "react-router";
import Modal from "../../layout/Modal";
import { connected, login, logout, editPassword, getAuthoritiByUsername, getPersonalById, getAllCashesByPersonal, getUserLogin, getAllStoresById } from "../../utils/http";

let USERNAME = ""

export default function FormAuth() {
  const [error, setError] = useState({
    username: "",
    password: ""
  })

  const [errorNotification, setErrorNotification] = useState(false);
  const inputUserName = useRef();
  const inputPassword = useRef();
  const inputPwd = useRef();
  const inputPwdConfirm = useRef();
  const [scope, animate] = useAnimate();
  const [relaunch, setRelaunch] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dialog = useRef();
  const dialog1 = useRef();
  const submit = useSubmit();
  const inputCheck = useRef();

  const memo = localStorage.getItem("memo");

  async function handleSubmit(prevState, formData, signal) {
    const username = formData.get("username");
    USERNAME = username;
    const password = formData.get("password");
    const data = { username, password }
    let errors = [];
    if (!isNotEmpty(username)) {
      errors.push("Le nom utilisateur est obligatoire !");
    }

    if (!isNotEmpty(password)) {
      errors.push("Le mot de passe est obligatoire !");
    }

    if (errors.length > 0) {
      setErrorNotification(true);
      dispatch(noteActions.show());
      setRelaunch(prev => {
        return {
          ...prev,
          prev: !prev
        }
      })

      return {
        errors, defaultValue: {
          username,
        }
      }
    }

    const user = await getUserLogin(username);



    if (user.connected) {
      localStorage.setItem("user", JSON.stringify(user))
      dialog.current.open();
    } else if (user.connexion == 0) {
      dialog1.current.open();
    } else if (!user.enabled && user !== 401) {
      dispatch(noteActions.show());
      dispatch(noteActions.relaunch());
      dispatch(noteActions.error(true));
      dispatch(noteActions.sendData(["Compte inactif"]))
    } else if (user === 401) {
      dispatch(noteActions.show());
      dispatch(noteActions.relaunch());
      dispatch(noteActions.error(true));
      dispatch(noteActions.sendData(["Login & mot de passe incorrect"]))
    } else if (user.connexion == 100) {
      dialog1.current.open();
    } else {
      const authorities = await getAuthoritiByUsername(user?.username)
      let isAdmin = false;
      for (let auth of authorities) {
        if (auth.name == "ROLE_ADMIN") {
          isAdmin = true;
        }
      }
      let response;
      if (user.personal > 0 || isAdmin) {
        response = await login(data)
      } else {
        dispatch(noteActions.show());
        dispatch(noteActions.relaunch());
        dispatch(noteActions.error(true));
        dispatch(noteActions.sendData(["L'utilisateur " + user.username + " n'est n'est pas rattaché à un personnel."]))
        return { errors: null }
      }


      if (response?.includes("Login et mot de passe erroné")) {
        dispatch(noteActions.show());
        dispatch(noteActions.relaunch());
        dispatch(noteActions.error(true));
        dispatch(noteActions.sendData(["Login et mot de passe erroné"]))
        return { errors: null }
      }

      if (response?.includes("Utilisateur non authentifié")) {
        dispatch(noteActions.show());
        dispatch(noteActions.relaunch());
        dispatch(noteActions.error(true));
        dispatch(noteActions.sendData(["Utilisateur non authentifié"]))
        return { errors: null }
      }

      await connected(user?.username)
      dispatch(authActions.login({ username: username, role: user.authorities }))

      let role = []
      for (let auth of authorities) {
        role.push(auth.name)
      }

      let personal;
      let tb = [];
      let tb2 = []
      if (user.personal !== 0) {
        personal = await getPersonalById({ id: user.personal, signal })
        const cashes = await getAllCashesByPersonal(personal.id)

        if (cashes.length > 0) {
          cashes.forEach(c => {
            tb.push({ key: c.id, name: c.name, value: c.slug })
          })
        }

        if (personal.stores != null && personal.stores.length > 0) {

          const getAllStores = await getAllStoresById(personal.stores)
          getAllStores.forEach(s => {
            tb2.push({ key: s.id, name: s.name, value: s.slug })
          })
        }

      }




      const userInfo = {
        username: user.username,
        role: role,
        personal: user.personal,
        agency: user.personal !== 0 ? personal.agency : 0,
        enterprise: user.personal !== 0 ? personal.enterprise : 0,
        cashes: user.personal !== 0 ? tb : [],
        stores: user.personal !== 0 ? tb2 : []


      }
      localStorage.setItem("user", JSON.stringify(userInfo))

      navigate("home")
    }


    return { errors: null }


  }





  function handleBlur(identifier, value) {
    if (identifier === "username") {
      if (!isNotEmpty(value)) {
        setError(prevState => {
          return {
            ...prevState,
            [identifier]: "Le nom de l'utilisateur est obligatoire !"
          }
        })
        animate(inputUserName.current, { x: [0, 15, 0] }, { bounce: 0.75 })
      } else {
        setError(prevState => {
          return {
            ...prevState,
            [identifier]: ""
          }
        })
      }
    }
    if (identifier === "password") {
      if (!isNotEmpty(value)) {
        setError(prevState => {
          return {
            ...prevState,
            [identifier]: "Le mot de passe est obligatoire !"
          }
        })
        animate(inputPassword.current, { x: [0, 15, 0] }, { bounce: 0.75 })
      } else {
        setError(prevState => {
          return {
            ...prevState,
            [identifier]: ""
          }
        })
      }
    }
  }

  async function handleDeconnexion() {
    submit(null, { method: "post" }, { action: "/" })
    dispatch(authActions.logout())
    const user = JSON.parse(localStorage.getItem("user"))
    await logout(user.username);
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    dialog.current.close()
    navigate("/")
  }



  async function handleUpdatePassword(formData) {
    const allData = Object.fromEntries(formData.entries());
    const user = JSON.parse(localStorage.getItem("user"))
    const username = user?.username;
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmationPassword");
    let errors = [];
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
        errors, defaultPwd: {
          username,
        }
      };
    }

    const responseData = await editPassword(USERNAME, allData);

    dispatch(noteActions.show());
    dispatch(noteActions.relaunch());
    dispatch(noteActions.sendData(responseData))
    if (!responseData.includes("Mot de passe mis à jour")) {
      dispatch(noteActions.error(false));
    }

    dialog1.current.close()
    navigate("/")
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

  function handleClick() {
    if (memo) {
      localStorage.removeItem("memo")
    } else {
      localStorage.setItem("memo", inputUserName.current.value)
    }
  }


  const [formState, formAction] = useActionState(handleSubmit, handleUpdatePassword, { errors: null })

  return <>
    <motion.form action={formAction} className="bg-sky-50 rounded-lg shadow-xl text-sky-50 p-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer" whileHover={{ scale: 1.05 }} ref={scope}>
      <Input label="Login *" type="text" name="username" placeholder="Nom utilisateur" defaultValue={memo} className="border border-sky-950" onBlur={(event) => handleBlur("username", event.target.value)} error={error.username} ref={inputUserName} />
      <Input label="Mot de passe *" type="password" name="password" placeholder="Mot de passe" className="border border-sky-950" onBlur={(event) => handleBlur("password", event.target.value)} error={error.password} ref={inputPassword} />
      <Submit>
        Login
      </Submit>
      <div className="mt-4 w-full text-sky-950 flex gap-4 justify-center">
        <input type="checkbox" name="memo" id="memo" ref={inputCheck} defaultChecked={memo ? true : false} onClick={handleClick} className="outline-sky-950" />
        <label htmlFor="memo">Se souvenir de moi</label>
      </div>
    </motion.form>

    <AnimatePresence>
      {formState.errors && <Notification key={relaunch} error={errorNotification} messages={formState.errors} />}
    </AnimatePresence>

    <AnimatePresence>
      <Modal ref={dialog} title="Déconnexion" size="lg:w-2/9 lg:h-3/12">
        <p className="p-2 text-center mb-2">Souhaitez-vous vous déconnecter?</p>
        <form className="flex justify-center">
          <div className="flex gap-4">
            <Submit formAction={handleDeconnexion}>Se déconnecter</Submit>
          </div>
        </form>
      </Modal>
    </AnimatePresence>

    <AnimatePresence>
      <Modal ref={dialog1} title="Mise à jour du mot de passe" size="lg:w-2/8 lg:h-4/11 xl:h-4/11">
        <form className="flex justify-center flex-col absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" action={handleUpdatePassword} ref={scope}>
          <Input label="Mot de passe *" type="password" name="password" placeholder="Mot de passe" className="border border-sky-950" onBlur={(event) => handleBlurPassword("password", event.target.value)} ref={inputPwd} />
          <Input label="Confirmer *" type="password" name="confirmationPassword" placeholder="Confirmer" className="border border-sky-950" onBlur={() => handleBlurPassword("passwordConfirm", event.target.value)} ref={inputPwdConfirm} />
          <Submit>
            Enregistrer
          </Submit>
        </form>
      </Modal>
    </AnimatePresence>
  </>
}