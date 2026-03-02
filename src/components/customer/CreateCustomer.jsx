
import { useMutation } from "@tanstack/react-query";
import { useAnimate } from "framer-motion";
import { useActionState, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { createCustomer, getAllCustomers, getEnterpriseById, queryClient } from "../../utils/http";
import Input from "../../layout/Input.jsx"
import Submit from "../../layout/Submit.jsx"
import { isNotEmpty } from "../../utils/validation.jsx"
import { noteActions } from "../../store/noteSlice.js";
import responseHttp from "../../utils/responseHttp.js"
import Select from "../../layout/Select.jsx";
import { genders } from "../../data/info.js";
import { identifierMenuActions } from "../../store/identifierSlice.js";

export default function CreateCustomer() {
    const user = JSON.parse(localStorage.getItem("user"))
    const selectGender = useRef();
    const inputFirstName = useRef();
    const inputLastName = useRef();
    const inputEmail = useRef();
    const inputPhone = useRef();
    const inputPhone2 = useRef();
    const inputAddress = useRef();
    const inputDateBirth = useRef();
    const inputPlaceBirth = useRef();
    const inputEnterprise = useRef();

    const dispatch = useDispatch();
    const [scope, animate] = useAnimate();
    const [data, setData] = useState({
        enterprise: ""
    })

    useEffect(() => {
        async function get(signal) {
            const enterprise_ = await getEnterpriseById({ id: user.enterprise, signal })
            setData(prev => {
                return { ...prev, enterprise: enterprise_.slug }
            })
        }
        get()


    }, [])



    async function handleSubmit(prevState, formData, signal) {
        const allData = Object.fromEntries(formData.entries())
        let errors = [];
        const firstName = formData.get("firstName")
        const lastName = formData.get("lastName")
        const email = formData.get("email")
        const phone = formData.get("phone")
        const address = formData.get("address")
        const phone2 = formData.get("phone2")
        const gender = formData.get("gender")
        const dateBirth = formData.get("dateBirth")
        const placeBirth = formData.get("placeBirth")
        const enterprise = formData.get("enterprise")


        if (!isNotEmpty(firstName)) {
            animate(inputFirstName.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez renseigner le prénom.")
        }

        if (!isNotEmpty(enterprise)) {
            animate(inputEnterprise.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("Aucune entreprise disponible.")
        }

        if (!isNotEmpty(lastName)) {
            animate(inputLastName.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez renseigner le prénom.")
        }

        if (!isNotEmpty(email)) {
            animate(inputEmail.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("Veuillez renseigner l'adresse email.")
        }

        if (!isNotEmpty(phone)) {
            animate(inputPhone.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez renseigner le nº de téléphone.")
        }

        if (!isNotEmpty(address)) {
            animate(inputAddress.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez renseigner l'adresse.")
        }

        if (!isNotEmpty(placeBirth)) {
            animate(inputPlaceBirth.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez renseigner le lieu de naissance.")
        }

        if (dateBirth === null) {
            animate(inputDateBirth.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez sélectionner la date de naissance.")
        }


        if (gender === null) {
            animate(selectGender.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez sélectionner le genre.")
        }


        if (errors.length > 0) {
            dispatch(noteActions.show());
            dispatch(noteActions.error(true));
            dispatch(noteActions.relaunch());
            dispatch(noteActions.sendData(errors))

            return {

                errors, enteredValue: {
                    firstName,
                    lastName,
                    email,
                    phone,
                    phone2,
                    address,
                    placeBirth
                }
            }
        }

        mutate(allData)
        const getAllCustomer = await getAllCustomers({ signal, enterprise: user.enterprise })
        const customer = getAllCustomer[getAllCustomer.length - 1]
        dispatch(identifierMenuActions.updateCustomer({ customer }))
        return { errors: null }
    }


    const [formState, formAction] = useActionState(handleSubmit, { errors: null })


    const { mutate } = useMutation({
        mutationFn: createCustomer,
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
            queryClient.cancelQueries(["customers"])
        }
    })


    function handleBlur(field, value) {

        if (field === "firstName") {
            if (!isNotEmpty(value)) {
                animate(inputFirstName.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }

        if (field === "lastName") {
            if (!isNotEmpty(value)) {
                animate(inputLastName.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }

        if (field === "email") {
            if (!isNotEmpty(value)) {
                animate(inputEmail.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }

        if (field === "phone") {
            if (!isNotEmpty(value)) {
                animate(inputPhone.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }

        if (field === "phone2") {
            if (!isNotEmpty(value)) {
                animate(inputPhone2.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }

        if (field === "address") {
            if (!isNotEmpty(value)) {
                animate(inputAddress.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }



        if (field === "placeBirth") {
            if (!isNotEmpty(value)) {
                animate(inputPlaceBirth.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }
    }





    return <>

        <form action={formAction} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg text-sky-50 p-4" ref={scope}>


            <div className="flex justify-between gap-2">
                <Input label="Nom *" id="lastName" type="text" defaultValue={formState.enteredValue?.lastName} name="lastName" placeholder="Nom" className="border border-sky-950" onBlur={(event) => handleBlur("lastName", event.target.value)} ref={inputLastName} />
                <Input label="Prénom *" id="firstName" type="text" defaultValue={formState.enteredValue?.firstName} name="firstName" placeholder="Prénom" className="border border-sky-950" onBlur={(event) => handleBlur("firstName", event.target.value)} ref={inputFirstName} />
            </div>

            <div className="flex justify-between gap-2">
                <Input label="Date naissance*" id="dateBirth" type="date" defaultValue={formState.enteredValue?.dateBirth} name="dateBirth" placeholder="Date de naissance" className="border border-sky-950" onBlur={(event) => handleBlur("dateBirth", event.target.value)} ref={inputDateBirth} />
                <Input label="Lieu de naissance*" id="placeBirth" type="text" defaultValue={formState.enteredValue?.placeBirth} name="placeBirth" placeholder="Lieu de naissance" className="border border-sky-950" onBlur={(event) => handleBlur("placeBirth", event.target.value)} ref={inputPlaceBirth} />
            </div>

            <div className="flex justify-between gap-2">
                <Input label="Tél.*" id="phone" type="text" defaultValue={formState.enteredValue?.phone} name="phone" placeholder="Nº de téléphone" className="border border-sky-950" onBlur={(event) => handleBlur("phone", event.target.value)} ref={inputPhone} />
                <Input label="Tél2." id="phone2" type="text" defaultValue={formState.enteredValue?.phone2} name="phone2" placeholder="Nº de téléphone 2" className="border border-sky-950" onBlur={(event) => handleBlur("phone2", event.target.value)} ref={inputPhone2} />
            </div>


            <div className="flex justify-between gap-2">
                <Input label="Email *" id="email" type="email" defaultValue={formState.enteredValue?.email} name="email" placeholder="Email" className="border border-sky-950" onBlur={(event) => handleBlur("email", event.target.value)} ref={inputEmail} />
                <Select label="Genre *" id="gender" name="gender" selectedTitle="Sélectionner un genre" data={genders} ref={selectGender} />
            </div>

            <div className="flex justify-between gap-2">
                <Input label="Adresse *" id="adress" type="text" defaultValue={formState.enteredValue?.address} name="address" placeholder="Adresse" className="border border-sky-950" onBlur={(event) => handleBlur("address", event.target.value)} ref={inputAddress} />
                <Input label="Entreprise *" id="enterprise" type="text" defaultValue={data?.enterprise} name="enterprise" placeholder="Entreprise" className="border border-sky-950" ref={inputEnterprise} readOnly />

            </div>




            <Submit>
                Créer
            </Submit>
        </form>


    </>

}