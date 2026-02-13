
import { useMutation } from "@tanstack/react-query";
import { useAnimate } from "framer-motion";
import { useActionState, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { createUser, generateUUID, getAllPersonals, queryClient } from "../../utils/http";
import Input from "../../layout/Input.jsx"
import Submit from "../../layout/Submit.jsx"
import { isNotEmpty } from "../../utils/validation.jsx"
import { noteActions } from "../../store/noteSlice.js";
import responseHttp from "../../utils/responseHttp.js"
import Select from "../../layout/Select.jsx";

export default function CreateUser() {
    const user = JSON.parse(localStorage.getItem("user"))
    const selectPersonal = useRef();
    const inputPassword = useRef();
    const inputConfirmationPassword = useRef();



    const dispatch = useDispatch();
    const [scope, animate] = useAnimate();
    const [data, setData] = useState({
        personals: [],
        uuid: ""
    })


    useEffect(() => {
        let tbEl = {
            tb: [],
        }
        async function get(signal) {
            const uuid = await generateUUID()
            const allpersonals = await getAllPersonals({ signal, enterprise: user?.enterprise, agency: user.agency })
            allpersonals.forEach(p => {
                tbEl.tb.push({ key: p.id, name: p.lastName + " " + p.firstName, value: p.slug })
            })

            setData(prev => {
                return {
                    ...prev,
                    personals: tbEl.tb,
                    uuid,
                }
            })
        }
        get()
    }, [])

    async function handleSubmit(prevState, formData) {
        const allData = Object.fromEntries(formData.entries())
        let errors = [];

        const personal = formData.get("personal")
        const password = formData.get("password")
        const confirmationPassword = formData.get("confirmationPassword")


        if (!isNotEmpty(password)) {
            animate(inputPassword.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez renseigner le mot de passe.")
        }

        if (!isNotEmpty(confirmationPassword)) {
            animate(inputConfirmationPassword.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez confirmer le mot de passe.")
        }

        if (password !== confirmationPassword) {
            animate(inputPassword.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            animate(inputConfirmationPassword.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("Les mot de passe ne sont pas identiques.")
        }



        if (personal === null) {
            animate(selectPersonal.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez sélectionner l'entrerprise.")
        }


        if (errors.length > 0) {
            dispatch(noteActions.show());
            dispatch(noteActions.error(true));
            dispatch(noteActions.relaunch());
            dispatch(noteActions.sendData(errors))

            return {

                errors,
            }
        }

        mutate(allData)
        return { errors: null }
    }


    const [formState, formAction] = useActionState(handleSubmit, { errors: null })


    const { mutate } = useMutation({
        mutationFn: createUser,
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


    function handleBlur(field, value) {

        if (field === "password") {
            if (!isNotEmpty(value)) {
                animate(inputPassword.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }

        if (field === "confirmationPassword") {
            if (!isNotEmpty(value)) {
                animate(inputConfirmationPassword.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }


    }




    return <>

        <form action={formAction} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg text-sky-50 p-4" ref={scope}>

            <div className="flex flex-col justify-between gap-2">
                <Select label="Employés *" id="personal" name="personal" selectedTitle="Sélectionner un employé" data={data?.personals} ref={selectPersonal} />
                <Input label="Mot de passe *" id="password" defaultValue={data.uuid} type="password" name="password" placeholder="Mot de passe" className="border border-sky-950" onBlur={(event) => handleBlur("password", event.target.value)} ref={inputPassword} />
                <Input label="Confirmer *" id="confirmationPassword" defaultValue={data.uuid} type="password" name="confirmationPassword" placeholder="Confirmer le Mot de passe" className="border border-sky-950" onBlur={(event) => handleBlur("confirmationPassword", event.target.value)} ref={inputConfirmationPassword} />
            </div>


            <Submit>
                Créer
            </Submit>
        </form>


    </>

}