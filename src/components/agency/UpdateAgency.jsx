import { useMutation } from "@tanstack/react-query";
import { useAnimate } from "framer-motion";
import { useActionState, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAgencyById, getEnterpriseById, queryClient, updateAgency } from "../../utils/http";
import Input from "../../layout/Input.jsx"
import Submit from "../../layout/Submit.jsx"
import { isEmail, isNotEmpty } from "../../utils/validation.jsx"
import { noteActions } from "../../store/noteSlice.js";
import responseHttp from "../../utils/responseHttp.js"

export default function UpdateAgency() {
    const inputEnterprise = useRef();
    const inputName = useRef();
    const inputPhone = useRef();
    const inputEmail = useRef();
    const inputAddress = useRef();
    const dispatch = useDispatch();
    const [scope, animate] = useAnimate();
    const user = JSON.parse(localStorage.getItem("user"))
    const [data, setData] = useState({
        enterprise: "",
        agency: {}
    })


    const id = useSelector(state => state.modal.value)


    useEffect(() => {
        if (id !== "") {
            async function get(signal) {
                if (user.role.includes("ROLE_ADMIN") && id != "") {
                    const agency = await getAgencyById({ signal, id })
                    const enterprise = await getEnterpriseById({ signal, id: agency?.enterprise })
                    setData(prev => {
                        return {
                            ...prev,
                            enterprise: enterprise.slug,
                            agency: agency
                        }
                    })
                }
            }
            get()
        }

    }, [id])

    async function handleSubmit(prevState, formData) {
        const allData = Object.fromEntries(formData.entries())
        let errors = [];


        const name = formData.get("name")
        const enterprise = formData.get("enterprise")
        const phone = formData.get("phone")
        const email = formData.get("email")
        const address = formData.get("address")
        const slug = formData.get("slug")



        if (!isNotEmpty(name)) {
            animate(inputName.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez renseigner le nom.")
        }


        if (!isNotEmpty(email)) {
            animate(inputEmail.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("Veuillez renseigner l'adresse email.")
        }

        if (!isNotEmpty(address)) {
            animate(inputAddress.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez renseigner l'adresse.")
        }



        if (!isNotEmpty(phone)) {
            animate(inputPhone.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("Veuillez renseigner le numéro de téléphone.")
        }


        if (!isNotEmpty(enterprise)) {
            animate(inputEnterprise.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("Veuillez sélectionner l'entreprise.")
        }

        if (!isNotEmpty(slug)) {
            errors.push("L'identifiant est absent.")
        }


        if (errors.length > 0) {
            dispatch(noteActions.show());
            dispatch(noteActions.error(true));
            dispatch(noteActions.relaunch());
            dispatch(noteActions.sendData(errors))

            return {
                errors
            }
        }

        mutate({ slug, agencyDto: allData })
        return { errors: null }
    }


    const [formState, formAction] = useActionState(handleSubmit, { errors: null })


    const { mutate } = useMutation({
        mutationFn: updateAgency,
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
            queryClient.cancelQueries(["agencies"])
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



        if (field === "address") {
            if (value === null) {
                animate(inputAddress.current, { x: [0, 15, 0] }, { bounce: 0.75 })
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

        <form action={formAction} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg text-sky-50 p-4" ref={scope}>
            <div className="flex flex-col justify-between gap-2">
                <Input label="Entreprise *" type="text" name="enterprise" id="enterprise" defaultValue={data?.enterprise} readOnly className="border border-sky-950" ref={inputEnterprise} />
                <Input label="Nom *" type="text" defaultValue={data?.agency.name} name="name" placeholder="Nom de l'agence" className="border border-sky-950" onBlur={(event) => handleBlur("name", event.target.value)} ref={inputName} />
                <Input label="Adresse *" id="adress" type="text" defaultValue={data?.agency.address} name="address" placeholder="Adresse" className="border border-sky-950" onBlur={(event) => handleBlur("address", event.target.value)} ref={inputAddress} />
                <Input label="Tél.*" id="phone" type="text" defaultValue={data?.agency.phone} name="phone" placeholder="Nº de téléphone" className="border border-sky-950" onBlur={(event) => handleBlur("phone", event.target.value)} ref={inputPhone} />
                <Input label="Email *" id="email" type="email" defaultValue={data?.agency.email} name="email" placeholder="Email" className="border border-sky-950" onBlur={(event) => handleBlur("email", event.target.value)} ref={inputEmail} />
                <Input label="" id="slug" type="text" defaultValue={data?.agency.slug} name="slug" placeholder="Slug" className="border border-sky-950 hidden" />
            </div>

            <Submit>
                Enregistrer
            </Submit>
        </form>


    </>

}