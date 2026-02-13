import { useAnimate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPackage, getAgencyBySlug, getAllAgencies, getAllLotById, getAllProducts, getAllStocks, getAllStorePrincipal, getAllStores, getEnterpriseById, getEnterpriseBySlug, getLotById, getLotBySlug, getProductBySlug, getStock, getStoreById, getStoreBySlug, getStorePrincipalById, getStorePrincipalBySlug, suppliesStock, transferStock } from "../../utils/http.js";
import Input from "../../layout/Input.jsx"
import Submit from "../../layout/Submit.jsx"
import Select from "../../layout/Select.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle, faTrash } from "@fortawesome/free-solid-svg-icons";
import Modal from "../../layout/Modal.jsx";
import Notification from "../../layout/Notification.jsx";
import responseHttp from "../../utils/responseHttp.js";
import { noteActions } from "../../store/noteSlice.js";
import { isNotEmpty } from "../../utils/validation.jsx";

export default function CreatePackage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const dialog = useRef();
    const selectEnterprise = useRef();
    const selectAgency01 = useRef();
    const selectStore01 = useRef();
    const selectProduct = useRef();
    const selectLot = useRef();
    const inputQuantity = useRef()
    const inputStock = useRef();
    const inputName = useRef();
    const inputPrice = useRef();
    const dispatch = useDispatch();
    const [animate] = useAnimate();
    const [data, setData] = useState({
        enterprises: [],
        agency01: [],
        store01: [],
        products: [],
        productList: [],
        errors: [],
        quantity: 0,
        stock: 0,
        lots: [],
        enabled: false,
        name: "",
        price: 0

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
                    if (a.enterprise == allEnterprises.id && a.slug !== allEnterprises.slug) {
                        tbEl.tb1.push({ key: a.id, name: a.name, value: a.slug })
                    }
                })

                allProducts.forEach(p => {
                    if (p.category === "PRODUITS") {
                        tbEl.tb2.push({ key: p.id, name: p.name, value: p.slug })
                    }

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
            products.push(p.product + ":" + p.store + ":" + p.quantity + ":" + p.lot + ":" + p.price)
        })
        const enterprise = selectEnterprise.current.value
        const agency = selectAgency01.current.value
        const store = selectStore01.current.value
        const name = inputName.current.value
        const packageKitDto = {
            enterprise,
            agency,
            name,
            store,
            products,
        }

        const responseData = await createPackage(packageKitDto)
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

        if (field === "name") {
            if (!isNotEmpty(value)) {
                animate(inputName.current, { x: [0, 15, 0] }, { bounce: 0.75 })
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
                tb.push({ key: 0, name: "Sélectionner un lot", value: "Sélectionner un lot" }),
                    tb.push({ key: l.id, name: l.name, value: l.slug })
            })

            inputPrice.current.value = product.price
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



            if (selectStore01.current.value === "Sélectionner un magasin de départ") {
                errors.push("Veuillez sélectionner le magasin de départ")
            }



            if (selectProduct.current.value === "Sélectionner un produit") {
                errors.push("Veuillez sélectionner un produit.")
            }

            if (selectLot.current.value === "Sélectionner un lot") {
                errors.push("Veuillez sélectionner un lot.")
            }

            if (Number(inputQuantity.current.value) <= 0) {
                errors.push("Veuillez renseigner la quantité.")
            }

            if (Number(inputPrice.current.value) <= 0) {
                errors.push("Veuillez renseigner le prix.")
            }

            if (Number(inputQuantity.current.value) > Number(inputStock.current.value)) {
                errors.push("Le stock du produit " + selectProduct.current.value + " est insuffisant.")
            }

            if (!isNotEmpty(inputName.current.value)) {
                errors.push("Veuillez renseigner le nom du paquet.")
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
            products.push({ id: length + 1, product: selectProduct.current.value, quantity: inputQuantity.current.value, price: inputPrice.current.value, lot: selectLot.current.value, store: selectStore01.current.value })
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
            <div className="w-1/2 p-2 m-1 border-2 border-sky-950 shadow-lg shadow-sky-950 rounded">
                <div className="flex justify-center gap-4">
                    <Input label="Nom du paquet*" type="text" name="name" placeholder="Nom du paquet" className="border border-sky-950" ref={inputName} /> </div>
                <div className="flex justify-center gap-4">
                    <Select label="Entreprise *" id="enterprise" name="enterprise" selectedTitle="Sélectionner une entreprise" data={data?.enterprises} ref={selectEnterprise} disabled={data?.enabled} />
                    <Select label="Agence *" id="agency01" name="agency01" selectedTitle="Sélectionner une agence de départ" data={data?.agency01} ref={selectAgency01} onChange={(e) => handleChange("agency01", e.target.value)} disabled={data?.enabled} />
                </div>
                <div className="flex justify-center gap-4">
                    <Select label="Magasin *" id="store01" name="store01" selectedTitle="Sélectionner un magasin de départ" data={data?.store01} ref={selectStore01} onChange={(e) => handleChange("store01", e.target.value)} disabled={data?.enable} />
                    <Select label="Article *" id="product" name="product" selectedTitle="Sélectionner un article" data={data?.productList} ref={selectProduct} onChange={(e) => handleChange("product", e.target.value)} />
                </div>

                <div className="flex justify-center gap-4">
                    <Select label="Lot *" id="lot" name="lot" selectedTitle="Sélectionner un lot" data={data?.lots} ref={selectLot} onChange={(e) => handleChange("lot", e.target.value)} />
                    <Input label="Stock *" type="number" name="stock" defaultValue={data?.stock} placeholder="Stock" className="border border-sky-950" ref={inputStock} readOnly />
                </div>
                <div className="flex justify-center gap-4">
                    <Input label="Prix *" type="number" name="price" defaultValue={data?.price} placeholder="Prix" className="border border-sky-950" onBlur={(event) => handleBlur("price", event.target.value)} ref={inputPrice} />
                    <Input label="Quantité *" type="number" name="quantity" defaultValue={data?.quantity} placeholder="Quantité" className="border border-sky-950" onBlur={(event) => handleBlur("quantity", event.target.value)} ref={inputQuantity} />
                </div>
                <Submit onClick={() => handleAdd("add")} className="mb-4">
                    Ajouter
                </Submit>
                {data?.errors.length > 0 && <ul className="text-center">
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
                                Prix
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
                            <td className="border border-sky-950 text-center">{p.price}</td>
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
            </div>



        </div>



        <Modal ref={dialog} title="Produit existant" size="h-1/5">
            <p className="mb-4"><FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />Ce produit existe déjà dans le panier.</p>
            <Submit onClick={() => dialog.current.close()}>Fermer</Submit>
        </Modal>

    </>
}