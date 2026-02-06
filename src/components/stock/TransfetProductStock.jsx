import { useAnimate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAgencyBySlug, getAllAgencies, getAllLotById, getAllProducts, getAllProductStock, getAllStocks, getAllStorePrincipal, getAllStores, getEnterpriseById, getEnterpriseBySlug, getLotById, getLotBySlug, getProductBySlug, getStock, getStoreById, getStoreBySlug, getStorePrincipalById, getStorePrincipalBySlug, transferStock } from "../../utils/http.js";
import Input from "../../layout/Input.jsx"
import Submit from "../../layout/Submit.jsx"
import Select from "../../layout/Select.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle, faTrash } from "@fortawesome/free-solid-svg-icons";
import Modal from "../../layout/Modal.jsx";
import Notification from "../../layout/Notification.jsx";
import responseHttp from "../../utils/responseHttp.js";
import { noteActions } from "../../store/noteSlice.js";

export default function TransfertProductStock() {
    const errorNotification = useSelector(state => state.note.error);
    const relaunch = useSelector(state => state.note.relaunch);
    const dataItem = useSelector(state => state.note.dataItem)
    const user = JSON.parse(localStorage.getItem("user"));
    const dialog = useRef();
    const selectEnterprise = useRef();
    const selectAgency01 = useRef();
    const selectAgency02 = useRef();
    const selectStore01 = useRef();
    const selectStore02 = useRef();
    const selectProduct = useRef();
    const selectLot = useRef();
    const inputQuantity = useRef()
    const inputPrice = useRef()
    const inputStock = useRef();
    const dispatch = useDispatch();
    const [scope, animate] = useAnimate();
    const [data, setData] = useState({
        enterprises: [],
        agency01: [],
        agency02: [],
        store01: [],
        store02: [],
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
                tb1: [],
                tb2: []
            }
            async function get(signal) {

                const allEnterprises = await getEnterpriseById({ id: user.enterprise, signal })
                const allAgencies = await getAllAgencies()
                const allProducts = await getAllProducts({ signal, enterprise: user.enterprise })
                tbEl.tb.push({ key: allEnterprises.id, name: allEnterprises.name, value: allEnterprises.slug })
                allAgencies.forEach(a => {
                    if (a.enterprise == allEnterprises.id || a.slug == allEnterprises.slug) {
                        tbEl.tb1.push({ key: a.id, name: a.name, value: a.slug })
                    }
                })

                allProducts.forEach(p => {
                    tbEl.tb2.push({ key: p.id, name: p.name, value: p.slug })
                })




                setData(prev => {
                    return {
                        ...prev,
                        agency01: tbEl.tb1,
                        enterprises: tbEl.tb,
                        productList: tbEl.tb2
                    }
                })
            }
            get()
        }

    }, [])

    async function handleSave() {

        let products = []
        data.products.forEach(p => {
            products.push(p.product + ":" + p.quantity + ":" + p.lot)
        })
        const enterprise = selectEnterprise.current.value
        const agency01 = selectAgency01.current.value
        const agency02 = selectAgency02.current.value
        const store01 = selectStore01.current.value
        const store02 = selectStore02.current.value
        const productTransfertDto = {
            enterprise,
            agency01,
            agency02,
            store01,
            store02,
            products,
        }

        const responseData = await transferStock(productTransfertDto)
        const state = responseHttp(responseData);
        if (state) {
            dispatch(noteActions.error(true))
        } else {
            dispatch(noteActions.error(false))
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

        if (field === "price") {
            if (value <= 0) {
                animate(inputPrice.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }

    }


    async function handleChange(identifier, value, signal) {
        let tb = []
        if (identifier === "agency01") {
            const agency02 = data.agency01
            if (value == selectEnterprise.current.value) {
                const enterprise = await getEnterpriseBySlug({ slug: value, signal })
                const store01 = await getAllStorePrincipal({ signal, enterprise: enterprise.id, agency: 0 })
                store01.forEach(s => {
                    tb.push({ key: s.id, name: s.name, value: s.slug })
                })
                setData(prev => {
                    return {
                        ...prev,
                        store01: tb,
                    }
                })

            } else {
                const agency = await getAgencyBySlug({ slug: value, signal })
                const enterprise = await getEnterpriseBySlug({ slug: selectEnterprise.current.value, signal })
                const store01 = await getAllStores({ signal, enterprise: enterprise.id, agency: agency.id })
                store01.forEach(s => {
                    tb.push({ key: s.id, name: s.name, value: s.slug })
                })
                setData(prev => {
                    return {
                        ...prev,
                        store01: tb,
                    }
                })

            }

            setData(prev => {
                return {
                    ...prev,
                    agency02,
                }
            })
        }


        if (identifier === "agency02") {
            if (value == selectEnterprise.current.value) {
                const enterprise = await getEnterpriseBySlug({ slug: value, signal })
                const store02 = await getAllStorePrincipal({ signal, enterprise: enterprise.id, agency: 0 })
                store02.forEach(s => {
                    if (s.slug != selectStore01.current.value && selectStore01 != "Sélectionner un magasin de départ") {
                        tb.push({ key: s.id, name: s.name, value: s.slug })
                    }

                })
                setData(prev => {
                    return {
                        ...prev,
                        store02: tb,
                    }
                })

            } else {
                const agency = await getAgencyBySlug({ slug: value, signal })
                const enterprise = await getEnterpriseBySlug({ slug: selectEnterprise.current.value, signal })
                const store02 = await getAllStores({ signal, enterprise: enterprise.id, agency: agency.id })
                store02.forEach(s => {
                    if (s.slug != selectStore01.current.value && selectStore01 != "Sélectionner un magasin de départ") {
                        tb.push({ key: s.id, name: s.name, value: s.slug })
                    }
                })
                setData(prev => {
                    return {
                        ...prev,
                        store02: tb,
                    }
                })

            }


        }

        if (identifier === "product") {
            let tb1 = []
            const product = await getProductBySlug({ signal, slug: value })
            const agency = await getAgencyBySlug({ slug: selectAgency01.current.value })
            let storePrincipal = null
            let store = null
            if (selectEnterprise.current.value === selectAgency01.current.value) {
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
            const enterprise = await getEnterpriseBySlug({ slug: selectEnterprise.current.value, signal })
            const agency = await getAgencyBySlug({ slug: selectAgency01.current.value, signal })
            let storePrincipal = null
            let store = null
            if (selectEnterprise.current.value === selectAgency01.current.value) {
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
            if (selectEnterprise.current.value === "Sélectionner une entreprise") {
                errors.push("Veuillez sélectionner l'entreprise")
            }

            if (selectAgency01.current.value === "Sélectionner une agence de départ") {
                errors.push("Veuillez sélectionner l'agence de départ")
            }

            if (selectAgency02.current.value === "Sélectionner une agence d'arrivée") {
                errors.push("Veuillez sélectionner l'agence d'arrivée")
            }

            if (selectStore01.current.value === "Sélectionner un magasin de départ") {
                errors.push("Veuillez sélectionner le magasin de départ")
            }

            if (selectStore02.current.value === "Sélectionner un magasin d'arrivée") {
                errors.push("Veuillez sélectionner le magasin d'arrivée")
            }

            if (selectStore01.current.value !== "Sélectionner un magasin de départ" && selectStore02.current.value !== "Sélectionner un magasin d'arrivée" && selectStore01.current.value === selectStore02.current.value) {
                errors.push("Le magasin de départ doit être différent du magasin d'arrivé")
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
            products.push({ id: length + 1, product: selectProduct.current.value, quantity: inputQuantity.current.value, lot: selectLot.current.value, enterprise: selectEnterprise.current.value, agency01: selectAgency01.current.value, store01: selectStore01.current.value, agency02: selectAgency02.current.value, store02: selectStore02.current.value })
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

        <div className="w-full max-h-full flex overflow-y-auto">
            <div className="w-1/2  p-2 m-1 border-2 border-sky-950 flex flex-col items-center gap-2 shadow-lg shadow-sky-950 rounded">

                <div>
                    <Select label="Entreprise *" id="enterprise" name="enterprise" selectedTitle="Sélectionner une entreprise" data={data?.enterprises} ref={selectEnterprise} disabled={data?.enabled} />
                </div>
                <div className="flex gap-2">
                    <div className="flex flex-col gap-2">
                        <Select label="Agence départ*" id="agency01" name="agency01" selectedTitle="Sélectionner une agence de départ" data={data?.agency01} ref={selectAgency01} onChange={(e) => handleChange("agency01", e.target.value)} disabled={data?.enabled} />
                        <Select label="Agence d'arrivée'*" id="agency02" name="agency02" selectedTitle="Sélectionner une agence d'arrivée" data={data?.agency02} ref={selectAgency02} onChange={(e) => handleChange("agency02", e.target.value)} disabled={data?.enabled} />

                    </div>
                    <div className="flex flex-col gap-2">
                        <Select label="Magasin départ*" id="store01" name="store01" selectedTitle="Sélectionner un magasin de départ" data={data?.store01} ref={selectStore01} onChange={(e) => handleChange("store01", e.target.value)} disabled={data?.enable} />
                        <Select label="Magasin d'arrivée*" id="store02" name="store02" selectedTitle="Sélectionner un magasin d'arrivée" data={data?.store02} ref={selectStore02} disabled={data?.enabled} />

                    </div>


                </div>
                <div className="flex gap-4">
                    <div className="flex flex-col gap-2">
                        <Select label="Article *" id="product" name="product" selectedTitle="Sélectionner un article" data={data?.productList} ref={selectProduct} onChange={(e) => handleChange("product", e.target.value)} />
                        <Input label="Stock *" type="number" name="stock" defaultValue={data?.stock} placeholder="Stock" className="border border-sky-950" ref={inputStock} readOnly />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Select label="Lot *" id="lot" name="lot" selectedTitle="Sélectionner un lot" data={data?.lots} ref={selectLot} onChange={(e) => handleChange("lot", e.target.value)} />


                        <Input label="Quantité *" type="number" name="quantity" defaultValue={data?.quantity} placeholder="Quantité" className="border border-sky-950" onBlur={(event) => handleBlur("quantity", event.target.value)} ref={inputQuantity} />

                    </div>

                </div>

                <Submit onClick={() => handleAdd("add")}>
                    Ajouter
                </Submit>
                {data?.errors.length > 0 && <ul>
                    {data?.errors.map(e => <li key={e} className="text-red-500">{e}</li>)}
                </ul>}
            </div>
            <div className="w-1/2 p-2 m-1 border-2 border-sky-950 shadow-lg shadow-sky-950 rounded">
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
                            <th className="border px-6 hidden">
                                Entreprise
                            </th>
                            <th className="border px-6 hidden">
                                Agence de départ
                            </th>
                            <th className="border px-6 hidden">
                                Magasin de départ
                            </th>
                            <th className="border px-6 hidden">
                                Agence d'arrivée'
                            </th>
                            <th className="border px-6 hidden">
                                Magasin d'arrivée'
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
                            <td className="border border-sky-950 text-center hidden">{selectEnterprise.current.value}</td>
                            <td className="border border-sky-950 text-center hidden">{selectAgency01.current.value}</td>
                            <td className="border border-sky-950 text-center hidden">{selectStore01.current.value}</td>
                            <td className="border border-sky-950 text-center hidden">{selectAgency02.current.value}</td>
                            <td className="border border-sky-950 text-center hidden">{selectStore02.current.value}</td>
                        </tr>)}
                    </tbody>

                </table>
                {data.products.length > 0 && <div className="flex justify-end mt-4">
                    <Submit onClick={() => handleSave()}>
                        Enregistrer
                    </Submit>
                </div>}
            </div>
        </div>

        <Modal ref={dialog} title="Produit existant" size="h-1/5">
            <p className="mb-4"><FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />Ce produit existe déjà dans le panier.</p>
            <Submit onClick={() => dialog.current.close()}>Fermer</Submit>
        </Modal>


        {dataItem.length > 0 && <Notification key={relaunch} error={errorNotification} messages={dataItem} />}
    </>
}