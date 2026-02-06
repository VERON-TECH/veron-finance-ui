
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { annulationPurchaseOrder, createProductStock, getAgencyById, getAgencyBySlug, getAllProducts, getAllStorePrincipal, getAllSuppliers, getEnterpriseById, getProductBySlug, getPurchaseOrderById, getSupplierById, queryClient, updatePurchaseOrder } from "../../utils/http.js";
import Input from "../../layout/Input.jsx"
import Submit from "../../layout/Submit.jsx"
import { isNotEmpty } from "../../utils/validation.jsx"
import { noteActions } from "../../store/noteSlice.js";
import responseHttp from "../../utils/responseHttp.js"
import Select from "../../layout/Select.jsx";
import { paymentMethodPurchase } from "../../data/info.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle, faPlusCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
import Modal from "../../layout/Modal.jsx";
import Notification from "../../layout/Notification.jsx";

export default function UpdatePurchaseOrder() {
    const errorNotification = useSelector(state => state.note.error);
    const relaunch = useSelector(state => state.note.relaunch);
    const dataItem = useSelector(state => state.note.dataItem)
    const id = useSelector(state => state.modal.value)
    const dialog = useRef();
    const dialog1 = useRef();
    const dialog2 = useRef();
    const dialog3 = useRef();
    const inputEnterprise = useRef();
    const inputAgency = useRef();
    const inputSupplier = useRef()
    const selectSupplier = useRef();
    const selectProduct = useRef();
    const inputPaymentMethod = useRef()
    const selectPaymentMethod = useRef();
    const selectSupplierAdvance = useRef();
    const selectStorePrincipal = useRef();
    const inputQuantity = useRef()
    const inputPrice = useRef()
    const inputDiscount = useRef();
    const inputRef = useRef();
    const dispatch = useDispatch();
    const [data, setData] = useState({
        productList: [],
        products: [],
        suppliers: [],
        actualSupplier: "",
        actualEnterprise: "",
        actualAgency: "",
        agencyEnterprise: "",
        actualPayment: "",
        supplierAdvanceList: [],
        supplierAdvances: [],
        payment: "",
        price: 0,
        priceHT: 0,
        priceTTC: 0,
        quantity: 0,
        errors: [],
        purchaseOrder: {},
        disabled: false,
        storePrincipals: []

    })

    useEffect(() => {

        if (id != 0) {

            let tbEl = {
                tb: [],
                tb1: [],
                tb2: [],
            }
            async function get(signal) {

                const purchaseOrder = await getPurchaseOrderById({ signal, id })
                const allProducts = await getAllProducts({ signal, enterprise: purchaseOrder.enterprise })
                const allSuppliers = await getAllSuppliers({ signal, enterprise: purchaseOrder.enterprise })
                const supplier = await getSupplierById({ id: purchaseOrder.supplier, signal })
                const enterprise = await getEnterpriseById({ id: purchaseOrder.enterprise, signal })
                const agency = await getAgencyById({ id: purchaseOrder.agency, signal })
                const agencyEnterprise = await getAgencyBySlug({ slug: enterprise.slug, signal })
                const storePrincipals = await getAllStorePrincipal({ signal, enterprise: 0, agency: purchaseOrder.agency })
                allProducts.forEach(p => {
                    tbEl.tb.push({ key: p.id, name: p.name, value: p.slug })
                })

                allSuppliers.forEach(s => {
                    tbEl.tb1.push({ key: s.id, name: s.name, value: s.slug })
                })

                storePrincipals.forEach(s => {
                    tbEl.tb2.push({ key: s.id, name: s.name, value: s.slug })
                })



                let products = []
                let productList = [...purchaseOrder.products]
                let i = 0;
                for (let p of productList) {
                    let items = p.split(":")
                    products.push({ id: i + 1, product: items[0], quantity: items[1], price: items[2], status: "off" })
                    i++;
                }


                let priceHT = 0;
                products.forEach(p => {
                    priceHT += (p.quantity * p.price)
                })

                setData(prev => {
                    return {
                        ...prev,
                        productList: tbEl.tb,
                        suppliers: tbEl.tb1,
                        purchaseOrder,
                        actualSupplier: supplier.slug,
                        actualEnterprise: enterprise.slug,
                        actualAgency: agency.slug,
                        agencyEnterprise: agencyEnterprise.slug,
                        products,
                        priceHT,
                        discount: purchaseOrder.discount,
                        priceTTC: priceHT - purchaseOrder.discount,
                        disabled: purchaseOrder.statusPurchase === "ANNULE" ? true : false,
                        storePrincipals: tbEl.tb2

                    }
                })
            }
            get()
        }

    }, [id])

    async function handleSave() {
        let products = []
        data.products.forEach(p => {
            products.push(p.product + ":" + p.quantity + ":" + p.price)
        })
        const enterprise = inputEnterprise.current.value
        const agency = inputAgency.current.value
        const actualSupplier = inputSupplier.current.value
        const supplier = selectSupplier.current.value
        const actualPaymentMethod = inputPaymentMethod.current.value
        const paymentMethod = selectPaymentMethod.current.value
        const supplierAdvances = data.supplierAdvances
        const discount = inputDiscount.current.value == "" ? 0 : inputDiscount.current.value
        const purchaseOrderDto = {
            enterprise,
            agency,
            supplier: supplier !== "Sélectionner un fournisseur" ? supplier : actualSupplier,
            paymentMethod: paymentMethod !== "Sélectionner un moyen de paiement" ? paymentMethod : actualPaymentMethod,
            supplierAdvances,
            products,
            discount,
        }

        const responseData = await updatePurchaseOrder({ slug: data.purchaseOrder.slug, purchaseOrderDto })
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


    function handleAdd() {
        let errors = []
        if (!isNotEmpty(inputSupplier.current.value)) {
            errors.push("Veuillez sélectionner un fournisseur")
        }

        if (!isNotEmpty(inputEnterprise.current.value)) {
            errors.push("Veuillez sélectionner un fournisseur")
        }

        if (!isNotEmpty(inputAgency.current.value)) {
            errors.push("Veuillez sélectionner un fournisseur")
        }

        if (!isNotEmpty(inputPaymentMethod.current.value)) {
            errors.push("Veuillez sélectionner un fournisseur")
        }


        if (inputQuantity.current.value === "" || inputQuantity.current.value <= 0) {
            errors.push("Veuillez renseigner la quantité")
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

    function handleAddAdvance(value) {
        let supplierAdvances = [...data.supplierAdvances]
        supplierAdvances.push(value)
        setData(prev => {
            return {
                ...prev,
                supplierAdvances
            }
        })
    }


    async function handleOpenAnnulation() {
        dialog2.current.open()
    }

    async function handleOpenValidation() {
        dialog3.current.open()
    }


    async function handleAnnulation() {
        const responseData = await annulationPurchaseOrder(data.purchaseOrder.slug)
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

    function handleCloseModal() {
        dialog2.current.close()
        /**dispatch(modalActions.updateClose())**/
    }

    function handleClick(identifier, value, id) {
        const products = [...data.products]
        if (identifier == "all") {

            if (value == true) {
                for (let p of products) {
                    p.status = "on"
                }

            } else if (value == false) {
                for (let p of products) {
                    p.status = "off"
                }

            }

        } else if (identifier == "one") {

            if (value == true) {
                for (let p of products) {
                    if (p.id === id) {
                        p.status = "on"
                    }

                }

            } else if (value == false) {
                for (let p of products) {
                    if (p.id === id) {
                        p.status = "off"
                    }
                }

            }

        }
        setData(prev => {
            return {
                ...prev,
                products,
            }
        })
    }


    function handleChanges(identifier, value, id) {
        const products = [...data.products]
        if (identifier === "quantity") {
            products.forEach(p => {
                if (p.id === id) {
                    p.quantity = value
                }
            })
        } else if (identifier === "price") {
            products.forEach(p => {
                if (p.id === id) {
                    p.price = value
                }
            })
        } else if (identifier === "lot") {
            products.forEach(p => {
                if (p.id === id) {
                    p.lot = value
                }
            })
        } else if (identifier === "date") {
            products.forEach(p => {
                if (p.id === id) {
                    p.date = value
                }
            })
        }
        setData(prev => {
            return {
                ...prev,
                products
            }
        })
    }


    async function handleValidate() {
        const storePrincipal = selectStorePrincipal.current.value
        const enterprise = inputEnterprise.current.value
        const agency = inputAgency.current.value
        const purchaseOrder = data.purchaseOrder.slug
        const productData = data.products

        let errors = []

        if (storePrincipal == "Sélectionner un magasin principal") {
            errors.push("Veuillez sélectionner le magasin principal")
        }

        let products = []
        productData.forEach(p => {
            products.push(p.product + ":" + p.quantity + ":" + p.price + ":" + p?.lot + ":" + p?.date + ":" + p.status)
        })


        const productStockDto = {
            storePrincipal,
            enterprise,
            agency,
            purchaseOrder,
            products

        }

        if (errors.length > 0) {
            dispatch(noteActions.show());
            dispatch(noteActions.error(true));
            dispatch(noteActions.relaunch());
            dispatch(noteActions.sendData(errors))
            return { errors }
        }

        const responseData = await createProductStock(productStockDto)
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

        return { errors: null }

    }

    return <>

        <div className="w-full h-1/1 flex overflow-y-auto">
            <div className="w-3/5 p-2 m-1 border-2 border-sky-950 flex flex-col items-center gap-2 shadow-lg shadow-sky-950">
                <div className="flex justify-center gap-2">
                    <Input label="Fournisseur actuel *" type="text" defaultValue={data?.actualSupplier} name="supplier" placeholder="Fournisseur" className="border border-sky-950" ref={inputSupplier} readOnly />
                    <Select label="Fournisseur *" id="supplier" name="supplier" selectedTitle="Sélectionner un fournisseur" data={data?.suppliers} ref={selectSupplier} />
                </div>
                <div className="flex justify-center gap-2">
                    <Input label="Entreprise *" type="text" defaultValue={data?.actualEnterprise} name="enterprise" placeholder="Entreprise" className="border border-sky-950" ref={inputEnterprise} readOnly />
                    <Input label="Agence *" type="text" defaultValue={data?.actualAgency} name="agency" placeholder="Agence" className="border border-sky-950" ref={inputAgency} readOnly />
                </div>
                <div className="flex justify-center gap-2">
                    <Input label="Paiement actuel *" type="text" defaultValue={data?.purchaseOrder.paymentMethod} name="actualPayment" placeholder="Moyen de paiement" className="border border-sky-950" ref={inputPaymentMethod} readOnly />
                    <Select label="Paiement *" id="paymentMethod" name="paymentMethod" selectedTitle="Sélectionner un moyen de paiement" data={paymentMethodPurchase} ref={selectPaymentMethod} onChange={(e) => handleChange("paymentMethod", e.target.value)} />
                </div>
                <div className="flex justify-center gap-2">
                    {data?.payment === "AVANCE_VERSEE" &&
                        <div className="flex gap-2">
                            <Select label="Avance versée *" id="supplierAdvance" name="supplierAdvance" selectedTitle="Sélectionner une avance versée" data={data.supplierAdvanceList} ref={selectSupplierAdvance} />
                            <button className="cursor-pointer" onClick={(e) => handleAddAdvance(e.target.value)}>
                                <FontAwesomeIcon icon={faPlusCircle} className="w-32" />
                            </button>
                        </div>
                    }
                    <Select label="Produit *" id="product" name="product" selectedTitle="Sélectionner un produit" data={data?.productList} ref={selectProduct} onChange={(e) => handleChange("product", e.target.value)} />

                </div>


                <Input label="Quantité *" type="number" name="quantity" defaultValue={data?.quantity} placeholder="Quantité" className="border border-sky-950" ref={inputQuantity} disabled={data?.purchaseOrder.statusPurchase === "ANNULE" ? true : false} />
                <Input label="Prix *" type="number" defaultValue={data?.price} name="price" placeholder="Prix" className="border border-sky-950" ref={inputPrice} disabled={data?.purchaseOrder.statusPurchase === "ANNULE" ? true : false} />

                {data?.purchaseOrder.statusPurchase === "EN_INSTANCE" && <Submit onClick={() => handleAdd("add")} className={`${data?.disabled == true} && "hidden"`} disabled={data?.disabled}>
                    Ajouter
                </Submit>}
                {data?.errors.length > 0 && <ul>
                    {data.errors.map(e => <li key={e} className="text-red-500">{e}</li>)}
                </ul>}
            </div>
            <div className="w-2/5 p-2 m-1 border-2 border-sky-950 shadow-lg shadow-sky-950">
                <table className="w-full">
                    <thead>
                        <tr className="bg-sky-950 text-sky-50">
                            <th className="border px-3">
                                id
                            </th>
                            <th className="border px-3">
                                produit
                            </th>
                            <th className="border px-3">
                                Quantité
                            </th>
                            <th className="border px-3">
                                Prix
                            </th>
                            <th className="border px-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.products.length > 0 && data.products.map(p => <tr key={p.product}>
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
                            <td className="border text-center p-1"><input type="number" name="discount" id="discount" defaultValue={data?.purchaseOrder.discount} placeholder="Rémise" className="bg-sky-50 text-sky-950 text-center w-16" ref={inputDiscount} onChange={(e) => handleChange("discount", e.target.value)} /></td>
                            <td className="border text-center">{data.priceTTC}</td>
                        </tr>
                    </tfoot>}
                </table>
                {data.products.length > 0 && <div className="flex flex-col justify-end mt-4">
                    <div className="flex gap-4">
                        <div className="border px-12 flex justify-center items-center italic font-bold rounded shadow-xl shadow-sky-950">
                            {data?.purchaseOrder.statusPurchase}
                        </div>
                        {data?.purchaseOrder.statusPurchase === "EN_INSTANCE" && <Submit onClick={() => handleOpenAnnulation()} className={`${data?.disabled == true} && "hidden"`} disabled={data?.disabled}>
                            Annuler
                        </Submit>}
                        {data.purchaseOrder.statusPurchase === "EN_INSTANCE" && <Submit onClick={() => handleSave()} className={`${data?.disabled == true} && "hidden"`} disabled={data?.disabled}>
                            Enregistrer
                        </Submit>}
                    </div>
                    <div className="flex gap-4 mt-8 justify-center">
                        {data?.purchaseOrder.statusPurchase === "EN_INSTANCE" && <Submit onClick={() => handleOpenValidation()} className={`${data?.disabled == true} && "hidden"`} disabled={data?.disabled}>
                            Valider
                        </Submit>
                        }
                    </div>

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
        </div >

        <Modal ref={dialog} title="Produit existant" size="h-1/5">
            <p className="mb-4"><FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />Ce produit existe déjà dans le panier.</p>
            <Submit onClick={() => dialog.current.close()}>Fermer</Submit>
        </Modal>

        <Modal ref={dialog1} title="Montant Rémise incorrect" size="h-1/5">
            <p className="mb-4"><FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />Le montant de la remise est incorrect.</p>
            <Submit onClick={() => dialog1.current.close()}>Fermer</Submit>
        </Modal>

        <Modal ref={dialog2} title={`Annulation du bon commande ${data?.purchaseOrder.ref}`} size="h-1/5">
            <form>
                <div className="flex justify-center gap-4 mt-4">
                    <Submit formAction={handleAnnulation}>
                        Oui
                    </Submit>
                    <Submit formAction={handleCloseModal}>
                        Non
                    </Submit>
                </div>
            </form>
        </Modal>

        <Modal ref={dialog3} title={`Validation du bon commande ${data?.purchaseOrder.ref}`} size="h-4/5 w-4/5">
            <div className="flex justify-center gap-2">
                <Input label="Entreprise *" type="text" defaultValue={data?.actualEnterprise} name="enterprise" placeholder="Entreprise" className="border border-sky-950" ref={inputEnterprise} readOnly />
                <Input label="Agence *" type="text" defaultValue={data?.agencyEnterprise} name="agency" placeholder="Agence" className="border border-sky-950" ref={inputAgency} readOnly />
            </div>
            <div className="flex justify-center gap-2">
                <Select label="Magasin principal *" id="storePrincipal" name="storePrincipal" selectedTitle="Sélectionner un magasin principal" data={data?.storePrincipals} ref={selectStorePrincipal} onChange={(e) => handleChange("storePrincipal", e.target.value)} />
                <Input label="Réf. *" type="text" defaultValue={data?.purchaseOrder.ref} name="ref" placeholder="Réf." className="border border-sky-950" ref={inputRef} readOnly />
            </div>
            <table className="w-full mb-4">
                <thead>
                    <tr className="bg-sky-950 text-sky-50">
                        <th className="border">
                            id
                        </th>
                        <th className="border">
                            produit
                        </th>
                        <th className="border">
                            Quantité
                        </th>
                        <th className="border">
                            Prix
                        </th>
                        <th className="border">
                            Lot
                        </th>
                        <th className="border">
                            Date de péremption
                        </th>
                        <th className="border py-1 flex items-center justify-center">
                            Action <input type="checkbox" className="ms-2" onClick={(e) => handleClick("all", e.target.checked)} />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data?.products.length > 0 && data.products.map(p => <tr key={p.product}>
                        <td className="border border-sky-950 text-center p-1">{p.id}</td>
                        <td className="border border-sky-950 text-center p-1">{p.product}</td>
                        <td className="border border-sky-950 text-center p-1"><input type="number" className="w-full text-end" defaultValue={p.quantity} onChange={(e) => handleChanges("quantity", e.value.target, p.id)} /></td>
                        <td className="border border-sky-950 text-center p-1"><input type="number" className="w-full text-end" defaultValue={p.price} onChange={(e) => handleChanges("price", e.target.value, p.id)} /></td>
                        <td className="border border-sky-950 text-center p-1"><input type="text" placeholder="numéro du lot" onChange={(e) => handleChanges("lot", e.target.value, p.id)} /></td>
                        <td className="border border-sky-950 text-center p-1"><input type="date" onChange={(e) => handleChanges("date", e.target.value, p.id)} /></td>
                        <td className="border border-sky-950 text-center p-1"><input type="checkbox" checked={p.status === "on"} onClick={(e) => handleClick("one", e.target.checked, p.id)} /></td>
                    </tr>)}
                </tbody>
                {data.products.length > 0 && <tfoot>
                    <tr className="bg-sky-950 text-sky-50">
                        <td className="border text-center" colSpan={4}>Prix H.T.</td>
                        <td className="border text-center">{data?.priceHT}</td>
                        <td className="border text-center p-1"><input type="number" name="discount" id="discount" defaultValue={data?.purchaseOrder.discount} placeholder="Rémise" className="bg-sky-50 text-sky-950 text-center w-16" ref={inputDiscount} onChange={(e) => handleChange("discount", e.target.value)} /></td>
                        <td className="border text-center">{data.priceTTC}</td>
                    </tr>
                </tfoot>}
            </table>
            <div className="flex justify-end">
                <Submit onClick={handleValidate} className={`${data?.disabled == true} && "hidden"`} disabled={data?.disabled}>
                    Enregistrer
                </Submit>
            </div>
            {dataItem.length > 0 && <Notification key={relaunch} error={errorNotification} messages={dataItem} />}
        </Modal>
        {dataItem.length > 0 && <Notification key={relaunch} error={errorNotification} messages={dataItem} />}


    </>
}