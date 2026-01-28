import Submit from "../../layout/Submit";
import { isEmail, isNotEmpty } from "../../utils/validation";
import { useActionState, useEffect, useRef, useState, } from "react";
import { addUser, queryClient } from "../../utils/http";
import Input from "../../layout/Input"
import { roles } from "../../data/menu.js";
import Select from "../../layout/Select";
import { useMutation } from "@tanstack/react-query";
import { noteActions } from "../../store/noteSlice";
import { useDispatch } from "react-redux";
import responseHttp from "../../utils/responseHttp";
import { useAnimate } from "framer-motion";

export default function CreateUser() {

  const user = JSON.parse(localStorage.getItem("user"));
  const dispatch = useDispatch();
  const selectRole = useRef();
  const inputEmail = useRef();
  const inputPhone = useRef();
  const inputFullName = useRef();
  const [scope, animate] = useAnimate()

  async function handleSubmit(prevState, formData) {
    const allData = Object.fromEntries(formData.entries())
    let errors = [];


    const role = formData.get("role");
    const phone = formData.get("phone");
    const email = formData.get("email");
    const fullName = formData.get("fullName");


    if (!isNotEmpty(email)) {
      animate(inputEmail.current, { x: [0, 15, 0] }, { bounce: 0.75 })
      errors.push("L'email' est obligatoire !")
    }

    if (!isEmail(email)) {
      animate(inputEmail.current, { x: [0, 15, 0] }, { bounce: 0.75 })
      errors.push("Bien vouloir renseigner une adresse e-mail valide !")
    }


    if (!isNotEmpty(phone)) {
      animate(inputPhone.current, { x: [0, 15, 0] }, { bounce: 0.75 })
      errors.push("Le Nº du téléphone est obligatoire !")
    }

    if (role === null) {
      animate(selectRole.current, { x: [0, 15, 0] }, { bounce: 0.75 })
      errors.push("Le rôle est obligatoire !")
    }

    if (!isNotEmpty(fullName)) {
      animate(inputFullName.current, { x: [0, 15, 0] }, { bounce: 0.75 })
      errors.push("Le nom complet est obligatoire !")
    }


    if (errors.length > 0) {
      dispatch(noteActions.show());
      dispatch(noteActions.error(true));
      dispatch(noteActions.relaunch());
      dispatch(noteActions.sendData(errors))

      return {
        errors, enteredValue: {
          phone,
          email,
          fullName,
        }
      }
    }

    mutate(allData)
    return { errors: null }
  }


  const [formState, formAction] = useActionState(handleSubmit, { errors: null })


  const { mutate } = useMutation({
    mutationFn: addUser,
    onSuccess: (responseData) => {
      const state = responseHttp(responseData);
      if (state) {
        dispatch(noteActions.error(true))
      } else {
        dispatch(noteActions.error(false))
      }
      dispatch(noteActions.show());
      dispatch(noteActions.relaunch());
      dispatch(noteActions.sendData(responseData))
      queryClient.cancelQueries(["users"])
    }
  })


  const [role, setRole] = useState([])
  useEffect(() => {
    let tb = []
    if (!user.role.includes("ROLE_SUPERADMIN")) {
      roles.forEach(r => {
        if (r.value !== "ROLE_ADMIN") {
          tb.push({ key: r.key, name: r.name, value: r.value })
        }

      })
    } else {
      tb.push({ key: 0, name: "ADMIN", value: "ROLE_ADMIN" })
    }
    setRole(tb)
  }, [])


  function handleBlur(field, value) {
    if (field === "fullName") {
      if (!isNotEmpty(value)) {
        animate(inputFullName.current, { x: [0, 15, 0] }, { bounce: 0.75 })
      }
    }

    if (field === "phone") {
      if (!isNotEmpty(value)) {
        animate(inputPhone.current, { x: [0, 15, 0] }, { bounce: 0.75 })
      }
    }

    if (field === "email") {
      if (!isNotEmpty(value)) {
        animate(inputEmail.current, { x: [0, 15, 0] }, { bounce: 0.75 })
      }
      if (!isEmail(value)) {
        animate(inputEmail.current, { x: [0, 15, 0] }, { bounce: 0.75 })
      }
    }
  }


  return <>

    <form action={formAction} className="rounded-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-green-50 p-4" ref={scope}>
      <div className="flex flex-col justify-between gap-2">
        <Input label="Nom complet*" type="fullName" defaultValue={formState.enteredValue?.fullName} name="fullName" placeholder="Nom complet" className="border border-green-950" onBlur={(event) => handleBlur("fullName", event.target.value)} ref={inputFullName} />
        <Input label="Tél. *" type="text" defaultValue={formState.enteredValue?.phone} name="phone" placeholder="Nº de téléphone" className="border border-green-950" onBlur={(event) => handleBlur("phone", event.target.value)} ref={inputPhone} />
        <Input label="E-mail *" type="text" defaultValue={formState.enteredValue?.email} name="email" placeholder="E-mail" className="border border-green-950" onBlur={(event) => handleBlur("email", event.target.value)} ref={inputEmail} />
        <Select label="Rôle *" id="role" name="role" selectedTitle="Sélectionner un rôle" data={role} ref={selectRole} />
      </div>

      <Submit>
        Créer
      </Submit>
    </form>


  </>
}