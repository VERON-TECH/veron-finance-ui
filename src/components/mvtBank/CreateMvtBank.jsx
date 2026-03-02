import { useMutation } from "@tanstack/react-query";
import { useAnimate } from "framer-motion";
import { useActionState, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { createMvtBank, createMvtCash, getAgencyById, getAllBankAccount, getAllBudgets, getAllCashes, getAllCustomers, getAllEngagements, getAllMissing, getAllMobileMoney, getAllMvtCash, getAllMvtCashByRef, getAllPurchaseOrders, getAllSafes, getAllSuppliers, getAllSurplus, getBankAccountbySlug, getBudgetById, getBudgetByPeriod, getCashBySlug, getCustomerBySlug, getEngagementBySlug, getEnterpriseById, getMissingBySlug, getMvtCashBySlug, getPersonalById, getProductBySlug, getPurchaseOrderById, getPurchaseOrderBySlug, getSpentById, getSurplusBuSlug, queryClient } from "../../utils/http";
import Input from "../../layout/Input.jsx"
import Submit from "../../layout/Submit.jsx"
import { isNotEmpty } from "../../utils/validation.jsx"
import { noteActions } from "../../store/noteSlice.js";
import responseHttp from "../../utils/responseHttp.js"
import Select from "../../layout/Select.jsx";
import { typeBank } from "../../data/info.js";

export default function CreateMvtBank() {
    const selectBank = useRef();
    const selectTypeBank = useRef();
    const inputRefExt = useRef();
    const selectMotif = useRef();
    const selectSens = useRef();
    const inputPrincipal = useRef();
    const inputFee = useRef();
    const inputMotif = useRef();
    const inputBalance = useRef();


    const [data, setData] = useState({
        bank: [],
        typeBank: [],
        motif: [],
        sens: [],
        bankAccount: "",
        balance: "",
        isSelected: false,
        amount: 0,
        fee: 0,
        disabled: false,
        labelFee: "Frais",
        labelPrincipal: "Principal *"
    })

    const dispatch = useDispatch();
    const [scope, animate] = useAnimate();
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        async function get(signal) {
            const allBanks = await getAllBankAccount({ signal, agency: user.agency })
            let tb = []
            for (let b of allBanks) {
                tb.push({ key: b.id, name: b.rib, slug: b.slug })
            }
            setData(prev => {
                return {
                    ...prev,
                    bank: tb
                }
            })
        }
        get()
    }, [])


    async function handleSubmit(prevState, formData, signal) {
        let errors = [];
        const enterprise_ = await getEnterpriseById({ id: user.enterprise, signal })
        const agency_ = await getAgencyById({ id: user.agency, signal })
        const enterprise = enterprise_.slug
        const agency = agency_.slug
        const typeBank = formData.get("type")
        const bank = formData.get("bank")
        const refExt = formData.get("refExt")
        const motif = formData.get("motif")
        const sens = formData.get("sens")
        const amount = formData.get("amount")
        const fee = formData.get("fee")


        if (typeBank === null) {
            animate(selectTypeBank.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez sélectionner le type d'opération.")
        }

        if (motif === null) {
            animate(selectMotif.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez renseigner le motif.")
        }



        if (bank === null) {
            animate(selectBank.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez sélectionner la banque.")
        }

        if (!isNotEmpty(refExt)) {
            animate(inputRefExt.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("Veuillez renseigner la référence externe.")
        }

        if (sens === null) {
            animate(selectSens.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez renseigner le sens.")
        }



        if (errors.length > 0) {
            dispatch(noteActions.show());
            dispatch(noteActions.error(true));
            dispatch(noteActions.relaunch());
            dispatch(noteActions.sendData(errors))

            return {

                errors, enteredValue: {
                    refExt,
                    amount,
                }
            }
        }


        const mvtBankDto = {
            enterprise,
            agency,
            typeBank,
            bank,
            refExt,
            motif,
            sens,
            amount,
            fee,

        }

        mutate(mvtBankDto)
        return { errors: null }
    }


    const [formState, formAction] = useActionState(handleSubmit, { errors: null })


    const { mutate } = useMutation({
        mutationFn: createMvtBank,
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



    async function handleChange(identifier, value, signal) {
        let tb = []

        if (identifier === "bank") {
            const bankAccount = await getBankAccountbySlug({ slug: value, signal })
            inputBalance.current.textContent = Number(bankAccount.balance).toLocaleString("fr-FR", { style: "currency", currency: "XAF" })
            setData(prev => {
                return {
                    ...prev,
                    bankAccount: value,
                }
            })
        }
        if (identifier === "typeBank") {
            inputRefExt.current.readOnly = false


            if (value === "APPRO_CAISSE_VIA_LA_BANQUE") {
                const cashes = await getAllCashes({ signal, enterprise: user.enterprise, agency: user.agency })
                cashes.forEach(b => {
                    tb.push({ key: b.id, name: b.name, value: b.slug })
                })

                setData(prev => {
                    return {
                        ...prev,
                        motif: tb,
                        sens: [{ key: 0, name: "DEBIT", value: "DEBIT" }],
                        isSelected: true
                    }
                })
            }



            if (value === "REGLEMENT_BON_DE_COMMANDE") {
                const purchaseOrder = await getAllPurchaseOrders({ signal, enterprise: user.enterprise, agency: user.agency })
                purchaseOrder.forEach(p => {
                    if (p.statusPurchase === "CONFIRME") {
                        tb.push({ key: p.id, name: p.ref, value: p.slug })
                    }

                })

                setData(prev => {
                    return {
                        ...prev,
                        motif: tb,
                        sens: [{ key: 0, name: "DEBIT", value: "DEBIT" }],
                        isSelected: true
                    }
                })
            }


            if (value === "EMPRUNT_RECU") {
                const customer = await getAllCustomers({ signal, enterprise: user.enterprise })
                const bankAccounts = await getAllBankAccount({ signal, agency: user.agency })

                customer.forEach(e => {
                    if (e.lastName != "CLIENT INCONNU") {
                        tb.push({ key: e.id, name: e.lastName + " " + e.firstName, value: e.slug })
                    }


                })

                bankAccounts.forEach(e => {
                    tb.push({ key: e.id, name: e.rib, value: e.slug })
                })

                setData(prev => {
                    return {
                        ...prev,
                        motif: tb,
                        sens: [{ key: 0, name: "CREDIT", value: "CREDIT" }],
                        isSelected: true,
                        labelPrincipal: "Principal *",
                        labelFee: "Frais",
                        disabled: false
                    }
                })
            }
            if (value === "AUTRES_VERSEMENTS") {
                setData(prev => {
                    return {
                        ...prev,
                        motif: ["AUTRES VERSEMENTS"],
                        sens: [{ key: 0, name: "CREDIT", value: "CREDIT" }],
                        isSelected: false,
                        labelPrincipal: "Principal *",
                        labelFee: "Frais",
                        disabled: false
                    }
                })
            }
            if (value === "AUTRES_RETRAITS") {
                setData(prev => {
                    return {
                        ...prev,
                        motif: ["AUTRES RETRAITS"],
                        sens: [{ key: 0, name: "DEBIT", value: "DEBIT" }],
                        isSelected: false,
                        labelPrincipal: "Principal *",
                        labelFee: "Frais",
                        disabled: false
                    }
                })
            }

            if (value === "AVANCE_CLIENT") {

                const customer = await getAllCustomers({ signal, enterprise: user.enterprise })
                customer.forEach(c => {
                    if (c.lastName !== "CLIENT INCONNU") {
                        tb.push({ key: c.id, name: c.lastName + " " + c.firstName, value: c.slug })
                    }

                })

                setData(prev => {
                    return {
                        ...prev,
                        motif: tb,
                        sens: [{ key: 0, name: "CREDIT", value: "CREDIT" }],
                        isSelected: true,
                        labelPrincipal: "Principal *",
                        labelFee: "Frais",
                        disabled: false
                    }
                })


            }
            if (value === "AVANCE_VERSEE") {
                const suppliers = await getAllSuppliers({ signal, enterprise: user.enterprise })
                suppliers.forEach(s => {
                    if (s.name !== "FOURNISSEUR INCONNU") {
                        tb.push({ key: s.id, name: s.name, value: s.slug })
                    }

                })

                setData(prev => {
                    return {
                        ...prev,
                        motif: tb,
                        sens: [{ key: 0, name: "DEBIT", value: "DEBIT" }],
                        isSelected: true
                    }
                })
            }
            if (value === "REMBOURSEMENT_CLIENT") {
                const customer = await getAllCustomers({ signal, enterprise: user.enterprise })
                customer.forEach(c => {
                    if (c.balance > 0) {
                        tb.push({ key: c.id, name: c.lastName + " " + c.firstName, value: c.slug })
                    }

                })

                setData(prev => {
                    return {
                        ...prev,
                        motif: tb,
                        sens: [{ key: 0, name: "DEBIT", value: "DEBIT" }],
                        isSelected: true
                    }
                })
            }
            if (value === "REMBOURSEMENT_EMPRUNT") {
                const engagements = await getAllEngagements({ signal, enterprise: user.enterprise, agency: user.agency })
                engagements.forEach(e => {
                    if (e.balance > 0 && e.typeEngagement === "EMPRUNT") {
                        tb.push({ key: e.id, name: e.ref, value: e.slug })
                    }

                })

                setData(prev => {
                    return {
                        ...prev,
                        motif: tb,
                        sens: [{ key: 0, name: "DEBIT", value: "DEBIT" }],
                        isSelected: true
                    }
                })
            }
            if (value === "REMBOURSEMENT_PRET") {
                const engagements = await getAllEngagements({ signal, enterprise: user.enterprise, agency: user.agency })
                engagements.forEach(e => {
                    if (e.balance > 0 && e.typeEngagement === "PRET") {
                        tb.push({ key: e.id, name: e.ref, value: e.slug })
                    }

                })

                setData(prev => {
                    return {
                        ...prev,
                        motif: tb,
                        sens: [{ key: 0, name: "CREDIT", value: "CREDIT" }],
                        isSelected: true
                    }
                })
            }
            if (value === "PRET_ACCORDE") {
                const customer = await getAllCustomers({ signal, enterprise: user.enterprise })
                const bankAccounts = await getAllBankAccount({ signal, agency: user.agency })

                customer.forEach(e => {
                    if (e.lastName != "CLIENT INCONNU") {
                        tb.push({ key: e.id, name: e.lastName + " " + e.firstName, value: e.slug })
                    }


                })

                bankAccounts.forEach(e => {
                    tb.push({ key: e.id, name: e.rib, value: e.slug })
                })

                setData(prev => {
                    return {
                        ...prev,
                        motif: tb,
                        sens: [{ key: 0, name: "DEBIT", value: "DEBIT" }],
                        isSelected: true
                    }
                })
            }



        }
        if (identifier === "motif") {
            async function get(signal) {


                if (selectTypeBank.current.value === "APPRO_CAISSE_VIA_LA_BANQUE") {
                    setData(prev => {
                        return {
                            ...prev,
                            labelPrincipal: "Principal *",
                            labelFee: "Frais",
                        }
                    })
                }


                if (selectTypeBank.current.value === "REGLEMENT_BON_DE_COMMANDE") {
                    const purchaseOrder = await getPurchaseOrderBySlug({ signal, slug: value })
                    inputPrincipal.current.value = Number(purchaseOrder.balance)

                    setData(prev => {
                        return {
                            ...prev,
                            amount: Number(purchaseOrder.balance),
                            labelPrincipal: "Solde",
                            labelFee: "Montant",
                            disabled: true
                        }
                    })
                }



                if (selectTypeBank.current.value === "REMBOURSEMENT_CLIENT") {
                    setData(prev => {
                        return {
                            ...prev,
                            disabled: true
                        }
                    })
                }
                if (selectTypeBank.current.value === "REMBOURSEMENT_EMPRUNT") {
                    const engagement = await getEngagementBySlug({ signal, slug: value })
                    inputPrincipal.current.value = engagement.balance


                    setData(prev => {
                        return {
                            ...prev,
                            amount: engagement.amount,
                            labelPrincipal: "Instance",
                            labelFee: "Montant",
                            disabled: true
                        }
                    })

                }
                if (selectTypeBank.current.value === "REMBOURSEMENT_PRET") {
                    const engagement = await getEngagementBySlug({ signal, slug: value })
                    inputPrincipal.current.value = engagement.balance


                    setData(prev => {
                        return {
                            ...prev,
                            fee: 0,
                            labelPrincipal: "Instance",
                            labelFee: "Montant",
                            disabled: true
                        }
                    })

                }


                if (selectTypeBank.current.value === "AVANCE_CLIENT") {
                    const customer = await getCustomerBySlug({ signal, slug: value })
                    inputRefExt.current.value = customer.slug
                    inputRefExt.current.readOnly = true
                }


            }
            get()
        }

    }







    return <>

        <form action={formAction} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg text-sky-50 p-4" ref={scope}>
            <div className="flex justify-between gap-2">
                <Select label="Banque *" id="bank" name="bank" selectedTitle="Sélectionner une banque" data={data.bank} ref={selectBank} onChange={(e) => handleChange("bank", e.target.value)} />
                <div className="shadow-sky-950 shadow-lg rounded bg-sky-950 text-sky-50 font-medium px-2 py-1 w-32 mb-4 text-end" ref={inputBalance}>

                </div>
            </div>
            <div className="flex justify-between gap-2">
                <Select label="Type *" id="type" name="type" selectedTitle="Sélectionner un type d'opération" data={typeBank} ref={selectTypeBank} onChange={(e) => handleChange("typeBank", e.target.value)} />
                {data?.isSelected ? <Select label="Motif *" id="motif" name="motif" selectedTitle="Sélectionner un motif" data={data?.motif || []} ref={selectMotif} onChange={(e) => handleChange("motif", e.target.value)} /> :
                    <Input label="Motif *" id="motif" type="text" name="motif" placeholder="Motif" className="border border-sky-950" />}
            </div>

            <div className="flex justify-between gap-2">
                <Input label="Réf. *" id="refExt" type="text" defaultValue={formState.enteredValue?.refExt} name="refExt" placeholder="Réf. externe" className="border border-sky-950" ref={inputRefExt} />
                <Select label="Sens *" id="sens" name="sens" selectedTitle="Sélectionner un sens" data={data?.sens} ref={selectSens} />
            </div>

            <div className="flex justify-between gap-2">
                <Input label={data?.labelPrincipal} id="amount" type="number" defaultValue={data?.amount} name="amount" placeholder="Montant" className="border border-sky-950" ref={inputPrincipal} readOnly={data?.disabled} />
                <Input label={data?.labelFee} id="fee" type="number" name="fee" defaultValue={data?.fee} placeholder="Frais" className="border border-sky-950" />
            </div>



            {data?.cash !== "Sélectionner une caisse" && data?.cash !== "" ? <Submit>
                Créer
            </Submit> : undefined}
        </form>

        <div className="absolute bottom-2 right-2 bg-sky-950 text-sky-50 px-5 py-1 rounded" onClick={() => setShow(false)}>
            {data?.balance}
        </div>


    </>

}


