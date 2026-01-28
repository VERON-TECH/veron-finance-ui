import Submit from "../../layout/Submit";
import { isEmail, isNotEmpty } from "../../utils/validation";
import { useActionState, useEffect, useRef, useState, } from "react";
import { activateUser, addUser, editUser, getUserById, queryClient, reinitialise } from "../../utils/http";
import Input from "../../layout/Input"
import { roles } from "../../data/menu.js";
import Select from "../../layout/Select";
import { useMutation, useQuery } from "@tanstack/react-query";
import { noteActions } from "../../store/noteSlice";
import { useDispatch, useSelector } from "react-redux";
import responseHttp from "../../utils/responseHttp";
import { useAnimate } from "framer-motion";

export default function EditUser() {

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
    const refUsers = formData.get("refUsers");
    const actualRole = formData.get("actualRole")


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

    if (role === null && user.role.includes("ROLE_ADMIN")) {
      animate(selectRole.current, { x: [0, 15, 0] }, { bounce: 0.75 })
      errors.push("Le rôle est obligatoire !")
    }

    if (!isNotEmpty(actualRole)) {
      errors.push("Le rôle est obligatoire !")
    }

    if (!isNotEmpty(fullName)) {
      animate(inputFullName.current, { x: [0, 15, 0] }, { bounce: 0.75 })
      errors.push("Le nom complet est obligatoire !")
    }

    if (!isNotEmpty(refUsers)) {
      errors.push("Lea référence est obligatoire !")
    }


    if (errors.length > 0) {
      dispatch(noteActions.show());
      dispatch(noteActions.error(true));
      dispatch(noteActions.relaunch());
      dispatch(noteActions.sendData(errors))

      return { errors }
    }


    delete allData.actualRole
    if (user.role.includes("ROLE_SUPERADMIN")) {
      allData.role = actualRole
    }
    mutate(allData)
    return { errors: null }
  }


  const [formState, formAction] = useActionState(handleSubmit, { errors: null })

  const id = useSelector(state => state.modal.value)
  const { data } = useQuery({
    queryKey: ["users", { id }],
    queryFn: ({ signal }) => getUserById({ signal, id }),
    enabled: user.role.includes("ROLE_SUPERADMIN") && id !== "" && id !== undefined || user.role.includes("ROLE_ADMIN") && id !== "" && id !== undefined
  })

  const { mutate } = useMutation({
    mutationFn: editUser,
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


  async function handleChange() {
    const responseData = await activateUser({ refUsers: data?.refUsers, enabled: data?.enabled })
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


  async function handleReinitialise() {
    const responseData = await reinitialise({ refUsers: data?.refUsers })
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

  return <>

    <form action={formAction} className="mb-4 text-green-50 p-4" ref={scope}>
      <div className="flex flex-col justify-between gap-2">
        <Input label="Réf.*" type="text" defaultValue={data?.refUsers} name="refUsers" placeholder="Référence" className="border border-green-950" readOnly />
        <Input label="Nom complet*" type="fullName" defaultValue={data?.fullName} name="fullName" placeholder="Nom complet" className="border border-green-950" onBlur={(event) => handleBlur("fullName", event.target.value)} ref={inputFullName} />
        <Input label="Tél. *" type="text" defaultValue={data?.phone} name="phone" placeholder="Nº de téléphone" className="border border-green-950" onBlur={(event) => handleBlur("phone", event.target.value)} ref={inputPhone} />
        <Input label="E-mail *" type="text" defaultValue={data?.email} name="email" placeholder="E-mail" className="border border-green-950" onBlur={(event) => handleBlur("email", event.target.value)} ref={inputEmail} />
        <Input label="Rôle actuel *" type="text" defaultValue={data?.role} name="actualRole" placeholder="Rôle" className="border border-green-950" readOnly />
        {user.role.includes("ROLE_ADMIN") && <Select label="Rôle *" id="role" name="role" selectedTitle="Sélectionner un rôle" data={role} ref={selectRole} />}
      </div>
      <Submit>
        Enregistrer
      </Submit>
    </form>
    <div className="flex justify-center border gap-8 p-4 rounded-xl bg-green-950 text-green-50">
      <label htmlFor="activation">Utilisateur activé ? </label>
      <input type="checkbox" id="activation" checked={data?.enabled} onChange={handleChange} />
    </div>

    <div className="flex justify-center border gap-8 p-4 rounded-xl bg-green-950 text-green-50">
      <Submit onClick={handleReinitialise}>
        Réinitialiser
      </Submit>
    </div>

  </>
}