import { useMutation } from "@tanstack/react-query";
import { useAnimate } from "framer-motion";
import { useActionState, useRef } from "react";
import { useDispatch } from "react-redux";
import { createSupplier, queryClient } from "../../utils/http.js";
import Input from "../../layout/Input.jsx"
import Submit from "../../layout/Submit.jsx"
import { isNotEmpty } from "../../utils/validation.jsx"
import { noteActions } from "../../store/noteSlice.js";
import responseHttp from "../../utils/responseHttp.js"

export default function CreateSupplier() {

    const user = JSON.parse(localStorage.getItem("user"));
    const inputName = useRef()
    const inputPhone = useRef()
    const inputEmail = useRef();
    const inputAddress = useRef();
    const inputFocalPoint = useRef();
    const dispatch = useDispatch();
    const [scope, animate] = useAnimate();

    async function handleSubmit(prevState, formData) {
        const allData = Object.fromEntries(formData.entries())
        let errors = [];
        const name = formData.get("name")
        const phone = formData.get("phone")
        const email = formData.get("email")
        const address = formData.get("address")
        const focalPoint = formData.get("focalPoint")


        if (!isNotEmpty(name)) {
            animate(inputName.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez renseigner le nom du fournisseur")
        }

        if (!isNotEmpty(phone)) {
            animate(inputPhone.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez renseigner le nº de téléphone.")
        }



        if (!isNotEmpty(address)) {
            animate(inputAddress.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez renseigner l'adresse.")
        }




        if (errors.length > 0) {
            dispatch(noteActions.show());
            dispatch(noteActions.error(true));
            dispatch(noteActions.relaunch());
            dispatch(noteActions.sendData(errors))

            return {
                errors, enteredValue: {
                    name,
                    phone,
                    email,
                    address,
                    focalPoint
                }
            }
        }

        mutate(allData)
        return { errors: null }
    }


    const [formState, formAction] = useActionState(handleSubmit, { errors: null })


    const { mutate } = useMutation({
        mutationFn: createSupplier,
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
            queryClient.cancelQueries(["suppliers"])
        }
    })


    function handleBlur(field, value) {

        if (field === "name") {
            if (!isNotEmpty(value)) {
                animate(inputName.current, { x: [0, 15, 0] }, { bounce: 0.75 })
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
        }

        if (field === "address") {
            if (!isNotEmpty(value)) {
                animate(inputAddress.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }

        if (field === "focalPoint") {
            if (!isNotEmpty(value)) {
                animate(inputFocalPoint.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }

    }

    return <>

        <form action={formAction} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg text-sky-50 p-4" ref={scope}>
            <div className="flex flex-col justify-between gap-2">
                <Input label="Nom *" type="text" defaultValue={formState.enteredValue?.name} name="name" placeholder="Nom du fournisseur" className="border border-sky-950" ref={inputName} />
                <Input label="Tél. *" type="text" defaultValue={formState.enteredValue?.phone} name="phone" placeholder="Nº de téléphone" className="border border-sky-950" ref={inputPhone} />
                <Input label="E-mail" type="text" defaultValue={formState.enteredValue?.email} name="email" placeholder="Adresse email" className="border border-sky-950" ref={inputEmail} />
                <Input label="Adresse *" type="text" defaultValue={formState.enteredValue?.address} name="address" placeholder="Adresse" className="border border-sky-950" ref={inputAddress} />
                <Input label="Point focal" type="text" defaultValue={formState.enteredValue?.focalPoint} name="focalPoint" placeholder="Point focal" className="border border-sky-950" ref={inputFocalPoint} />
            </div>
            <Submit>
                Créer
            </Submit>
        </form>


    </>
}