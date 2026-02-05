import { useMutation } from "@tanstack/react-query";
import { useAnimate } from "framer-motion";
import { useActionState, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { createStore, getAgencyById, getAllProducts, getAllSupplierAdvances, getAllSuppliers, getEnterpriseById, queryClient } from "../../utils/http.js";
import Input from "../../layout/Input.jsx"
import Submit from "../../layout/Submit.jsx"
import { isNotEmpty } from "../../utils/validation.jsx"
import { noteActions } from "../../store/noteSlice.js";
import responseHttp from "../../utils/responseHttp.js"
import Select from "../../layout/Select.jsx";
import { paymentMethodPurchase } from "../../data/info.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";

export default function CreatePurchaseOrder() {

    const user = JSON.parse(localStorage.getItem("user"));

    const selectEnterprise = useRef();
    const selectAgency = useRef();
    const selectSupplier = useRef();
    const selectProduct = useRef();
    const selectPaymentMethod = useRef();
    const selectSupplierAdvance = useRef();
    const inputQuantity = useRef()
    const inputPrice = useRef()
    const inputDiscount = useRef();
    const dispatch = useDispatch();
    const [scope, animate] = useAnimate();
    const [data, setData] = useState({
        enterprises: [],
        agencies: [],
        productList: [],
        products: [],
        suppliers: [],
        supplierAdvanceList: [],
        supplierAdvances: [],
        payment: "",
        errors: []

    })

    useEffect(() => {

        if (user.enterprise > 0 && user.agency > 0) {

            let tbEl = {
                tb: [],
                tb1: [],
                tb2: [],
                tb3: [],
                tb4: [],
            }
            async function get(signal) {

                const allAgencies = await getAgencyById({ id: user.agency, signal })
                const allEnterprises = await getEnterpriseById({ id: user.enterprise, signal })
                const allProducts = await getAllProducts({ signal, enterprise: user.enterprise })
                const allSuppliers = await getAllSuppliers({ signal, enterprise: user.enterprise })
                const allSupplierAdvances = await getAllSupplierAdvances({ signal, enterprise: user.enterprise, agency: user.agency })

                tbEl.tb.push({ key: allAgencies.id, name: allAgencies.name, value: allAgencies.slug })
                tbEl.tb1.push({ key: allEnterprises.id, name: allEnterprises.name, value: allEnterprises.slug })
                allProducts.forEach(p => {
                    tbEl.tb2.push({ key: p.id, name: p.name, value: p.slug })
                })

                allSuppliers.forEach(s => {
                    tbEl.tb3.push({ key: s.id, name: s.name, value: s.slug })
                })

                allSupplierAdvances.forEach(s => {
                    tbEl.tb4.push({ key: s.id, name: s.ref, value: s.slug })
                })

                setData(prev => {
                    return {
                        ...prev,
                        agencies: tbEl.tb,
                        enterprises: tbEl.tb1,
                        productList: tbEl.tb2,
                        suppliers: tbEl.tb3,
                        supplierAdvanceList: tbEl.tb4

                    }
                })
            }
            get()
        }

    }, [])

    async function handleSubmit(prevState, formData) {
        const allData = Object.fromEntries(formData.entries())
        let errors = [];
        const enterprise = formData.get("enterprise")
        const agency = formData.get("agency")
        const name = formData.get("name")


        if (!isNotEmpty(name)) {
            animate(inputName.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez renseigner le nom du magasin.")
        }

        if (agency === null) {
            animate(selectAgency.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez sélectionner l'agence'.")
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
                    name,
                }
            }
        }

        mutate(allData)
        return { errors: null }
    }


    const [formState, formAction] = useActionState(handleSubmit, { errors: null })


    const { mutate } = useMutation({
        mutationFn: createStore,
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

    }


    function handleChange(identifier, value) {
        if (identifier === "paymentMethod") {
            setData(prev => {
                return {
                    ...prev,
                    payment: value,
                }
            })
        }
    }


    function handleAdd(identifier) {
        let errors = []
        if (identifier === "add") {
            if (selectSupplier.current.value === "Sélectionner un fournisseur") {
                errors.push("Veuillez sélectionner un fournisseur")
            }
        }

        if (errors.length > 0) {
            return errors
        }
    }

    return <>

        <div className="w-full h-1/1 flex">
            <div className="w-1/2  p-2 border-5 flex flex-col items-center gap-2">
                <Select label="Fournisseur *" id="supplier" name="supplier" selectedTitle="Sélectionner un fournisseur" data={data?.suppliers} ref={selectSupplier} />
                <Select label="Entreprise *" id="enterprise" name="enterprise" selectedTitle="Sélectionner une entreprise" data={data?.enterprises} ref={selectEnterprise} />
                <Select label="Agence *" id="agency" name="agency" selectedTitle="Sélectionner une agence" data={data?.agencies} ref={selectAgency} />
                <Select label="Paiement *" id="paymentMethod" name="paymentMethod" selectedTitle="Sélectionner un moyen de paiement" data={paymentMethodPurchase} ref={selectPaymentMethod} onChange={(e) => handleChange("paymentMethod", e.target.value)} />
                {data?.payment === "AVANCE_VERSEE" &&
                    <div className="flex gap-2">
                        <Select label="Avance versée *" id="supplierAdvance" name="supplierAdvance" selectedTitle="Sélectionner une avance versée" data={data.supplierAdvanceList} ref={selectSupplierAdvance} />
                        <button className="cursor-pointer"><FontAwesomeIcon icon={faPlusCircle} className="w-32" /></button>
                    </div>
                }
                <Select label="Produit *" id="product" name="product" selectedTitle="Sélectionner un produit" data={data?.productList} ref={selectProduct} />
                <Input label="Quantité *" type="number" defaultValue={formState.enteredValue?.quantity} name="quantity" placeholder="Quantité" className="border border-sky-950" onBlur={(event) => handleBlur("quantity", event.target.value)} ref={inputQuantity} />
                <Input label="Prix *" type="number" defaultValue={formState.enteredValue?.price} name="price" placeholder="Prix" className="border border-sky-950" onBlur={(event) => handleBlur("quantity", event.target.value)} ref={inputPrice} />

                <Submit onClick={() => handleAdd("add")}>
                    Ajouter
                </Submit>
            </div>
            <div className="w-1/2 p-2 border-4 border-black">
                <table>
                    <thead>
                        <tr className="bg-sky-950 text-sky-50">
                            <th className="border px-12">
                                id
                            </th>
                            <th className="border px-12">
                                produit
                            </th>
                            <th className="border px-12">
                                Quantité
                            </th>
                            <th className="border px-12">
                                Prix
                            </th>
                        </tr>
                    </thead>
                </table>
            </div>
        </div>




    </>
}