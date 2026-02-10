import { useMutation } from "@tanstack/react-query";
import { useAnimate } from "framer-motion";
import { useActionState, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAgencyById, getEnterpriseById, getSafeById, queryClient, updateSafe } from "../../utils/http";
import Input from "../../layout/Input.jsx"
import Submit from "../../layout/Submit.jsx"
import { isNotEmpty } from "../../utils/validation.jsx"
import { noteActions } from "../../store/noteSlice.js";
import responseHttp from "../../utils/responseHttp.js"
import { dataTableActions } from "../../store/dataTableSlice.js";
import Modal from "../../layout/Modal.jsx";
import AuthorizationSafeCash from "./AuthorizationSafeCash.jsx";

export default function UpdateSafe() {
    const inputEnterprise = useRef();
    const inputAgency = useRef();
    const inputName = useRef();
    const dispatch = useDispatch();
    const dialog = useRef()
    const [scope, animate] = useAnimate();
    const user = JSON.parse(localStorage.getItem("user"))
    const [data, setData] = useState({
        enterprise: "",
        agency: "",
        name: "",
        slug: ""
    })
    const id = useSelector(state => state.modal.value)
    useEffect(() => {
        async function get(signal) {
            if (user.role.includes("ROLE_ADMIN") && id != "" || user.role.includes("ROLE_COMPTABLE") && id != "") {
                const safe = await getSafeById({ id, signal })
                const enterprise = await getEnterpriseById({ id: safe.enterprise, signal })
                const agency = await getAgencyById({ id: safe.agency, signal })
                setData(prev => {
                    return {
                        ...prev,
                        enterprise: enterprise.slug,
                        agency: agency.slug,
                        slug: safe.slug,
                        name: safe.name,
                    }
                })
            }
        }
        get()

    }, [id])



    async function handleSubmit(prevState, formData, signal) {
        let errors = [];
        const allData = Object.fromEntries(formData.entries())
        const name = formData.get("name")
        const enterprise = formData.get("enterprise")
        const agency = formData.get("agency")



        if (!isNotEmpty(name)) {
            animate(inputName.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez renseigner le nom.")
        }


        if (!isNotEmpty(agency)) {
            animate(inputAgency.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("Veuillez renseigner l'agence.")
        }

        if (!isNotEmpty(enterprise)) {
            animate(inputEnterprise.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("Veuillez renseigner l'entreprise.")
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
        const safe = await getSafeById({ id, signal })


        mutate({ slug: safe.slug, safeDto: allData })
        return { errors: null }
    }


    const [formState, formAction] = useActionState(handleSubmit, { errors: null })


    const { mutate } = useMutation({
        mutationFn: updateSafe,
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
    }

    function handleClick() {
        dispatch(dataTableActions.getSafeSlug({ safeSlug: data?.slug }))
        dialog.current.open()
    }


    return <>

        <form action={formAction} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg text-sky-50 p-4" ref={scope}>
            <div className="flex flex-col justify-between gap-2">
                <Input label="Entreprise *" type="text" defaultValue={data?.enterprise} name="enterprise" placeholder="Nom de l'entreprise" className="border border-sky-950" onBlur={(event) => handleBlur("enterprise", event.target.value)} ref={inputEnterprise} readOnly />
                <Input label="Nom *" type="text" defaultValue={data?.agency} name="agency" placeholder="Nom de l'agence" className="border border-sky-950" onBlur={(event) => handleBlur("agency", event.target.value)} ref={inputAgency} readOnly />
                <Input label="Nom *" type="text" defaultValue={data?.name} name="name" placeholder="Nom de l'agence" className="border border-sky-950" onBlur={(event) => handleBlur("name", event.target.value)} ref={inputName} />
            </div>

            <Submit>
                Enregistrer
            </Submit>
        </form>

        <Submit className="absolute bottom-5 left-1/2 transform -translate-x-1/2" onClick={handleClick}>
            Caisses autorisées
        </Submit>

        <Modal ref={dialog} size="lg:h-6/11 lg:w-12/15 overflow-auto" title="Caisses autorisées">
            <AuthorizationSafeCash />
        </Modal>



    </>

}