import { useMutation } from "@tanstack/react-query";
import { useAnimate } from "framer-motion";
import { useActionState, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authorizeAgencyBank, authorizeAgencyMobile, authorizeAgencyStorePrincipal, authorizeCashSafe, getAllAgenciesByEnterprise, getAllCashesByAgency, getBankAccountById, getEnterpriseById, getMobileMoneyById, getSafeById, getStorePrincipalById } from "../../utils/http.js";
import Input from "../../layout/Input.jsx"
import Submit from "../../layout/Submit.jsx"
import { isNotEmpty } from "../../utils/validation.jsx"
import { noteActions } from "../../store/noteSlice.js";
import responseHttp from "../../utils/responseHttp.js"
import Select from "../../layout/Select.jsx";

export default function AuhtorizeAgency() {
    const inputEnterprise = useRef();
    const selectAgency = useRef();
    const selectCash = useRef();
    const inputRib = useRef();
    const inputMobileSlug = useRef();
    const inputStorePrincipalSlug = useRef();
    const inputSafeSlug = useRef();
    const dispatch = useDispatch();
    const [scope, animate] = useAnimate();
    const user = JSON.parse(localStorage.getItem("user"))
    const [data, setData] = useState({
        agencies: [],
        cashes: [],
        enterprise: "",
        rib: "",
        mobileSlug: "",
        storePrincipalSlug: "",
        safeSlug: ""
    })
    const id = useSelector(state => state.modal.value)
    const authorize = useSelector(state => state.authorize)

    useEffect(() => {
        let tb = []
        async function get(signal) {
            if (user.role.includes("ROLE_ADMIN") && id != "" && authorize !== "" || user.role.includes("ROLE_COMPTABLE") && id != "" && authorize !== "") {
                if (authorize === "bank") {
                    const bankAccount = await getBankAccountById({ id, signal })
                    const enterprise = await getEnterpriseById({ id: bankAccount.enterprise, signal })
                    const agencies = await getAllAgenciesByEnterprise(bankAccount.enterprise)
                    agencies.forEach(a => {
                        tb.push({ key: a.id, name: a.name, value: a.slug })
                    })
                    setData(prev => {
                        return {
                            ...prev,
                            enterprise: enterprise.slug,
                            agencies: tb,
                            rib: bankAccount.rib,
                        }
                    })
                } else if (authorize === "mobile") {
                    const mobileMoney = await getMobileMoneyById({ id, signal })
                    const enterprise = await getEnterpriseById({ id: mobileMoney.enterprise, signal })
                    const agencies = await getAllAgenciesByEnterprise(mobileMoney.enterprise)
                    agencies.forEach(a => {
                        tb.push({ key: a.id, name: a.name, value: a.slug })
                    })
                    setData(prev => {
                        return {
                            ...prev,
                            enterprise: enterprise.slug,
                            agencies: tb,
                            mobileSlug: mobileMoney.slug,
                        }
                    })
                } else if (authorize === "storePrincipal") {
                    const storePrincipal = await getStorePrincipalById({ id, signal })
                    const enterprise = await getEnterpriseById({ id: storePrincipal.enterprise, signal })
                    const agencies = await getAllAgenciesByEnterprise(storePrincipal.enterprise)
                    agencies.forEach(a => {
                        tb.push({ key: a.id, name: a.name, value: a.slug })
                    })
                    setData(prev => {
                        return {
                            ...prev,
                            enterprise: enterprise.slug,
                            agencies: tb,
                            storePrincipalSlug: storePrincipal.slug,
                        }
                    })
                } else if (authorize === "safe") {
                    const safe = await getSafeById({ id, signal })
                    const enterprise = await getEnterpriseById({ id: safe.enterprise, signal })
                    const cashes = await getAllCashesByAgency(safe.agency)
                    cashes.forEach(c => {
                        tb.push({ key: c.id, name: c.name, value: c.slug })
                    })
                    setData(prev => {
                        return {
                            ...prev,
                            enterprise: enterprise.slug,
                            agencies: tb,
                            safeSlug: safe.slug,
                            cashes: tb
                        }
                    })
                }

            }
        }
        get()

    }, [id, authorize])



    async function handleSubmit(prevState, formData, signal) {
        let errors = [];
        if (authorize === "bank") {
            const rib = formData.get("rib")
            const enterprise = formData.get("enterprise")
            const agency = formData.get("agency")


            if (!isNotEmpty(rib)) {
                animate(inputRib.current, { x: [0, 15, 0] }, { bounce: 0.75 })
                errors.push("veuillez renseigner le R.I.B.")
            }


            if (agency === null) {
                animate(selectAgency.current, { x: [0, 15, 0] }, { bounce: 0.75 })
                errors.push("Veuillez sélectionner une agence.")
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

            const bankAccount = await getBankAccountById({ id, signal })

            mutate({ slug: agency, rib: bankAccount.rib })
            return { errors: null }
        } else if (authorize === "mobile") {
            const mobileSlug = formData.get("mobileSlug")
            const enterprise = formData.get("enterprise")
            const agency = formData.get("agency")


            if (!isNotEmpty(mobileSlug)) {
                animate(inputMobileSlug.current, { x: [0, 15, 0] }, { bounce: 0.75 })
                errors.push("veuillez renseigner le compte mobile money")
            }


            if (agency === null) {
                animate(selectAgency.current, { x: [0, 15, 0] }, { bounce: 0.75 })
                errors.push("Veuillez sélectionner une agence.")
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

            mutate({ slug: agency, identification: mobileMoney.slug })
            return { errors: null }
        } else if (authorize === "storePrincipal") {
            const storePrincipalSlug = formData.get("storePrincipalSlug")
            const enterprise = formData.get("enterprise")
            const agency = formData.get("agency")


            if (!isNotEmpty(storePrincipalSlug)) {
                animate(inputStorePrincipalSlug.current, { x: [0, 15, 0] }, { bounce: 0.75 })
                errors.push("veuillez renseigner le magasin principal")
            }


            if (agency === null) {
                animate(selectAgency.current, { x: [0, 15, 0] }, { bounce: 0.75 })
                errors.push("Veuillez sélectionner une agence.")
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

            mutate({ slug: agency, identification: storePrincipal.slug })
            return { errors: null }
        } else if (authorize === "safe") {
            const safeSlug = formData.get("safeSlug")
            const enterprise = formData.get("enterprise")
            const cash = formData.get("cash")


            if (!isNotEmpty(safeSlug)) {
                animate(inputSafeSlug.current, { x: [0, 15, 0] }, { bounce: 0.75 })
                errors.push("veuillez renseigner le coffre-fort.")
            }


            if (cash === null) {
                animate(selectCash.current, { x: [0, 15, 0] }, { bounce: 0.75 })
                errors.push("Veuillez sélectionner une caisse.")
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

            mutate({ slug: cash, slugSafe: safe.slug })
            return { errors: null }
        }


    }


    const [formState, formAction] = useActionState(handleSubmit, { errors: null })


    const { mutate } = useMutation({
        mutationFn: authorize === "bank" ? authorizeAgencyBank : authorize === "mobile" ? authorizeAgencyMobile : authorize === "storePrincipal" ? authorizeAgencyStorePrincipal : authorize === "safe" ? authorizeCashSafe : undefined,
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
        }
    })





    function handleBlur(field, value) {
        if (field === "enterprise") {
            if (!isNotEmpty(value)) {
                animate(inputEnterprise.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }

        if (authorize === "bank") {
            if (field === "rib") {
                if (!isNotEmpty(value)) {
                    animate(inputRib.current, { x: [0, 15, 0] }, { bounce: 0.75 })
                }
            }
        } else if (authorize === "mobile") {
            if (field === "mobileSlug") {
                if (!isNotEmpty(value)) {
                    animate(inputMobileSlug.current, { x: [0, 15, 0] }, { bounce: 0.75 })
                }
            }
        } else if (authorize === "storePrincipal") {
            if (field === "storePrincipalSlug") {
                if (!isNotEmpty(value)) {
                    animate(inputStorePrincipalSlug.current, { x: [0, 15, 0] }, { bounce: 0.75 })
                }
            }
        } else if (authorize === "safe") {
            if (field === "safeSlug") {
                if (!isNotEmpty(value)) {
                    animate(inputSafeSlug.current, { x: [0, 15, 0] }, { bounce: 0.75 })
                }
            }
        }



    }


    return <>



        <form action={formAction} className="rounded-lg text-sky-50 p-4" ref={scope}>
            <div className="flex flex-col justify-between gap-2">
                <Input label="Entreprise *" type="text" defaultValue={data?.enterprise} name="enterprise" placeholder="Nom de l'entreprise" className="border border-sky-950" onBlur={(event) => handleBlur("enterprise", event.target.value)} ref={inputEnterprise} readOnly />
                {authorize === "bank" && <Input label="R.I.B. *" type="text" defaultValue={data?.rib} name="rib" placeholder="Nº du compte bancaire" className="border border-sky-950" onBlur={(event) => handleBlur("rib", event.target.value)} ref={inputRib} readOnly />}
                {authorize === "mobile" && <Input label="Mobile money *" type="text" defaultValue={data?.mobileSlug} name="mobileSlug" placeholder="Nº du compte mobile" className="border border-sky-950" onBlur={(event) => handleBlur("mobileslug", event.target.value)} ref={inputMobileSlug} readOnly />}
                {authorize === "storePrincipal" && <Input label="Magasin principal *" type="text" defaultValue={data?.storePrincipalSlug} name="storePrincipalSlug" placeholder="Magasin principal" className="border border-sky-950" onBlur={(event) => handleBlur("storePrincipalSlug", event.target.value)} ref={inputStorePrincipalSlug} readOnly />}
                {authorize === "safe" && <Input label="Coffre-fort *" type="text" defaultValue={data?.safeSlug} name="safeSlug" placeholder="Coffre-fort" className="border border-sky-950" onBlur={(event) => handleBlur("safeSlug", event.target.value)} ref={inputSafeSlug} readOnly />}
                {authorize === "bank" || authorize === "mobile" || authorize === "storePrincipal" && <Select label="Agence *" id="agency" name="agency" selectedTitle="Sélectionner une agence" data={data?.agencies} ref={selectAgency} />}
                {authorize === "safe" && <Select label="Caisse *" id="cash" name="cash" selectedTitle="Sélectionner une caisse" data={data?.cashes} ref={selectCash} />}
            </div>


            <Submit>
                Enregistrer
            </Submit>
        </form>


    </>

}