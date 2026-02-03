import { useMutation } from "@tanstack/react-query";
import { useAnimate } from "framer-motion";
import { useActionState, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { createService, getCategoryService, getEnterpriseById, queryClient } from "../../utils/http.js";
import Input from "../../layout/Input.jsx"
import Submit from "../../layout/Submit.jsx"
import { isNotEmpty } from "../../utils/validation.jsx"
import { noteActions } from "../../store/noteSlice.js";
import responseHttp from "../../utils/responseHttp.js"
import Select from "../../layout/Select.jsx";

export default function CreateService() {

    const user = JSON.parse(localStorage.getItem("user"));
    const selectEnterprise = useRef();
    const selectCategory = useRef();
    const inputName = useRef();
    const inputPrice = useRef();
    const inputDescription = useRef();
    const dispatch = useDispatch();
    const [scope, animate] = useAnimate();
    const [data, setData] = useState({
        enterprises: [],
        categories: []
    })

    useEffect(() => {
        let tbEl = {
            tb: [],
            tb1: []
        }
        async function get(signal) {
            const allCategories = await getCategoryService()
            const allEnterprises = await getEnterpriseById({ id: user.enterprise, signal })
            allCategories.forEach(c => {
                if (c.name !== "VENTES") {
                    tbEl.tb.push({ key: c.id, name: c.name, value: c.slug })
                }

            })

            tbEl.tb1.push({ key: allEnterprises.id, name: allEnterprises.name, value: allEnterprises.slug })

            setData(prev => {
                return {
                    ...prev,
                    categories: tbEl.tb,
                    enterprises: tbEl.tb1
                }
            })
        }
        get()
    }, [])

    async function handleSubmit(prevState, formData) {
        const allData = Object.fromEntries(formData.entries())
        let errors = [];
        const enterprise = formData.get("enterprise")
        const name = formData.get("name")
        const category = formData.get("category")
        const description = formData.get("description")
        const price = formData.get("price")

        if (!isNotEmpty(name)) {
            animate(inputName.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez renseigner le nom du service.")
        }

        if (category === null) {
            animate(selectCategory.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez sélectionner la catégorie du service.")
        }

        if (enterprise === null) {
            animate(selectEnterprise.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez sélectionner l'entrerprise.")
        }

        if (!isNotEmpty(description)) {
            animate(inputDescription.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez renseigner la description du service.")
        }

        if (price <= 0) {
            animate(inputPrice.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez renseigner le nom du service.")
        }


        if (errors.length > 0) {
            dispatch(noteActions.show());
            dispatch(noteActions.error(true));
            dispatch(noteActions.relaunch());
            dispatch(noteActions.sendData(errors))

            return {
                errors, enteredValue: {
                    name,
                    description,
                    price,
                }
            }
        }

        mutate(allData)
        return { errors: null }
    }


    const [formState, formAction] = useActionState(handleSubmit, { errors: null })


    const { mutate } = useMutation({
        mutationFn: createService,
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
            queryClient.cancelQueries(["services"])
        }
    })


    function handleBlur(field, value) {



        if (field === "name") {
            if (!isNotEmpty(value)) {
                animate(inputName.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }

        if (field === "description") {
            if (!isNotEmpty(value)) {
                animate(inputDescription.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }

        if (field === "price") {
            if (value <= 0) {
                animate(inputPrice.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }
    }

    function handleChange(identifier) {
        if (identifier !== "") {
            inputDescription.current.value = inputName.current.value + " (" + inputPrice.current.value + " FCFA)"
        }

    }




    return <>

        <form action={formAction} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg text-sky-50 p-4" ref={scope}>
            <div className="flex flex-col justify-between gap-2">
                <Select label="Entreprise *" id="enterprise" name="enterprise" selectedTitle="Sélectionner une entreprise" data={data?.enterprises} ref={selectEnterprise} />
                <Select label="Catégorie *" id="category" name="category" selectedTitle="Sélectionner une catégorie" data={data?.categories} ref={selectCategory} />
                <Input label="Nom *" type="text" defaultValue={formState.enteredValue?.name} name="name" placeholder="Nom du service" className="border border-sky-950" onBlur={(event) => handleBlur("name", event.target.value)} ref={inputName} onChange={() => handleChange("name")} />
                <Input label="Prix *" type="number" defaultValue={formState.enteredValue?.price} name="price" placeholder="Prix du service" className="border border-sky-950" onBlur={(event) => handleBlur("price", event.target.value)} ref={inputPrice} onChange={() => handleChange("price")} />
                <Input label="Description *" type="textarea" defaultValue={formState.enteredValue?.description} name="description" placeholder="Description du service" className="border border-sky-950" onBlur={(event) => handleBlur("description", event.target.value)} ref={inputDescription} />
            </div>

            <Submit>
                Créer
            </Submit>
        </form>


    </>

}