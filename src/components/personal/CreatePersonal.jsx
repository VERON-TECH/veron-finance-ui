
import { useMutation } from "@tanstack/react-query";
import { useAnimate } from "framer-motion";
import { useActionState, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { createPersonal, getAllAgenciesByEnterprise, getAllEnterprises, getAllTitles, getEnterpriseBySlug, queryClient } from "../../utils/http";
import Input from "../../layout/Input.jsx"
import Submit from "../../layout/Submit.jsx"
import { isNotEmpty } from "../../utils/validation.jsx"
import { noteActions } from "../../store/noteSlice.js";
import responseHttp from "../../utils/responseHttp.js"
import Select from "../../layout/Select.jsx";
import { cities, genders } from "../../data/info.js";

export default function CreatePersonal() {

    const selectEnterprise = useRef();
    const selectAgency = useRef();
    const selectCity = useRef();
    const selectGender = useRef();
    const selectTitle = useRef();

    const inputFirstName = useRef();
    const inputLastName = useRef();
    const inputEmail = useRef();
    const inputPhone = useRef();
    const inputPhone2 = useRef();
    const inputAddress = useRef();
    const inputBox = useRef();
    const inputDateBirth = useRef();
    const inputPlaceBirth = useRef();

    const dispatch = useDispatch();
    const [scope, animate] = useAnimate();
    const [data, setData] = useState({
        agencies: [],
        enterprises: [],
        titles: []
    })


    useEffect(() => {
        let tbEl = {
            tb: [],
            tb1: [],
        }
        async function get() {
            const allEnterprises = await getAllEnterprises()
            const allTitles = await getAllTitles()
            allTitles.forEach(t => {
                tbEl.tb.push({ key: t.id, name: t.name, value: t.slug })
            })
            allEnterprises.forEach(e => {
                tbEl.tb1.push({ key: e.id, name: e.name, value: e.slug })
            })
            setData(prev => {
                return {
                    ...prev,
                    titles: tbEl.tb,
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
        const agency = formData.get("agency")
        const firstName = formData.get("firstName")
        const lastName = formData.get("lastName")
        const email = formData.get("email")
        const phone = formData.get("phone")
        const phone2 = formData.get("phone2")
        const address = formData.get("address")
        const city = formData.get("city")
        const box = formData.get("box")
        const gender = formData.get("gender")
        const dateBirth = formData.get("dateBirth")
        const placeBirth = formData.get("placeBirth")
        const title = formData.get("title")

        if (!isNotEmpty(firstName)) {
            animate(inputFirstName.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez renseigner le prénom.")
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


        if (title === null) {
            animate(selectTitle.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez sélectionner la fonction.")
        }

        if (city === null) {
            animate(selectCity.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez sélectionner la ville.")
        }


        if (gender === null) {
            animate(selectGender.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez sélectionner le genre.")
        }

        if (dateBirth === null) {
            animate(inputDateBirth.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez sélectionner la date de naissance.")
        }


        if (agency === null) {
            animate(selectAgency.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez sélectionner l'agence.")
        }

        if (enterprise === null) {
            animate(selectEnterprise.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez sélectionner l'entrerprise.")
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
                    box,
                    placeBirth
                }
            }
        }

        mutate(allData)
        return { errors: null }
    }


    const [formState, formAction] = useActionState(handleSubmit, { errors: null })


    const { mutate } = useMutation({
        mutationFn: createPersonal,
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
            queryClient.cancelQueries(["personals"])
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

        if (field === "box") {
            if (!isNotEmpty(value)) {
                animate(inputBox.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }

        if (field === "placeBirth") {
            if (!isNotEmpty(value)) {
                animate(inputPlaceBirth.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }
    }

    async function handleChange(identifier, id, signal) {
        let tb = []
        if (identifier === "enterprise") {
            const enterprise = await getEnterpriseBySlug({ slug: id, signal })
            const allAgencies = await getAllAgenciesByEnterprise(enterprise.id)
            allAgencies.forEach(a => {
                tb.push({ key: a.id, name: a.name, value: a.slug })
            })
            setData(prev => {
                return {
                    ...prev,
                    agencies: tb
                }
            })

        }
    }




    return <>

        <form action={formAction} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg text-sky-50 p-4" ref={scope}>

            <div className="flex justify-between gap-2">
                <Select label="Entreprise *" id="enterprise" name="enterprise" selectedTitle="Sélectionner une entreprise" data={data?.enterprises} ref={selectEnterprise} onChange={(e) => handleChange("enterprise", e.target.value)} />
                <Select label="Agence *" id="agency" name="agency" selectedTitle="Sélectionner une agence" data={data?.agencies} ref={selectAgency} />
            </div>

            <div className="flex justify-between gap-2">
                <Select label="Fonction *" id="title" name="title" selectedTitle="Sélectionner une fonction" data={data?.titles} ref={selectTitle} />
                <Select label="Genre *" id="gender" name="gender" selectedTitle="Sélectionner un genre" data={genders} ref={selectGender} />
            </div>

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
                <Input label="B.P." id="box" type="text" defaultValue={formState.enteredValue?.box} name="box" placeholder="Boite postale" className="border border-sky-950" onBlur={(event) => handleBlur("box", event.target.value)} ref={inputBox} />
            </div>F

            <div className="flex justify-between gap-2">
                <Select label="Ville *" id="city" name="city" selectedTitle="Sélectionner une ville" data={cities} ref={selectCity} />
                <Input label="Adresse *" id="adress" type="text" defaultValue={formState.enteredValue?.address} name="address" placeholder="Adresse" className="border border-sky-950" onBlur={(event) => handleBlur("address", event.target.value)} ref={inputAddress} />
            </div>




            <Submit>
                Créer
            </Submit>
        </form>


    </>

}