import { useAnimate } from "framer-motion";
import { useActionState, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { createRebut, getAgencyById, getAgencyBySlug, getAllAgencies, getAllLotById, getAllProducts, getAllStocks, getAllStorePrincipal, getAllStores, getEnterpriseById, getEnterpriseBySlug, getLotById, getLotBySlug, getProductBySlug, getStock, getStoreBySlug, getStorePrincipalBySlug, suppliesStock } from "../../utils/http.js";
import Input from "../../layout/Input.jsx"
import Submit from "../../layout/Submit.jsx"
import Select from "../../layout/Select.jsx";
import responseHttp from "../../utils/responseHttp.js";
import { noteActions } from "../../store/noteSlice.js";
import { useMutation } from "@tanstack/react-query";
import { isNotEmpty } from "../../utils/validation.jsx";

export default function CreateRebuts() {
    const user = JSON.parse(localStorage.getItem("user"));
    const inputEnterprise = useRef();
    const inputAgency01 = useRef();
    const selectStore01 = useRef();
    const selectProduct = useRef();
    const selectLot = useRef();
    const inputQuantity = useRef()
    const inputStock = useRef();
    const inputMotif = useRef();
    const dispatch = useDispatch();
    const [scope, animate] = useAnimate();
    const [data, setData] = useState({
        enterprises: "",
        agency: "",
        store01: [],
        products: [],
        productList: [],
        errors: [],
        stock: 0,
        lots: [],

    })

    useEffect(() => {
        if (user.enterprise > 0 && user.agency > 0) {

            let tbEl = {
                tb: [],
                tb2: []
            }
            async function get(signal) {

                const enterprise = await getEnterpriseById({ id: user.enterprise, signal })
                const agency = await getAgencyById({ id: user.agency, signal })
                const allProducts = await getAllProducts({ signal, enterprise: user.enterprise })

                allProducts.forEach(p => {
                    tbEl.tb2.push({ key: p.id, name: p.name, value: p.slug })
                })

                if (enterprise.slug === agency.slug) {
                    const store01 = await getAllStorePrincipal({ signal, enterprise: enterprise.id, agency: 0 })
                    store01.forEach(s => {
                        tbEl.tb.push({ key: s.id, name: s.name, value: s.slug })
                    })
                    setData(prev => {
                        return {
                            ...prev,
                            store01: tbEl.tb,
                        }
                    })

                } else {
                    const store01 = await getAllStores({ signal, enterprise: enterprise.id, agency: agency.id })
                    store01.forEach(s => {
                        tbEl.tb.push({ key: s.id, name: s.name, value: s.slug })
                    })
                    setData(prev => {
                        return {
                            ...prev,
                            store01: tbEl.tb,
                        }
                    })

                }

                setData(prev => {
                    return {
                        ...prev,
                        agency: agency.slug,
                        enterprise: enterprise.slug,
                        productList: tbEl.tb2
                    }
                })
            }
            get()
        }

    }, [])

    async function handleSubmit(prev, formData) {
        const enterprise = formData.get("enterprise")
        const agency01 = formData.get("agency01")
        const store01 = formData.get("store01")
        const product = formData.get("product")
        const lot = formData.get("lot")
        const quantity = formData.get("quantity")
        const motif = formData.get("motif")

        let errors = [];


        if (store01 == null) {
            animate(selectStore01.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("Veuillez sélectionner le magasin.")
        }

        if (product == null) {
            animate(selectProduct.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("Veuillez sélectionner l'article.")
        }

        if (lot == null) {
            animate(selectLot.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("Veuillez sélectionner le lot.")
        }

        if (quantity <= 0) {
            animate(inputQuantity.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("Veuillez renseigner une quantité valide.")
        }

        if (quantity > inputStock.current.value) {
            animate(inputQuantity.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("Le stock de " + selectProduct.current.value + " est insuffisant pour cette quantité.")
        }

        if (!isNotEmpty(motif)) {
            animate(inputMotif.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("Veuillez renseigner le motif.")
        }


        if (errors.length > 0) {
            dispatch(noteActions.show());
            dispatch(noteActions.error(true));
            dispatch(noteActions.relaunch());
            dispatch(noteActions.sendData(errors))
            return {
                errors, enteredValue: {
                    quantity
                }
            }
        }

        const rebutDto = {
            enterprise,
            agency: agency01,
            storePrincipal: agency01 === enterprise ? store01 : "",
            store: agency01 !== enterprise ? store01 : "",
            product,
            lot,
            quantity,
            motif
        }

        mutate(rebutDto)
        return { errors: null }
    }



    const { mutate } = useMutation({
        mutationFn: createRebut,
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
            queryClient.cancelQueries(["productstocks"])
        }
    })



    function handleBlur(field, value) {

        if (field === "quantity") {
            if (value <= 0) {
                animate(inputQuantity.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }

        if (field === "motif") {
            if (!isNotEmpty(value)) {
                animate(inputMotif.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }
    }


    async function handleChange(identifier, value, signal) {
        let tb = []

        if (identifier === "product") {
            let tb1 = []
            const product = await getProductBySlug({ signal, slug: value })
            const agency = await getAgencyBySlug({ slug: inputAgency01.current.value })
            let storePrincipal = null
            let store = null
            if (inputEnterprise.current.value === inputAgency01.current.value) {
                storePrincipal = await getStorePrincipalBySlug({ slug: selectStore01.current.value, signal })
            } else {
                store = await getStoreBySlug({ slug: selectStore01.current.value, signal })
            }
            const allStocks = await getAllStocks({ signal, enterprise: product.enterprise, agency: agency.id, storePrincipal: storePrincipal !== null ? storePrincipal.id : 0, store: store !== null ? store.id : 0, product: product.id, lot: 0 })
            allStocks.forEach(p => {
                tb1.push(p.lot)
            })

            const allLots = await getAllLotById(tb1)
            allLots.forEach(l => {
                tb.push(
                    { key: l.id, name: l.name, value: l.slug })
            })

            setData(prev => {
                return {
                    ...prev,
                    lots: tb,
                }
            })
        }

        if (identifier === "lot") {
            const product = await getProductBySlug({ signal, slug: selectProduct.current.value })
            const enterprise = await getEnterpriseBySlug({ slug: inputEnterprise.current.value, signal })
            const agency = await getAgencyBySlug({ slug: inputAgency01.current.value, signal })
            let storePrincipal = null
            let store = null
            if (inputEnterprise.current.value === inputAgency01.current.value) {
                storePrincipal = await getStorePrincipalBySlug({ slug: selectStore01.current.value, signal })
            } else {
                store = await getStoreBySlug({ slug: selectStore01.current.value, signal })
            }
            let stock = null
            const lot = await getLotBySlug({ signal, slug: value })
            if (storePrincipal !== null && store === null) {
                stock = await getStock({ signal, enterprise: enterprise.id, agency: agency.id, storePrincipal: storePrincipal.id, store: 0, product: product.id, lot: lot.id })
            } else if (store !== null && storePrincipal === null) {
                stock = await getStock({ signal, enterprise: enterprise.id, agency: agency.id, storePrincipal: 0, store: store.id, product: product.id, lot: lot.id })
            }
            inputStock.current.value = stock.stock
        }


    }

    const [formState, formAction] = useActionState(handleSubmit, { errors: null })

    return <form action={formAction} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg text-sky-50 p-4" ref={scope}>
        <div className="hidden">
            <Input label="Entreprise *" name="enterprise" defaultValue={data?.enterprise} placeholder="Entreprise" className="border border-sky-950" onBlur={(event) => handleBlur("quantity", event.target.value)} ref={inputEnterprise} readOnly />
            <Input label="Agence *" name="agency01" defaultValue={data?.agency} placeholder="Agence" className="border border-sky-950" onBlur={(event) => handleBlur("agency01", event.target.value)} ref={inputAgency01} readOnly />
        </div>
        <div className="flex justify-center gap-4">
            <Select label="Magasin *" id="store01" name="store01" selectedTitle="Sélectionner un magasin de départ" data={data?.store01} ref={selectStore01} onChange={(e) => handleChange("store01", e.target.value)} disabled={data?.enable} />
            <Select label="Article *" id="product" name="product" selectedTitle="Sélectionner un article" data={data?.productList} ref={selectProduct} onChange={(e) => handleChange("product", e.target.value)} />
        </div>

        <div className="flex justify-center gap-4">
            <Select label="Lot *" id="lot" name="lot" selectedTitle="Sélectionner un lot" data={data?.lots} ref={selectLot} onChange={(e) => handleChange("lot", e.target.value)} />
            <Input label="Stock *" type="number" name="stock" defaultValue={data?.stock} placeholder="Stock" className="border border-sky-950" ref={inputStock} readOnly />
        </div>
        <div className="flex justify-center">
            <Input label="Quantité *" type="number" name="quantity" defaultValue={formState?.enteredValue?.quantity} placeholder="Quantité" className="border border-sky-950" onBlur={(event) => handleBlur("quantity", event.target.value)} ref={inputQuantity} />
        </div>
        <div className="flex justify-center mb-2">
            <textarea label="Motif *" name="motif" defaultValue={formState?.enteredValue?.motif} placeholder="Motif" className="border border-sky-950 w-full h-12 text-sky-950 p-1" onBlur={(event) => handleBlur("motif", event.target.value)} ref={inputMotif} />
        </div>
        <Submit >
            Enregistrer
        </Submit>
    </form>
}