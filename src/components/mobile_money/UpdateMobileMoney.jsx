import { useMutation } from "@tanstack/react-query";
import { useAnimate } from "framer-motion";
import { useActionState, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOperators, getEnterpriseById, getMobileMoneyById, getOperatorById, queryClient, updateMobileMoney } from "../../utils/http";
import Input from "../../layout/Input.jsx"
import Submit from "../../layout/Submit.jsx"
import { isNotEmpty } from "../../utils/validation.jsx"
import { noteActions } from "../../store/noteSlice.js";
import responseHttp from "../../utils/responseHttp.js"
import Select from "../../layout/Select.jsx";
import { dataTableActions } from "../../store/dataTableSlice.js";
import Modal from "../../layout/Modal.jsx";
import AuthorizationMobileMoneyAgency from "./AuthorizationMobileMoneyAgency.jsx";

export default function UpdateMobileMoney() {
    const dialog = useRef();
    const inputEnterprise = useRef();
    const selectOperator = useRef();
    const inputOperator = useRef();
    const inputCountry = useRef();
    const inputPhone = useRef();
    const dispatch = useDispatch();
    const [scope, animate] = useAnimate();
    const user = JSON.parse(localStorage.getItem("user"))
    const [data, setData] = useState({
        enterprise: "",
        operator: "",
        country: "",
        phone: "",
        slug: "",
        operators: []
    })
    const id = useSelector(state => state.modal.value)
    useEffect(() => {
        let tb = []
        async function get(signal) {
            if (user.role.includes("ROLE_ADMIN") && id != "" || user.role.includes("ROLE_COMPTABLE") && id != "") {
                const mobileMoney = await getMobileMoneyById({ id, signal })
                const operator = await getOperatorById({ id: mobileMoney.operator, signal })
                const enterprise = await getEnterpriseById({ id: mobileMoney.enterprise, signal })
                const operators = await getAllOperators()
                operators.forEach(o => {
                    tb.push({ id: o.id, name: o.name, value: o.slug })
                })
                setData(prev => {
                    return {
                        ...prev,
                        enterprise: enterprise.slug,
                        operator: operator.slug,
                        country: mobileMoney.country,
                        phone: mobileMoney.phone,
                        slug: mobileMoney.slug,
                        operators: tb
                    }
                })
            }
        }
        get()

    }, [id])



    async function handleSubmit(prevState, formData, signal) {
        let errors = [];
        const country = formData.get("country")
        const enterprise = formData.get("enterprise")
        const operator = formData.get("operator")
        const phone = formData.get("phone")


        if (!isNotEmpty(phone)) {
            animate(inputPhone.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez renseigner le nº de téléphone.")
        }


        if (operator === null) {
            animate(selectOperator.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("Veuillez sélectionner l'opérateur.")
        }

        if (!isNotEmpty(country)) {
            animate(inputCountry.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("Veuillez sélectionner l'opérateur.")
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
        const mobileMoney = await getMobileMoneyById({ id, signal })

        const allData = {
            enterprise,
            country,
            operator,
            phone
        }

        mutate({ slug: mobileMoney.slug, mobileMoneyDto: allData })
        return { errors: null }
    }


    const [formState, formAction] = useActionState(handleSubmit, { errors: null })


    const { mutate } = useMutation({
        mutationFn: updateMobileMoney,
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
            queryClient.cancelQueries(["mobilemonies"])
        }
    })





    function handleBlur(field, value) {

        if (field === "phone") {
            if (!isNotEmpty(value)) {
                animate(inputPhone.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }

        if (field === "country") {
            if (!isNotEmpty(value)) {
                animate(inputCountry.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }

        if (field === "operator") {
            if (!isNotEmpty(value)) {
                animate(inputCountry.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }


    }

    function handleClick() {
        dispatch(dataTableActions.getMobileMoneySlug({ mobileMoneySlug: data?.slug }))
        dialog.current.open()
    }


    return <>

        <form action={formAction} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg text-sky-50 p-4" ref={scope}>


            <div className="flex flex-col justify-between gap-2">
                <Input label="Opérateur actuel *" type="text" defaultValue={data?.operator} name="actualOperator" placeholder="Opérateur actuel" className="border border-sky-950" onBlur={(event) => handleBlur("operator", event.target.value)} ref={inputOperator} readOnly />
                <Select label="Opérateurs *" id="operator" name="operator" selectedTitle="Sélectionner un opérateur" data={data?.operators} ref={selectOperator} />
                <Input label="Pays *" type="text" defaultValue={data?.country} name="country" placeholder="Nom du pays" className="border border-sky-950" onBlur={(event) => handleBlur("country", event.target.value)} ref={inputCountry} readOnly />
                <Input label="Entreprise *" type="text" defaultValue={data?.enterprise} name="enterprise" placeholder="Nom de l'entreprise" className="border border-sky-950" onBlur={(event) => handleBlur("enterprise", event.target.value)} ref={inputEnterprise} readOnly />
                <Input label="Tél. *" type="text" defaultValue={data?.phone} name="phone" placeholder="Nº téléphone" className="border border-sky-950" onBlur={(event) => handleBlur("phone", event.target.value)} ref={inputPhone} />
            </div>

            {user.role.includes("ROLE_ADMIN") && <Submit>
                Enregistrer
            </Submit>}
        </form>

        {user.role.includes("ROLE_ADMIN") && <Submit onClick={handleClick} className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
            Agences autorisées
        </Submit>}

        <Modal ref={dialog} size="lg:h-6/11 lg:w-12/15 overflow-auto" title="Agences autorisés">
            <AuthorizationMobileMoneyAgency />
        </Modal>


    </>

}