import { useMutation } from "@tanstack/react-query";
import { useAnimate } from "framer-motion";
import { useActionState, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { authorizeAgencyBank, authorizeAgencyMobile, authorizeAgencyStorePrincipal, authorizeCashSafe, authorizeEnterpriseSupplier, authorizeStorePrincipalStore, getAllAgenciesByEnterprise, getAllCashesByAgency, getAllEnterprises, getAllStores, getBankAccountById, getEnterpriseById, getMobileMoneyById, getSafeById, getStorePrincipalById, getSupplierById } from "../../utils/http.js";
import Input from "../../layout/Input.jsx"
import { isNotEmpty } from "../../utils/validation.jsx"
import { noteActions } from "../../store/noteSlice.js";
import responseHttp from "../../utils/responseHttp.js"
import Select from "../../layout/Select.jsx";
import Submit from "../../layout/Submit.jsx";

export default function AuhtorizeAgency({ type, id }) {
    const inputEnterprise = useRef();
    const selectEnterprise = useRef();
    const selectAgency = useRef();
    const selectCash = useRef();
    const selectStore = useRef();
    const inputRib = useRef();
    const inputMobileSlug = useRef();
    const inputStorePrincipalSlug = useRef();
    const inputSafeSlug = useRef();
    const inputSupplierSlug = useRef();
    const dispatch = useDispatch();
    const [scope, animate] = useAnimate();
    const user = JSON.parse(localStorage.getItem("user"))
    const [data, setData] = useState({
        agencies: [],
        cashes: [],
        enterprises: [],
        stores: [],
        enterprise: "",
        rib: "",
        mobileSlug: "",
        storePrincipalSlug: "",
        safeSlug: "",
        supplierSlug: "",
    })


    useEffect(() => {
        let tb = []
        async function get(signal) {
            if (user.role.includes("ROLE_ADMIN") && id != "" && type !== "" || user.role.includes("ROLE_COMPTABLE") && id != "" && type !== "") {
                if (type === "bank") {
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
                } else if (type === "mobile") {
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
                } else if (type === "storePrincipal") {
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
                } else if (type === "safe") {
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
                } else if (type === "supplier") {
                    const supplier = await getSupplierById({ id, signal })
                    const enterprises = await getAllEnterprises()
                    enterprises.forEach(e => {
                        tb.push({ key: e.id, name: e.name, value: e.slug })
                    })
                    setData(prev => {
                        return {
                            ...prev,
                            enterprises: tb,
                            supplierSlug: supplier.slug,
                        }
                    })
                } else if (type === "store") {
                    const stores = await getAllStores({ signal, enterprise: user.enterprise, agency: 0 })
                    stores.forEach(s => {
                        if (s.name !== "REBUTS" && s.name !== "CLIENT") {
                            tb.push({ key: s.id, name: s.name, value: s.slug })
                        }

                    })
                    setData(prev => {
                        return {
                            ...prev,
                            stores: tb
                        }
                    })
                }

            }
        }
        get()

    }, [id, type])



    async function handleSubmit(prevState, formData, signal) {
        let errors = [];
        if (type === "bank") {
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
        } else if (type === "mobile") {
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
        } else if (type === "storePrincipal") {
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
        } else if (type === "safe") {
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
        } else if (type === "supplier") {
            const supplierSlug = formData.get("supplierSlug")
            const enterprise = formData.get("enterprise")



            if (!isNotEmpty(supplierSlug)) {
                animate(inputSupplierSlug.current, { x: [0, 15, 0] }, { bounce: 0.75 })
                errors.push("veuillez renseigner le fournisseur.")
            }


            if (enterprise === null) {
                animate(selectEnterprise.current, { x: [0, 15, 0] }, { bounce: 0.75 })
                errors.push("Veuillez sélectionner une entreprise.")
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

            const supplier = await getSupplierById({ id, signal })
            const supplierAuthorizeEnterpriseDto = {
                enterprise,
            }
            mutate({ slug: supplier.slug, supplierAuthorizeEnterpriseDto })
            return { errors: null }
        } else if (type === "store") {
            const store = formData.get("store")

            if (store === null) {
                animate(selectStore.current, { x: [0, 15, 0] }, { bounce: 0.75 })
                errors.push("Veuillez sélectionner la magasin.")
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

            const storeAuthorizeDto = {
                storePrincipal: storePrincipal.slug,
            }
            mutate({ slug: store, storeAuthorizeDto })
            return { errors: null }
        }


    }

    const [formState, formAction] = useActionState(handleSubmit, { errors: null })


    const { mutate } = useMutation({
        mutationFn: type === "bank" ? authorizeAgencyBank : type === "mobile" ? authorizeAgencyMobile : type === "storePrincipal" ? authorizeAgencyStorePrincipal : type === "safe" ? authorizeCashSafe : type === "supplier" ? authorizeEnterpriseSupplier : type === "store" ? authorizeStorePrincipalStore : undefined,
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

        if (type === "bank") {
            if (field === "rib") {
                if (!isNotEmpty(value)) {
                    animate(inputRib.current, { x: [0, 15, 0] }, { bounce: 0.75 })
                }
            }
        } else if (type === "mobile") {
            if (field === "mobileSlug") {
                if (!isNotEmpty(value)) {
                    animate(inputMobileSlug.current, { x: [0, 15, 0] }, { bounce: 0.75 })
                }
            }
        } else if (type === "storePrincipal") {
            if (field === "storePrincipalSlug") {
                if (!isNotEmpty(value)) {
                    animate(inputStorePrincipalSlug.current, { x: [0, 15, 0] }, { bounce: 0.75 })
                }
            }
        } else if (type === "safe") {
            if (field === "safeSlug") {
                if (!isNotEmpty(value)) {
                    animate(inputSafeSlug.current, { x: [0, 15, 0] }, { bounce: 0.75 })
                }
            }
        } else if (type === "supplier") {
            if (field === "supplierSlug") {
                if (!isNotEmpty(value)) {
                    animate(inputSupplierSlug.current, { x: [0, 15, 0] }, { bounce: 0.75 })
                }
            }
        }



    }


    return <>



        <form action={formAction} className="rounded-lg text-sky-50 p-4" ref={scope}>
            <div className="flex flex-col justify-between gap-2">
                {type !== "supplier" && type !== "store" ? <Input label="Entreprise *" type="text" defaultValue={data?.enterprise} name="enterprise" placeholder="Nom de l'entreprise" className="border border-sky-950" onBlur={(event) => handleBlur("enterprise", event.target.value)} ref={inputEnterprise} readOnly /> : undefined}
                {type === "bank" && <Input label="R.I.B. *" type="text" defaultValue={data?.rib} name="rib" placeholder="Nº du compte bancaire" className="border border-sky-950" onBlur={(event) => handleBlur("rib", event.target.value)} ref={inputRib} readOnly />}
                {type === "mobile" && <Input label="Mobile money *" type="text" defaultValue={data?.mobileSlug} name="mobileSlug" placeholder="Nº du compte mobile" className="border border-sky-950" onBlur={(event) => handleBlur("mobileslug", event.target.value)} ref={inputMobileSlug} readOnly />}
                {type === "storePrincipal" && <Input label="Magasin principal *" type="text" defaultValue={data?.storePrincipalSlug} name="storePrincipalSlug" placeholder="Magasin principal" className="border border-sky-950" onBlur={(event) => handleBlur("storePrincipalSlug", event.target.value)} ref={inputStorePrincipalSlug} readOnly />}
                {type === "safe" && <Input label="Coffre-fort *" type="text" defaultValue={data?.safeSlug} name="safeSlug" placeholder="Coffre-fort" className="border border-sky-950" onBlur={(event) => handleBlur("safeSlug", event.target.value)} ref={inputSafeSlug} readOnly />}
                {type === "supplier" && <Input label="Fournisseur *" type="text" defaultValue={data?.supplierSlug} name="supplierSlug" placeholder="Fournisseur" className="border border-sky-950" onBlur={(event) => handleBlur("supplierSlug", event.target.value)} ref={inputSupplierSlug} readOnly />}
                {type === "bank" || type === "mobile" || type === "storePrincipal" ? <Select label="Agence *" id="agency" name="agency" selectedTitle="Sélectionner une agence" data={data?.agencies} ref={selectAgency} /> : undefined}
                {type === "safe" && <Select label="Caisse *" id="cash" name="cash" selectedTitle="Sélectionner une caisse" data={data?.cashes} ref={selectCash} />}
                {type === "supplier" && <Select label="Entreprise *" id="enterprise" name="enterprise" selectedTitle="Sélectionner une entreprise" data={data?.enterprises} ref={selectEnterprise} />}
                {type === "store" && <Select label="Magasins *" id="store" name="store" selectedTitle="Sélectionner une magasin" data={data?.stores} ref={selectStore} />}
            </div>


            <Submit>
                Enregistrer
            </Submit>
        </form>


    </>

}