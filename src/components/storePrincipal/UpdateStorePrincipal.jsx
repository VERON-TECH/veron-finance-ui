import { useMutation } from "@tanstack/react-query";
import { useAnimate } from "framer-motion";
import { useActionState, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEnterpriseById, getStorePrincipalById, queryClient, updateStorePrincipal } from "../../utils/http";
import Input from "../../layout/Input.jsx"
import Submit from "../../layout/Submit.jsx"
import { isNotEmpty } from "../../utils/validation.jsx"
import { noteActions } from "../../store/noteSlice.js";
import responseHttp from "../../utils/responseHttp.js"
import { dataTableActions } from "../../store/dataTableSlice.js";
import AuthorizationStorePrincipalAgency from "./AuthorizationStorePrincipalAgency.jsx";
import Modal from "../../layout/Modal.jsx";

export default function UpdateStorePrincipal() {
    const inputEnterprise = useRef();
    const inputName = useRef();
    const dispatch = useDispatch();
    const dialog = useRef();
    const [scope, animate] = useAnimate();
    const user = JSON.parse(localStorage.getItem("user"))
    const [data, setData] = useState({
        enterprise: "",
        name: "",
        slug: ""
    })
    const id = useSelector(state => state.modal.value)
    useEffect(() => {
        async function get(signal) {
            if (user.role.includes("ROLE_ADMIN") && id !== "" || user.role.includes("ROLE_COMPTABLE") && id !== "") {
                const storePrincipal = await getStorePrincipalById({ id, signal })
                const enterprise = await getEnterpriseById({ id: storePrincipal.enterprise, signal })

                setData(prev => {
                    return {
                        ...prev,
                        enterprise: enterprise.slug,
                        slug: storePrincipal.slug,
                        name: storePrincipal.name,
                    }
                })
            }
        }
        get()

    }, [id])



    async function handleSubmit(prevState, formData, signal) {
        let errors = [];
        const allData = Object.fromEntries(formData.entries())
        const enterprise = formData.get("enterprise")
        const name = formData.get("name")



        if (!isNotEmpty(name)) {
            animate(inputName.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez renseigner le nom.")
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
        const storePrincipal = await getStorePrincipalById({ id, signal })


        mutate({ slug: storePrincipal.slug, storePrincipalDto: allData })
        return { errors: null }
    }


    const [formState, formAction] = useActionState(handleSubmit, { errors: null })


    const { mutate } = useMutation({
        mutationFn: updateStorePrincipal,
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
            queryClient.cancelQueries(["storeprincipals"])
        }
    })





    function handleBlur(field, value) {

        if (field === "name") {
            if (!isNotEmpty(value)) {
                animate(inputName.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }

        if (field === "enterprise") {
            if (!isNotEmpty(value)) {
                animate(inputEnterprise.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }



    }


    function handleClick() {
        dispatch(dataTableActions.getStorePrincipalSlug({ storePrincipalSlug: data?.slug }))
        dialog.current.open()
    }

    return <>

        <form action={formAction} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg text-sky-50 p-4" ref={scope}>

            <div className="flex flex-col justify-between gap-2">
                <Input label="Entreprise *" type="text" defaultValue={data?.enterprise} name="enterprise" placeholder="Nom de l'entreprise" className="border border-sky-950" onBlur={(event) => handleBlur("enterprise", event.target.value)} ref={inputEnterprise} readOnly />
                <Input label="Nom *" type="text" defaultValue={data?.name} name="name" placeholder="Nom du magasin principal" className="border border-sky-950" onBlur={(event) => handleBlur("name", event.target.value)} ref={inputName} />
            </div>

            {user?.role.includes("ROLE_ADMIN") && <Submit>
                Enregistrer
            </Submit>}
        </form>

        {user?.role.includes("ROLE_ADMIN") && <Submit onClick={handleClick} className="absolute bottom-5 left-1/2 transform -translate-x-1/2">
            Agences autorisées
        </Submit>}

        <Modal ref={dialog} size="lg:h-6/11 lg:w-12/15 overflow-auto" title="Agences autorisés">
            <AuthorizationStorePrincipalAgency />
        </Modal>


    </>

}