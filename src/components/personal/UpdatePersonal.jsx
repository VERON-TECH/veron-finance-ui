import { useMutation } from "@tanstack/react-query";
import { useAnimate } from "framer-motion";
import { useActionState, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAgencyById, getAllTitles, getAuthoritiByUsername, getEnterpriseById, getPersonalById, getTitleById, getUserByPersonal, queryClient, updatePersonal } from "../../utils/http";
import Input from "../../layout/Input.jsx"
import Submit from "../../layout/Submit.jsx"
import { isNotEmpty } from "../../utils/validation.jsx"
import { noteActions } from "../../store/noteSlice.js";
import responseHttp from "../../utils/responseHttp.js"
import Select from "../../layout/Select.jsx";
import { cities, genders } from "../../data/info.js";
import Modal from "../../layout/Modal.jsx";
import AffectPersonal from "./AffectPersonal.jsx";
import AttributeCashAndStore from "./AttributeCashAndStore.jsx";

export default function UpdatePersonal() {
    const user = JSON.parse(localStorage.getItem("user"))
    const inputEnterprise = useRef();
    const inputAgency = useRef();
    const selectCity = useRef();
    const inputCity = useRef();
    const selectGender = useRef();
    const inputGender = useRef();
    const selectTitle = useRef();
    const inputTitle = useRef();

    const inputFirstName = useRef();
    const inputLastName = useRef();
    const inputEmail = useRef();
    const inputPhone = useRef();
    const inputPhone2 = useRef();
    const inputAddress = useRef();
    const inputBox = useRef();
    const inputDateBirth = useRef();
    const inputPlaceBirth = useRef();
    const dialog = useRef()
    const dialog1 = useRef()

    const dispatch = useDispatch();
    const [scope, animate] = useAnimate();
    const [data, setData] = useState({
        personal: {},
        enterprise: "",
        agency: "",
        title: "",
        authorities: [],
        titles: []
    })
    const id = useSelector(state => state.modal.value);


    useEffect(() => {
        if (user?.role.includes("ROLE_RESPONSABLE_RH") && id != 0 || user.role.includes("ROLE_ADMIN") && id != 0) {
            let tbEl = {
                tb: [],
                tb1: []
            }
            async function get(signal) {
                const personal = await getPersonalById({ id, signal })
                const enterprise = await getEnterpriseById({ id: personal.enterprise, signal })
                const title = await getTitleById({ id: personal.title, signal })
                const allTitles = await getAllTitles()
                allTitles.forEach(t => {
                    tbEl.tb.push({ key: t.id, name: t.name, value: t.slug })
                })
                const agency = await getAgencyById({ id: personal.agency, signal })

                try {
                    const users = await getUserByPersonal({ personal: personal.id, signal })
                    const authorities = await getAuthoritiByUsername(users.username)
                    authorities.forEach(a => {
                        tbEl.tb1.push(a.name)
                    })

                    setData(prev => {
                        return {
                            ...prev,
                            titles: tbEl.tb,
                            personal,
                            enterprise: enterprise.slug,
                            agency: agency.slug,
                            title: title.slug,
                            authorities: tbEl.tb1,
                        }
                    })
                }
                catch {
                    setData(prev => {
                        return {
                            ...prev,
                            titles: tbEl.tb,
                            personal,
                            enterprise: enterprise.slug,
                            agency: agency.slug,
                            title: title.slug,
                        }
                    })
                }

            }
            get()
        }

    }, [id])

    async function handleSubmit(prevState, formData, signal) {
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
        const actualCity = formData.get("actualCity")
        const box = formData.get("box")
        const gender = formData.get("gender")
        const actualGender = formData.get("actualGender")
        const dateBirth = formData.get("dateBirth")
        const placeBirth = formData.get("dateBirth")
        const title = formData.get("title")
        const actualTitle = formData.get("actualTitle")

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



        if (dateBirth === null) {
            animate(inputDateBirth.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez sélectionner la date de naissance.")
        }


        if (!isNotEmpty(agency)) {
            animate(inputAgency.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez renseigner l'agence.")
        }

        if (!isNotEmpty(enterprise)) {
            animate(inputEnterprise.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez renseigner l'entrerprise.")
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

        const allData = {
            enterprise,
            agency,
            firstName,
            lastName,
            email,
            phone,
            phone2,
            address,
            city: city != "Sélectionner une ville" && actualCity != city ? actualCity : city,
            box,
            gender: gender != "Sélectionner un genre" && actualGender != gender ? actualGender : gender,
            dateBirth,
            placeBirth,
            title: title != "Sélectionner une fonction" && actualTitle != title ? actualTitle : title,
        }

        const personal = await getPersonalById({ id, signal })
        mutate({ slug: personal.slug, personalDto: allData })
        return { errors: null }
    }


    const [formState, formAction] = useActionState(handleSubmit, { errors: null })


    const { mutate } = useMutation({
        mutationFn: updatePersonal,
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

    function handleClick(identifier) {
        if (identifier === "affect") {
            dialog.current.open()
        }

        if (identifier === "attribute") {
            dialog1.current.open()
        }
    }


    return <>

        <form action={formAction} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg text-sky-50 p-4" ref={scope}>

            <div className="flex justify-between gap-2">
                <Input label="Entreprise *" id="enterprise" type="text" defaultValue={data?.enterprise} name="enterprise" placeholder="Entreprise" className="border border-sky-950" ref={inputEnterprise} readOnly />
                <Input label="Agence *" id="agency" type="text" defaultValue={data?.agency} name="agency" placeholder="Agence" className="border border-sky-950" ref={inputAgency} readOnly />
            </div>

            <div className="flex justify-between gap-2">
                <Input label="Fonction actuelle *" id="actualTitle" type="text" defaultValue={data?.title} name="actualTitle" placeholder="Fonction" className="border border-sky-950" ref={inputTitle} readOnly />
                <Select label="Fonction *" id="title" name="title" selectedTitle="Sélectionner une fonction" data={data?.titles} ref={selectTitle} />
            </div>

            <div className="flex justify-between gap-2">
                <Input label="Genre actuel *" id="actualGender" type="text" defaultValue={data?.personal.gender} name="actualGender" placeholder="Genre" className="border border-sky-950" ref={inputGender} readOnly />
                <Select label="Genre *" id="gender" name="gender" selectedTitle="Sélectionner un genre" data={genders} ref={selectGender} />
            </div>

            <div className="flex justify-between gap-2">
                <Input label="Nom *" id="lastName" type="text" defaultValue={data?.personal?.lastName} name="lastName" placeholder="Nom" className="border border-sky-950" onBlur={(event) => handleBlur("lastName", event.target.value)} ref={inputLastName} />
                <Input label="Prénom *" id="firstName" type="text" defaultValue={data?.personal?.firstName} name="firstName" placeholder="Prénom" className="border border-sky-950" onBlur={(event) => handleBlur("firstName", event.target.value)} ref={inputFirstName} />
            </div>

            <div className="flex justify-between gap-2">
                <Input label="Date naissance*" id="dateBirth" type="date" defaultValue={data?.personal?.dateBirth} name="dateBirth" placeholder="Date de naissance" className="border border-sky-950" onBlur={(event) => handleBlur("dateBirth", event.target.value)} ref={inputDateBirth} />
                <Input label="Lieu de naissance*" id="placeBirth" type="text" defaultValue={data?.personal?.placeBirth} name="placeBirth" placeholder="Lieu de naissance" className="border border-sky-950" onBlur={(event) => handleBlur("placeBirth", event.target.value)} ref={inputPlaceBirth} />
            </div>

            <div className="flex justify-between gap-2">
                <Input label="Tél.*" id="phone" type="text" defaultValue={data?.personal?.phone} name="phone" placeholder="Nº de téléphone" className="border border-sky-950" onBlur={(event) => handleBlur("phone", event.target.value)} ref={inputPhone} />
                <Input label="Tél2." id="phone2" type="text" defaultValue={data?.personal?.phone2} name="phone2" placeholder="Nº de téléphone 2" className="border border-sky-950" onBlur={(event) => handleBlur("phone2", event.target.value)} ref={inputPhone2} />
            </div>


            <div className="flex justify-between gap-2">
                <Input label="Email *" id="email" type="email" defaultValue={data?.personal?.email} name="email" placeholder="Email" className="border border-sky-950" onBlur={(event) => handleBlur("email", event.target.value)} ref={inputEmail} />
                <Input label="B.P." id="box" type="text" defaultValue={data?.personal?.box} name="box" placeholder="Boite postale" className="border border-sky-950" onBlur={(event) => handleBlur("box", event.target.value)} ref={inputBox} />
            </div>

            <div className="flex justify-between gap-2">
                <Input label="ville actuelle *" id="actualCity" type="text" defaultValue={data?.personal?.city} name="actualCity" placeholder="Ville" className="border border-sky-950" ref={inputCity} readOnly />
                <Select label="Ville *" id="city" name="city" selectedTitle="Sélectionner une ville" data={cities} ref={selectCity} />
            </div>

            <div className="flex justify-between gap-2">
                <Input label="Adresse *" id="adress" type="text" defaultValue={data?.personal?.address} name="address" placeholder="Adresse" className="border border-sky-950" onBlur={(event) => handleBlur("address", event.target.value)} ref={inputAddress} />
            </div>

            {user.role.includes("ROLE_RESPONSABLE_RH") && <Submit>
                Enregistrer
            </Submit>}
        </form>

        {user.role.includes("ROLE_ADMIN") || user.role.includes("ROLE_RESPONSABLE_RH") ? <div className="absolute bottom-10 right-10 flex flex-col gap-2">
            <Submit onClick={() => handleClick("affect")}>
                Gestion des affectations
            </Submit>
            {data?.authorities?.includes("ROLE_CAISSIER") && <Submit onClick={() => handleClick("attribute")}>
                Caisses & Magasins
            </Submit>}
        </div> : undefined}

        <Modal ref={dialog} size="lg:h-4/10 lg:w-5/15 xl:h-4/10" title="Gestion des affectations">
            <AffectPersonal id={id} />
        </Modal>

        <Modal ref={dialog1} size="lg:h-3/10 lg:w-5/15" title="Attribution d'une caisses & magasins">
            <AttributeCashAndStore id={id} />
        </Modal>
    </>
}