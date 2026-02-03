import { useMutation } from "@tanstack/react-query";
import { useAnimate } from "framer-motion";
import { useActionState, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createStore, getAgencyById, getEnterpriseById, getStoreById, queryClient, updateStore } from "../../utils/http.js";
import Input from "../../layout/Input.jsx"
import Submit from "../../layout/Submit.jsx"
import { isNotEmpty } from "../../utils/validation.jsx"
import { noteActions } from "../../store/noteSlice.js";
import responseHttp from "../../utils/responseHttp.js"

export default function UpdateStore() {

    const user = JSON.parse(localStorage.getItem("user"));
    const id = useSelector(state => state.modal.value)
    const inputEnterprise = useRef();
    const inputAgency = useRef();
    const inputName = useRef();
    const dispatch = useDispatch();
    const [scope, animate] = useAnimate();
    const [data, setData] = useState({
        enterprise: "",
        agency: "",
        store: {}
    })

    useEffect(() => {
        if (id !== "" && id !== undefined) {
            async function get(signal) {
                const store = await getStoreById({ id, signal })
                const agency = await getAgencyById({ id: store.agency, signal })
                const enterprise = await getEnterpriseById({ id: store.enterprise, signal })

                setData(prev => {
                    return {
                        ...prev,
                        agency: agency.slug,
                        enterprise: enterprise.slug,
                        store
                    }
                })
            }
            get()
        }

    }, [id])

    async function handleSubmit(prevState, formData, signal) {
        const allData = Object.fromEntries(formData.entries())
        let errors = [];
        const enterprise = formData.get("enterprise")
        const agency = formData.get("agency")
        const name = formData.get("name")


        if (!isNotEmpty(name)) {
            animate(inputName.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez renseigner le nom du magasin.")
        }

        if (!isNotEmpty(enterprise)) {
            animate(inputEnterprise.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez sélectionner l'entreprise'.")
        }

        if (!isNotEmpty(agency)) {
            animate(inputAgency.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez sélectionner l'agence'.")
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

        const store = await getStoreById({ id, signal })
        mutate({ slug: store.slug, storeDto: allData })
        return { errors: null }
    }


    const [formState, formAction] = useActionState(handleSubmit, { errors: null })


    const { mutate } = useMutation({
        mutationFn: updateStore,
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
            queryClient.cancelQueries(["stores"])
        }
    })


    function handleBlur(field, value) {



        if (field === "name") {
            if (!isNotEmpty(value)) {
                animate(inputName.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }

    }






    return <>

        <form action={formAction} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg text-sky-50 p-4" ref={scope}>
            <div className="flex flex-col justify-between gap-2">
                <Input label="Entreprise *" type="text" defaultValue={data?.enterprise} name="enterprise" placeholder="Nom de l'entreprise" className="border border-sky-950" ref={inputEnterprise} readOnly />
                <Input label="Agence *" type="text" defaultValue={data?.agency} name="agency" placeholder="Nom de l'agence" className="border border-sky-950" ref={inputAgency} readOnly />
                <Input label="Nom *" type="text" defaultValue={data?.store?.name} name="name" placeholder="Nom du magasin" className="border border-sky-950" onBlur={(event) => handleBlur("name", event.target.value)} ref={inputName} />
            </div>
            <Submit>
                Enregistrer
            </Submit>
        </form>


    </>

}