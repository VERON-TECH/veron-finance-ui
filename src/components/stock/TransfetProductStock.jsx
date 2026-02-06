import { useAnimate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPurchaseOrder, getAgencyById, getAgencyBySlug, getAllAgencies, getAllProducts, getAllStorePrincipal, getAllSupplierAdvances, getAllSuppliers, getEnterpriseById, getProductById, getProductBySlug, queryClient } from "../../utils/http.js";
import Input from "../../layout/Input.jsx"
import Submit from "../../layout/Submit.jsx"
import { noteActions } from "../../store/noteSlice.js";
import responseHttp from "../../utils/responseHttp.js"
import Select from "../../layout/Select.jsx";
import { paymentMethodPurchase } from "../../data/info.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle, faPlusCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
import Modal from "../../layout/Modal.jsx";
import Notification from "../../layout/Notification.jsx";

export default function TransfertProductStock() {
    const errorNotification = useSelector(state => state.note.error);
    const relaunch = useSelector(state => state.note.relaunch);
    const dataItem = useSelector(state => state.note.dataItem)
    const user = JSON.parse(localStorage.getItem("user"));
    const dialog = useRef();
    const dialog1 = useRef();
    const selectEnterprise = useRef();
    const selectAgency01 = useRef();
    const selectAgency02 = useRef();
    const selectStore01 = useRef();
    const selectStore02 = useRef();
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
        agency01: [],
        agency02: [],
        store01: [],
        store02: [],
        products: [],
        productList: [],
        errors: []


    })

    useEffect(() => {

        if (user.enterprise > 0 && user.agency > 0) {

            let tbEl = {
                tb: [],
                tb1: [],
            }
            async function get(signal) {

                const allEnterprises = await getEnterpriseById({ id: user.enterprise, signal })
                const allAgencies = await getAllAgencies()
                tbEl.tb.push({ key: allEnterprises.id, name: allEnterprises.name, value: allEnterprises.slug })
                allAgencies.forEach(a => {
                    if (a.enterprise == allEnterprises.id || a.slug == allEnterprises.slug) {
                        tbEl.tb1.push({ key: a.id, name: a.name, value: a.slug })
                    }
                })




                setData(prev => {
                    return {
                        ...prev,
                        agency01: tbEl.tb1,
                        enterprises: tbEl.tb,


                    }
                })
            }
            get()
        }

    }, [])

    async function handleSave() {
        let products = []
        data.products.forEach(p => {
            products.push(p.product + ":" + p.quantity + ":" + p.price)
        })
        const enterprise = selectEnterprise.current.value
        const agency = selectAgency.current.value
        const supplier = selectSupplier.current.value
        const paymentMethod = selectPaymentMethod.current.value
        const supplierAdvances = data.supplierAdvances
        const discount = inputDiscount.current.value == "" ? 0 : inputDiscount.current.value
        const purchaseOrderDto = {
            enterprise,
            agency,
            supplier,
            paymentMethod,
            supplierAdvances,
            products,
            discount,
        }

        const responseData = await createPurchaseOrder(purchaseOrderDto)
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
        }
        dispatch(noteActions.show());
        dispatch(noteActions.relaunch());
        dispatch(noteActions.sendData(responseData))

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
            const agency02 = data.agency01.filter(a => a.value != value)
            if (value == selectEnterprise.current.value) {
                const agency = await getAgencyBySlug({ slug: value, signal })
                const store01 = await getAllStorePrincipal({ signal, agency: agency.id })
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
            const product = await getProductBySlug({ signal, slug: value })
            inputPrice.current.value = product.price
        }


    }


    function handleAdd(identifier) {
        let errors = []
        if (identifier === "add") {
            if (selectSupplier.current.value === "Sélectionner un fournisseur") {
                errors.push("Veuillez sélectionner un fournisseur")
            }

            if (selectEnterprise.current.value === "Sélectionner une entreprise") {
                errors.push("Veuillez sélectionner une entreprise")
            }

            if (selectAgency01.current.value === "Sélectionner une agence") {
                errors.push("Veuillez sélectionner une agence")
            }

            if (selectPaymentMethod.current.value === "Sélectionner un moyen de paiement") {
                errors.push("Veuillez sélectionner un moyen de paiement")
            }

            if (selectPaymentMethod.current.value === "AVANCE_VERSEE" && selectSupplierAdvance.current.value === "Sélectionner une avance versée") {
                errors.push("Veuillez sélectionner une avance versée")
            }

            if (selectProduct.current.value === "Sélectionner un produit") {
                errors.push("Veuillez sélectionner un produit")
            }

            if (inputQuantity.current.value === "" || inputQuantity.current.value <= 0) {
                errors.push("Veuillez renseigner la quantité")
            }
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
        products.push({ id: length + 1, product: selectProduct.current.value, quantity: inputQuantity.current.value, price: inputPrice.current.value })

        let priceHT = 0;
        let priceTTC = 0;
        products.forEach(p => {
            priceHT += (p.quantity * p.price)
            priceTTC += (p.quantity * p.price)
        })

        setData(prev => {
            return {
                ...prev,
                products,
                priceHT,
                priceTTC,
            }
        })

        return { errors: null }
    }


    function handleDelete(value) {
        let products = [...data.products]
        products = products.filter(p => p.id !== value)
        let priceHT = 0;
        let priceTTC = 0;
        products.forEach(p => {
            priceHT += (p.quantity * p.price)
            priceTTC += (p.quantity * p.price)
        })
        setData(prev => {
            return {
                ...prev,
                products,
                priceHT,
                priceTTC,
            }
        })

    }


    return <>

        <div className="w-full max-h-full flex overflow-y-auto">
            <div className="w-1/2  p-2 m-1 border-2 border-sky-950 flex flex-col items-center gap-2 shadow-lg shadow-sky-950">

                <div>
                    <Select label="Entreprise *" id="enterprise" name="enterprise" selectedTitle="Sélectionner une entreprise" data={data?.enterprises} ref={selectEnterprise} />
                </div>
                <div className="flex gap-2">
                    <div className="flex flex-col gap-2">
                        <Select label="Agence départ*" id="agency01" name="agency01" selectedTitle="Sélectionner une agence de départ" data={data?.agency01} ref={selectAgency01} onChange={(e) => handleChange("agency01", e.target.value)} />
                        <Select label="Agence d'arrivée'*" id="agency02" name="agency02" selectedTitle="Sélectionner une agence d'arrivée" data={data?.agency02} ref={selectAgency02} />

                    </div>
                    <div className="flex flex-col gap-2">
                        <Select label="Magasin départ*" id="store01" name="store01" selectedTitle="Sélectionner une magasin de départ" data={data?.store01} ref={selectStore01} onChange={(e) => handleChange("store01", e.target.value)} />
                        <Select label="Magasin d'arrivée*" id="store02" name="store02" selectedTitle="Sélectionner une magasin d'arrivée" data={data?.store02} ref={selectStore02} />

                    </div>

                </div>
                <Select label="Agence arrivée *" id="product" name="product" selectedTitle="Sélectionner un produit" data={data?.productList} ref={selectProduct} onChange={(e) => handleChange("product", e.target.value)} />
                <Input label="Quantité *" type="number" name="quantity" defaultValue={data?.quantity} placeholder="Quantité" className="border border-sky-950" onBlur={(event) => handleBlur("quantity", event.target.value)} ref={inputQuantity} />
                <Input label="Prix *" type="number" defaultValue={data?.price} name="price" placeholder="Prix" className="border border-sky-950" onBlur={(event) => handleBlur("price", event.target.value)} ref={inputPrice} />

                <Submit onClick={() => handleAdd("add")}>
                    Ajouter
                </Submit>
                {data?.errors.length > 0 && <ul>
                    {data?.errors.map(e => <li key={e} className="text-red-500">{e}</li>)}
                </ul>}
            </div>
            <div className="w-1/2 p-2 m-1 border-2 border-sky-950 shadow-lg shadow-sky-950">
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
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.products.length > 0 && data?.products.map(p => <tr key={p.product}>
                            <td className="border border-sky-950 text-center">{p.id}</td>
                            <td className="border border-sky-950 text-center">{p.product}</td>
                            <td className="border border-sky-950 text-center">{p.quantity}</td>
                            <td className="border border-sky-950 text-center">{p.price}</td>
                            <td className="border border-sky-950 text-center"><FontAwesomeIcon icon={faTrash} className="cursor-pointer text-red-500" onClick={() => handleDelete(p.id)} /></td>
                        </tr>)}
                    </tbody>
                    {data.products.length > 0 && <tfoot>
                        <tr className="bg-sky-950 text-sky-50">
                            <td className="border text-center" colSpan={2}>Prix H.T.</td>
                            <td className="border text-center">{data?.priceHT}</td>
                            <td className="border text-center p-1"><input type="number" name="discount" id="discount" placeholder="Rémise" className="bg-sky-50 text-sky-950 text-center" ref={inputDiscount} onChange={(e) => handleChange("discount", e.target.value)} /></td>
                            <td className="border text-center">{data.priceTTC}</td>
                        </tr>
                    </tfoot>}
                </table>
                {data.products.length > 0 && <div className="flex justify-end mt-4">
                    <Submit onClick={() => handleSave()}>
                        Enregistrer
                    </Submit>

                    {data.supplierAdvances.length > 0 && <table className="w-full">
                        <thead>
                            <tr className="bg-sky-950 text-sky-50">
                                <th className="border px-6">
                                    ref
                                </th>
                                <th className="border px-6">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.supplierAdvances.length > 0 && data.supplierAdvances.map(s => <tr key={s.id}>
                                <td className="border border-sky-950 text-center">{s.ref}</td>
                                <td className="border border-sky-950 text-center"><FontAwesomeIcon icon={faTrash} className="cursor-pointer text-red-500" onClick={() => handleDelete(p.id)} /></td>
                            </tr>)}
                        </tbody>

                    </table>}
                </div>}
            </div>
        </div>

        <Modal ref={dialog} title="Produit existant" size="h-1/5">
            <p className="mb-4"><FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />Ce produit existe déjà dans le panier.</p>
            <Submit onClick={() => dialog.current.close()}>Fermer</Submit>
        </Modal>

        <Modal ref={dialog1} title="Montant Rémise incorrect" size="h-1/5">
            <p className="mb-4"><FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />Le montant de la remise est incorrect.</p>
            <Submit onClick={() => dialog1.current.close()}>Fermer</Submit>
        </Modal>

        {dataItem.length > 0 && <Notification key={relaunch} error={errorNotification} messages={dataItem} />}
    </>
}