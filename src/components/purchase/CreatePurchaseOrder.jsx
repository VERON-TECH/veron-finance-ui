import { useAnimate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPurchaseOrder, getAgencyById, getAllProducts, getAllPurchaseOrders, getAllSupplierAdvances, getAllSuppliers, getEnterpriseById, getProductBySlug, getSupplierAdvanceByRef, getSupplierById } from "../../utils/http.js";
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
import { useNavigate } from "react-router-dom";
import { printActions } from "../../store/print.js";

export default function CreatePurchaseOrder() {
    const errorNotification = useSelector(state => state.note.error);
    const relaunch = useSelector(state => state.note.relaunch);
    const dataItem = useSelector(state => state.note.dataItem)
    const user = JSON.parse(localStorage.getItem("user"));
    const dialog = useRef();
    const dialog1 = useRef();
    const dialog2 = useRef();
    const selectSupplier = useRef();
    const selectProduct = useRef();
    const selectPaymentMethod = useRef();
    const selectSupplierAdvance = useRef();
    const inputQuantity = useRef()
    const inputPrice = useRef()
    const inputDiscount = useRef();
    const inputEnterprise = useRef();
    const inputAgency = useRef();
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const [scope, animate] = useAnimate();
    const [data, setData] = useState({
        enterprise: "",
        agencie: "",
        productList: [],
        products: [],
        suppliers: [],
        supplierAdvanceList: [],
        supplierAdvances: [],
        payment: "",
        price: 0,
        priceHT: 0,
        priceTTC: 0,
        quantity: 0,
        errors: []

    })

    useEffect(() => {

        if (user.enterprise > 0 && user.agency > 0) {

            let tbEl = {
                tb2: [],
                tb3: [],
                tb4: [],
            }
            async function get(signal) {

                const agency = await getAgencyById({ id: user.agency, signal })
                const enterprise = await getEnterpriseById({ id: user.enterprise, signal })
                const allProducts = await getAllProducts({ signal, enterprise: user.enterprise })
                const allSuppliers = await getAllSuppliers({ signal, enterprise: user.enterprise })
                const allSupplierAdvances = await getAllSupplierAdvances({ signal, enterprise: user.enterprise, agency: user.agency })

                allProducts.forEach(p => {
                    if (p.category !== "PACQUET") {
                        tbEl.tb2.push({ key: p.id, name: p.name, value: p.slug })
                    }

                })

                allSuppliers.forEach(s => {
                    tbEl.tb3.push({ key: s.id, name: s.name, value: s.slug })
                })

                allSupplierAdvances.forEach(s => {
                    tbEl.tb4.push({ key: s.id, name: s.ref, value: s.ref })
                })

                setData(prev => {
                    return {
                        ...prev,
                        agency: agency.slug,
                        enterprise: enterprise.slug,
                        productList: tbEl.tb2,
                        suppliers: tbEl.tb3,
                        supplierAdvanceList: tbEl.tb4

                    }
                })
            }
            get()
        }

    }, [])

    async function handleSave(signal) {
        let products = []
        let totalPrice = 0
        data.products.forEach(p => {
            totalPrice += (Number(p.quantity) * Number(p.price))
            products.push(p.product + ":" + p.quantity + ":" + p.price)
        })
        const enterprise = inputEnterprise.current.value
        const agency = inputAgency.current.value
        const supplier = selectSupplier.current.value
        const paymentMethod = selectPaymentMethod.current.value
        const supplierAdvances = data.supplierAdvances
        let tb = []
        let totalAdvance = 0
        if (supplierAdvances.length > 0) {
            for (let s of supplierAdvances) {
                totalAdvance += s.amount
                tb.push(s.ref)
            }
        }

        if (totalPrice > totalAdvance && paymentMethod === "AVANCE_VERSEE") {
            let errors = ["L'avance versée ne permet pas d'effectuer cette commande."]
            dispatch(noteActions.error(true))
            dispatch(noteActions.show());
            dispatch(noteActions.relaunch());
            dispatch(noteActions.sendData(errors))
            return
        }

        const discount = inputDiscount.current.value == "" ? 0 : inputDiscount.current.value
        const purchaseOrderDto = {
            enterprise,
            agency,
            supplier,
            paymentMethod,
            supplierAdvances: tb,
            products,
            discount,
        }

        const responseData = await createPurchaseOrder(purchaseOrderDto)
        const allPurchaseOrders = await getAllPurchaseOrders({ signal, enterprise: user.enterprise, agency: user.agency })
        const purchaseOrder = allPurchaseOrders[allPurchaseOrders.length - 1]
        const supplier_ = await getSupplierById({ id: purchaseOrder.supplier, signal })
        const enterprise_ = await getEnterpriseById({ id: user.enterprise, signal })
        let products_ = []
        for (let p of data.products) {
            let product_ = await getProductBySlug({ signal, slug: p.product })
            products_.push({ ref: product_.ref, name: product_.name, quantity: p.quantity, price: p.price, totalPrice: p.quantity * p.price })
        }

        const print = {
            purchaseOrder,
            enterprise: enterprise_,
            products_,
            supplier: supplier_.name
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
            if (responseData[0].includes("a été créée avec succès")) {
                dispatch(printActions.getPrint(print))
                navigate("/print-purchase")
            }
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
        if (identifier === "paymentMethod") {
            setData(prev => {
                return {
                    ...prev,
                    payment: value,
                }
            })
        }

        if (identifier === "product") {
            const product = await getProductBySlug({ signal, slug: value })
            inputPrice.current.value = product.price
        }

        if (identifier === "discount") {
            if (data.priceHT > 0 && data.priceHT > value) {
                const priceTTC = data.priceHT - value
                setData(prev => {
                    return {
                        ...prev,
                        priceTTC,
                        discount: value,
                    }
                })
            } else {
                dialog1.current.open()
                const priceTTC = data.priceHT
                inputDiscount.current.value = 0
                setData(prev => {
                    return {
                        ...prev,
                        priceTTC,
                        discount: 0,
                    }
                })
            }

        }
    }


    function handleAdd(identifier) {
        let errors = []
        if (identifier === "add") {
            if (selectSupplier.current.value === "Sélectionner un fournisseur") {
                errors.push("Veuillez sélectionner un fournisseur")
            }

            if (inputEnterprise.current.value === "Sélectionner une entreprise") {
                errors.push("Veuillez sélectionner une entreprise")
            }

            if (inputAgency.current.value === "Sélectionner une agence") {
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

        selectSupplier.current.disabled = true
        selectPaymentMethod.current.disabled = true
        inputQuantity.current.value = 0
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

    async function handleAddAdvance(signal) {
        let supplierAdvances = [...data.supplierAdvances]
        const supplierAdvance = await getSupplierAdvanceByRef({ signal, ref: selectSupplierAdvance.current.value })
        let supplierAdvanceNames = supplierAdvances.map(s => s.ref);
        if (supplierAdvanceNames.includes(selectSupplierAdvance.current.value)) {
            dialog2.current.open();
            return { errors: null }
        }
        supplierAdvances.push({ id: supplierAdvances.length + 1, ref: supplierAdvance.ref, amount: supplierAdvance.balance })
        setData(prev => {
            return {
                ...prev,
                supplierAdvances
            }
        })
        return { errors: null }
    }


    function handleDeleteAdvance(value) {
        let supplierAdvances = [...data.supplierAdvances]
        supplierAdvances = supplierAdvances.filter(s => s.id !== value)

        setData(prev => {
            return {
                ...prev,
                supplierAdvances
            }
        })

    }

    return <>

        <div className="w-full flex overflow-y-auto">
            <div className="w-1/2 p-2 m-1 border-2 border-sky-950 flex flex-col items-center gap-2 shadow-lg shadow-sky-950">
                <div className="flex gap-2 justify-between">
                    <Select label="Fournisseur *" id="supplier" name="supplier" selectedTitle="Sélectionner un fournisseur" data={data?.suppliers} ref={selectSupplier} />
                    <Select label="Paiement *" id="paymentMethod" name="paymentMethod" selectedTitle="Sélectionner un moyen de paiement" data={paymentMethodPurchase} ref={selectPaymentMethod} onChange={(e) => handleChange("paymentMethod", e.target.value)} />
                </div>
                <div className="hidden">
                    <Input label="Entreprise *" type="text" defaultValue={data?.enterprise} name="enterprise" placeholder="Entreprise" className="border border-sky-950" readOnly ref={inputEnterprise} />
                    <Input label="Agence *" type="text" defaultValue={data?.agency} name="agency" placeholder="Agence" className="border border-sky-950" readOnly ref={inputAgency} />
                </div>
                {data?.payment === "AVANCE_VERSEE" &&
                    <div className="flex gap-2">
                        <Select label="Avance versée *" id="supplierAdvance" name="supplierAdvance" selectedTitle="Sélectionner une avance versée" data={data.supplierAdvanceList} ref={selectSupplierAdvance} />
                        <button className="cursor-pointer" onClick={(e) => handleAddAdvance()}>
                            <FontAwesomeIcon icon={faPlusCircle} className="w-32" />
                        </button>
                    </div>
                }

                {data?.supplierAdvances.length > 0 && <table className="w-2/3">
                    <thead>
                        <tr className="bg-sky-950 text-sky-50">
                            <th className="border px-4">
                                id
                            </th>
                            <th className="border px-4">
                                Ref.
                            </th>
                            <th className="border px-4">
                                Montant
                            </th>
                            <th className="border px-4">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.supplierAdvances.length > 0 && data.supplierAdvances.map(s => <tr key={s.id}>
                            <td className="border border-sky-950 text-center">{s.id}</td>
                            <td className="border border-sky-950 text-center">{s.ref}</td>
                            <td className="border border-sky-950 text-center">{Number(s.amount).toLocaleString()}</td>
                            <td className="border border-sky-950 text-center"><FontAwesomeIcon icon={faTrash} className="cursor-pointer text-red-500" onClick={() => handleDeleteAdvance(s.id)} /></td>
                        </tr>)}
                    </tbody>

                </table>}
                <div className="flex gap-2 justify-between">
                    <Select label="Produit *" id="product" name="product" selectedTitle="Sélectionner un produit" data={data?.productList} ref={selectProduct} onChange={(e) => handleChange("product", e.target.value)} />
                    <Input label="Prix *" type="number" defaultValue={data?.price} name="price" placeholder="Prix" className="border border-sky-950" onBlur={(event) => handleBlur("price", event.target.value)} ref={inputPrice} />

                </div>
                <div className="flex justify-center">
                    <Input label="Quantité *" type="number" name="quantity" defaultValue={data?.quantity} placeholder="Quantité" className="border border-sky-950" onBlur={(event) => handleBlur("quantity", event.target.value)} ref={inputQuantity} />
                </div>

                <Submit onClick={() => handleAdd("add")}>
                    Ajouter
                </Submit>
                {data?.errors.length > 0 && <ul>
                    {data.errors.map(e => <li key={e} className="text-red-500">{e}</li>)}
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
                        {data?.products.length > 0 && data.products.map(p => <tr key={p.product}>
                            <td className="border border-sky-950 text-center">{p.id}</td>
                            <td className="border border-sky-950 text-center">{p.product}</td>
                            <td className="border border-sky-950 text-center">{Number(p.quantity).toLocaleString()}</td>
                            <td className="border border-sky-950 text-center">{Number(p.price).toLocaleString()}</td>
                            <td className="border border-sky-950 text-center"><FontAwesomeIcon icon={faTrash} className="cursor-pointer text-red-500" onClick={() => handleDelete(p.id)} /></td>
                        </tr>)}
                    </tbody>
                    {data.products.length > 0 && <tfoot>
                        <tr className="bg-sky-950 text-sky-50">
                            <td className="border text-center" colSpan={2}>Prix H.T.</td>
                            <td className="border text-center">{Number(data?.priceHT).toLocaleString()}</td>
                            <td className="border text-center p-1"><input type="number" name="discount" id="discount" placeholder="Rémise" className="bg-sky-50 text-sky-950 text-center" ref={inputDiscount} onChange={(e) => handleChange("discount", e.target.value)} /></td>
                            <td className="border text-center">{Number(data.priceTTC).toLocaleString()}</td>
                        </tr>
                    </tfoot>}
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

        <Modal ref={dialog2} title="Avance existant" size="h-1/5">
            <p className="mb-4"><FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />Cette avance existe déjà dans le panier.</p>
            <Submit onClick={() => dialog2.current.close()}>Fermer</Submit>
        </Modal>

        <Modal ref={dialog1} title="Montant Rémise incorrect" size="h-1/5">
            <p className="mb-4"><FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />Le montant de la remise est incorrect.</p>
            <Submit onClick={() => dialog1.current.close()}>Fermer</Submit>
        </Modal>

        {dataItem.length > 0 && <Notification key={relaunch} error={errorNotification} messages={dataItem} />}
    </>
}