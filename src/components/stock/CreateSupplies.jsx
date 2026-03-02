import { useAnimate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAgencyById, getAgencyBySlug, getAllAgencies, getAllLotById, getAllMvtStocks, getAllProducts, getAllStocks, getAllStorePrincipal, getAllStores, getEnterpriseById, getEnterpriseBySlug, getLotById, getLotBySlug, getProductBySlug, getStock, getStoreById, getStoreBySlug, getStorePrincipalById, getStorePrincipalBySlug, suppliesStock, transferStock } from "../../utils/http.js";
import Input from "../../layout/Input.jsx"
import Submit from "../../layout/Submit.jsx"
import Select from "../../layout/Select.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle, faTrash } from "@fortawesome/free-solid-svg-icons";
import Modal from "../../layout/Modal.jsx";
import Notification from "../../layout/Notification.jsx";
import responseHttp from "../../utils/responseHttp.js";
import { noteActions } from "../../store/noteSlice.js";
import { useNavigate } from "react-router-dom";
import { printActions } from "../../store/print.js";

export default function CreateSupplies() {

    const user = JSON.parse(localStorage.getItem("user"));
    const dialog = useRef();
    const inputEnterprise = useRef();
    const inputAgency01 = useRef();
    const selectStore01 = useRef();
    const selectProduct = useRef();
    const selectLot = useRef();
    const inputQuantity = useRef()
    const inputStock = useRef();
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [animate] = useAnimate();
    const [data, setData] = useState({
        enterprise: "",
        agency: "",
        store01: [],
        products: [],
        productList: [],
        errors: [],
        quantity: 0,
        stock: 0,
        lots: [],
        enabled: false

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
                const allProducts = await getAllProducts({ signal, enterprise: user.enterprise })

                allProducts.forEach(p => {
                    if (p.category === "FOURNITURES") {
                        tbEl.tb2.push({ key: p.id, name: p.name, value: p.slug })
                    }
                })

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

    async function handleSave(signal) {

        let products = []
        data.products.forEach(p => {
            products.push(p.product + ":" + p.store + ":" + p.quantity + ":" + p.lot)
        })
        const enterprise = inputEnterprise.current.value
        const agency = inputAgency01.current.value
        const suppliesDto = {
            enterprise,
            agency,
            products,
        }

        const responseData = await suppliesStock(suppliesDto)
        const enterprise_ = await getEnterpriseById({ id: user.enterprise, signal })
        let products_ = []
        for (let p of data.products) {
            let product_ = await getProductBySlug({ signal, slug: p.product })
            products_.push({ ref: product_.ref, name: product_.name, quantity: p.quantity, price: product_.price, totalPrice: p.quantity * product_.price })
        }

        const print = {
            enterprise: enterprise_,
            products_,
            agency: agency.toUpperCase()
        }
        const state = responseHttp(responseData);
        if (state) {
            dispatch(noteActions.error(true))
        } else {
            setData(prev => {
                return {
                    ...prev,
                    products: []
                }

            })
            dispatch(noteActions.error(false))
            if (responseData[0].includes("Commande en fournitures effectuée avec succès.")) {
                dispatch(printActions.getPrint(print))
                navigate("/print-supplies")
            }
        }
        dispatch(noteActions.show());
        dispatch(noteActions.relaunch());
        dispatch(noteActions.sendData(responseData))
        setData(prev => {
            return {
                ...prev,
                disabled: true
            }
        })
    }






    function handleBlur(field, value) {

        if (field === "quantity") {
            if (value <= 0) {
                animate(inputQuantity.current, { x: [0, 15, 0] }, { bounce: 0.75 })
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
                tb.push({ key: l.id, name: l.name, value: l.slug })
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


    function handleAdd(identifier) {
        let errors = []
        if (identifier === "add") {

            if (selectStore01.current.value === "Sélectionner un magasin de départ") {
                errors.push("Veuillez sélectionner le magasin de départ")
            }



            if (selectProduct.current.value === "Sélectionner un produit") {
                errors.push("Veuillez sélectionner un produit.")
            }

            if (selectLot.current.value === "Sélectionner un lot") {
                errors.push("Veuillez sélectionner un lot.")
            }

            if (inputQuantity.current.value <= 0) {
                errors.push("Veuillez renseigner la quantité.")
            }

            if (Number(inputQuantity.current.value) > Number(inputStock.current.value)) {
                errors.push("Le stock du produit " + selectProduct.current.value + " est insuffisant.")
            }




            if (errors.length > 0) {
                setData(prev => {
                    return {
                        ...prev,
                        errors
                    }
                })
                return { errors: data.errors }
            }

            let products = [...data.products]
            let length = data.products.length
            let productNames = products.map(p => p.product);
            if (productNames.includes(selectProduct.current.value)) {
                dialog.current.open();
                return { errors }
            }
            products.push({ id: length + 1, product: selectProduct.current.value, quantity: inputQuantity.current.value, lot: selectLot.current.value, store: selectStore01.current.value })
            setData(prev => {
                return {
                    ...prev,
                    products,
                    enabled: true
                }
            })



            return { errors: null }

        }
    }


    function handleDelete(value) {
        let products = [...data.products]
        products = products.filter(p => p.id !== value)
        setData(prev => {
            return {
                ...prev,
                products,
            }
        })

    }


    return <>

        <div className="flex flex-col overflow-y-auto border border-sky-950 shadow-2xs shadow-sky-950 p-2 rounded mb-4">
            <div className="hidden">
                <Input label="Entreprise *" name="enterprise" defaultValue={data?.enterprise} placeholder="Entreprise" className="border border-sky-950" onBlur={(event) => handleBlur("quantity", event.target.value)} ref={inputEnterprise} readOnly />
                <Input label="Agence *" name="agency" defaultValue={data?.agency} placeholder="Agence" className="border border-sky-950" onBlur={(event) => handleBlur("agency01", event.target.value)} ref={inputAgency01} readOnly />
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
                <Input label="Quantité *" type="number" name="quantity" defaultValue={data?.quantity} placeholder="Quantité" className="border border-sky-950" onBlur={(event) => handleBlur("quantity", event.target.value)} ref={inputQuantity} />
            </div>
            <Submit onClick={() => handleAdd("add")} className="mb-4">
                Ajouter
            </Submit>
        </div>


        {data?.errors.length > 0 && <ul>
            {data?.errors.map(e => <li key={e} className="text-red-500">{e}</li>)}
        </ul>}
        <table className="w-full">
            <thead>
                <tr className="bg-sky-950 text-sky-50">
                    <th className="border px-6">
                        id
                    </th>
                    <th className="border px-6">
                        produit
                    </th>
                    <th className="border px-6">
                        Quantité
                    </th>
                    <th className="border px-6">
                        Lot
                    </th>
                    <th className="border px-6">
                        Action
                    </th>
                    <th className="border px-6">
                        Magasin
                    </th>

                </tr>
            </thead>
            <tbody>
                {data?.products.length > 0 && data?.products.map(p => <tr key={p.product}>
                    <td className="border border-sky-950 text-center">{p.id}</td>
                    <td className="border border-sky-950 text-center">{p.product}</td>
                    <td className="border border-sky-950 text-center">{p.quantity}</td>
                    <td className="border border-sky-950 text-center">{p.lot}</td>
                    <td className="border border-sky-950 text-center"><FontAwesomeIcon icon={faTrash} className="cursor-pointer text-red-500" onClick={() => handleDelete(p.id)} /></td>
                    <td className="border border-sky-950 text-center">{p.store}</td>
                </tr>)}
            </tbody>

        </table>
        {data.products.length > 0 && <div className="flex justify-end mt-4">
            <Submit onClick={() => handleSave()}>
                Enregistrer
            </Submit>
        </div>}

        <Modal ref={dialog} title="Produit existant" size="h-1/5">
            <p className="mb-4"><FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />Ce produit existe déjà dans le panier.</p>
            <Submit onClick={() => dialog.current.close()}>Fermer</Submit>
        </Modal>

    </>
}