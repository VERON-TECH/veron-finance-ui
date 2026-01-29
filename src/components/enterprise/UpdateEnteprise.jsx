import { useMutation, useQuery } from "@tanstack/react-query";
import { useAnimate } from "framer-motion";
import { useActionState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEnterpriseById, updateEnterprise } from "../../utils/http";
import Select from "../../layout/Select.jsx"
import Input from "../../layout/Input.jsx"
import Submit from "../../layout/Submit.jsx"
import { countries } from "../../data/info.js";
import { isEmail, isNotEmpty } from "../../utils/validation.jsx"
import { noteActions } from "../../store/noteSlice.js";
import responseHttp from "../../utils/responseHttp.js"

export default function UpdateEnterprise() {
    const selectCountry = useRef();
    const inputName = useRef();
    const inputPhone = useRef();
    const inputPhone2 = useRef();
    const inputEmail = useRef();
    const inputAddress = useRef();
    const inputBox = useRef();
    const inputUniqueIdentificationNumber = useRef();
    const inputCommercialRegister = useRef();
    const inputAuthorizationNumber = useRef();
    const inputSlogan = useRef();
    const user = JSON.parse(localStorage.getItem("user"))



    const dispatch = useDispatch();
    const [scope, animate] = useAnimate();

    const id = useSelector(state => state.modal.value)
    const { data } = useQuery({
        queryKey: ["enterprises", { id }],
        queryFn: ({ signal }) => getEnterpriseById({ signal, id }),
        enabled: user.role.includes("ROLE_ADMIN") && id !== ""
    })


    async function handleSubmit(prevState, formData) {
        const allData = Object.fromEntries(formData.entries())
        let errors = [];

        const name = formData.get("name")
        const country = formData.get("country")
        const phone = formData.get("phone")
        const phone2 = formData.get("phone2")
        const email = formData.get("email")
        const address = formData.get("address")
        const box = formData.get("box")
        const uniqueIdentificationNumber = formData.get("uniqueIdentificationNumber")
        const commercialRegister = formData.get("commercialRegister")
        const authorizationNumber = formData.get("authorizationNumber")
        const slogan = formData.get("slogan")
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

        if (!isNotEmpty(uniqueIdentificationNumber)) {
            animate(inputUniqueIdentificationNumber.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("Veuillez renseigner le numéro unique.")
        }


        if (!isNotEmpty(phone) && !isNotEmpty(phone2)) {
            animate(inputPhone.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            animate(inputPhone2.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("Veuillez renseigner le numéro de téléphone.")
        }

        if (!isNotEmpty(authorizationNumber)) {
            animate(inputAuthorizationNumber.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez renseigner le nº de l'agréement.")
        }

        if (!isNotEmpty(slogan)) {
            animate(inputSlogan.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez renseigner le slogan.")
        }


        if (country === null) {
            animate(selectCountry.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("Veuillez sélectionner le pays de résidence.")
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
        const enterpriseDto = allData;
        mutate({ slug, enterpriseDto })
        return { errors: null }
    }


    const [formState, formAction] = useActionState(handleSubmit, { errors: null })


    const { mutate } = useMutation({
        mutationFn: updateEnterprise,
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
            queryClient.cancelQueries(["enterprises"])
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


        if (field === "phone2") {
            if (!isNotEmpty(value)) {
                animate(inputPhone2.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }


        if (field === "authorizationNumber") {
            if (!isNotEmpty(value)) {
                animate(inputAuthorizationNumber.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }


        if (field === "address") {
            if (value === null) {
                animate(inputAddress.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }


        if (field === "box") {
            if (!isNotEmpty(value)) {
                animate(inputBox.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }

        if (field === "uniqueIdentificationNumber") {
            if (!isNotEmpty(value)) {
                animate(inputUniqueIdentificationNumber.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }

        if (field === "slogan") {
            if (!isNotEmpty(value)) {
                animate(inputSlogan.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }

        if (field === "commercialRegister") {
            if (!isNotEmpty(value)) {
                animate(inputCommercialRegister.current, { x: [0, 15, 0] }, { bounce: 0.75 })
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

        <form action={formAction} className="rounded-lg text-sky-50 p-4" ref={scope}>

            <div className="flex justify-between gap-2">
                <Select label="Pays *" id="country" name="country" selectedTitle="Sélectionner un pays" data={countries} ref={selectCountry} />
                <Input label="Nom *" type="text" defaultValue={data?.name} name="name" placeholder="Nom de l'entreprise" className="border border-sky-950" onBlur={(event) => handleBlur("name", event.target.value)} ref={inputName} />
            </div>

            <div className="flex justify-between gap-2">
                <Input label="Tél.*" id="phone" type="text" defaultValue={data?.phone} name="phone" placeholder="Nº de téléphone" className="border border-sky-950" onBlur={(event) => handleBlur("phone", event.target.value)} ref={inputPhone} />
                <Input label="Tél2." id="phone2" type="text" defaultValue={data?.phone2} name="phone2" placeholder="Nº de téléphone 2" className="border border-sky-950" onBlur={(event) => handleBlur("phone2", event.target.value)} ref={inputPhone2} />
            </div>


            <div className="flex justify-between gap-2">
                <Input label="Email *" id="email" type="email" defaultValue={data?.email} name="email" placeholder="Email" className="border border-sky-950" onBlur={(event) => handleBlur("email", event.target.value)} ref={inputEmail} />
                <Input label="Adresse *" id="adress" type="text" defaultValue={data?.address} name="address" placeholder="Adresse" className="border border-sky-950" onBlur={(event) => handleBlur("address", event.target.value)} ref={inputAddress} />
            </div>


            <div className="flex justify-between gap-2">
                <Input label="B.P. " id="box" type="text" defaultValue={data?.box} name="box" placeholder="Boite postale" className="border border-sky-950" onBlur={(event) => handleBlur("address", event.target.value)} ref={inputBox} />
                <Input label="Numéro unique *" id="uniqueIdentificationNumber" type="text" defaultValue={data?.uniqueIdentificationNumber} name="uniqueIdentificationNumber" placeholder="Numéro unique" className="border border-sky-950" onBlur={(event) => handleBlur("uniqueIdentificationNumber", event.target.value)} ref={inputUniqueIdentificationNumber} />
            </div>

            <div className="flex justify-between gap-2">
                <Input label="Régistre de commerce" id="commercialRegister" type="text" defaultValue={data?.commercialRegister} name="commercialRegister" placeholder="Régistre de commerce" className="border border-sky-950" onBlur={(event) => handleBlur("commercialRegister", event.target.value)} ref={inputCommercialRegister} />
                <Input label="Agréément " id="authorizationNumber" type="text" defaultValue={data?.authorizationNumber} name="authorizationNumber" placeholder="Agréement" className="border border-sky-950" onBlur={(event) => handleBlur("authorizationNumber", event.target.value)} ref={inputAuthorizationNumber} />
            </div>


            <div className="flex justify-between gap-2">
                <Input label="Slogan *" id="slogan" type="textarea" defaultValue={data?.slogan} name="slogan" placeholder="Slogan" className="border border-sky-950" onBlur={(event) => handleBlur("slogan", event.target.value)} ref={inputSlogan} />
                <Input label="" id="slug" type="text" defaultValue={data?.slug} name="slug" placeholder="Slug" className="border border-sky-950 hidden" />
            </div>

            <Submit>
                Enregistrer
            </Submit>
        </form>


    </>
}