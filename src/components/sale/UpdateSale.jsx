
import { useAnimate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { convert, getAgencyById, getAllPrints, getCashById, getCustomerById, getEnterpriseById, getSaleById } from "../../utils/http";
import Input from "../../layout/Input.jsx"
import Submit from "../../layout/Submit.jsx"
import { printActions } from "../../store/print.js";
import Modal from "../../layout/Modal.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { identifierMenuActions } from "../../store/identifierSlice.js";
import { useNavigate } from "react-router-dom";


export default function UpdateSale() {
    const user = JSON.parse(localStorage.getItem("user"))
    const inputEnterprise = useRef();
    const inputAgency = useRef();
    const inputRef = useRef();
    const inputDate = useRef();
    const inputTime = useRef();
    const inputPrice = useRef();
    const inputDiscount = useRef();
    const inputPriceTTC = useRef();
    const inputPayment = useRef();
    const inputRest = useRef();
    const inputCash = useRef();
    const inputCustomer = useRef();
    const dialog = useRef()



    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [data, setData] = useState({
        enterprise: "",
        agency: "",
        sale: {},
        customer: "",
        prints: [],
        typePrint: "sale"
    })
    const id = useSelector(state => state.modal.value);


    useEffect(() => {
        if (id != 0 && user.role.includes("ROLE_CAISSIER")) {
            let tb = []
            async function get(signal) {
                const sale = await getSaleById({ signal, id })
                const enterprise = await getEnterpriseById({ id: sale.enterprise, signal })
                const agency = await getAgencyById({ id: sale.agency, signal })
                const customer = await getCustomerById({ signal, id: sale.customer })
                const allPrints = await getAllPrints({ signal, enterprise: user.enterprise, agency: user.agency })

                allPrints.forEach(p => {
                    if (p.status === "ACTIVE") {
                        tb.push({ key: p.id, name: p.type, value: p.type })
                    }

                })

                setData(prev => {
                    return {
                        ...prev,
                        sale,
                        enterprise: enterprise.slug,
                        agency: agency.slug,
                        customer: customer.lastName + " " + customer.firstName,
                        prints: tb
                    }
                })
            }
            get()
        }

    }, [id])






    async function handleClick(identifier, signal) {
        if (identifier === "duplicata") {
            const enterprise = await getEnterpriseById({ id: data.sale.enterprise, signal })
            const agency = await getAgencyById({ id: data.sale.agency, signal })
            const amountLetter = await convert(data?.sale.payment)
            const cash = await getCashById({ id: data.sale.cash, signal })
            const products = []
            let id = 1
            for (let p of data.sale.products) {
                const items = p.split(":")
                products.push({ id, category: items[0], service: items[1], product: items[2], store: items[3], lot: items[4], quantity: Number(items[5]), price: Number(items[6]), discount: Number(items[7]) })
                id++
            }

            const printSale = {
                enterprise,
                agency,
                ref: data?.sale.ref,
                date: data?.sale.dateTransaction,
                time: data?.sale.time,
                customer: data?.customer,
                products: products,
                priceHT: data?.sale.priceHt,
                remise: data?.sale.discount,
                priceTTC: data?.sale.priceTtc,
                payment: data?.sale.payment,
                rest: data?.sale.rest,
                amountLetter,
                cash: cash.slug
            }
            dispatch(printActions.getPrint(printSale))
            dialog.current.open()
        }
    }


    function handleSelectionPrint(value) {
        dispatch(identifierMenuActions.updatePrint({ print: value }))
        if (data?.typePrint === "sale") {
            navigate("/print-sale")
        } else if (data?.typePrint === "salePayement") {
            navigate("/print-sale-payment")
        }

    }



    return <>

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg text-sky-50 p-4" >

            <div className="flex justify-between gap-2">
                <Input label="Entreprise *" id="enterprise" type="text" defaultValue={data?.enterprise} name="enterprise" placeholder="Entreprise" className="border border-sky-950" ref={inputEnterprise} readOnly />
                <Input label="Agence *" id="agency" type="text" defaultValue={data?.agency} name="agency" placeholder="Agence" className="border border-sky-950" ref={inputAgency} readOnly />
            </div>

            <div className="flex justify-between gap-2">
                <Input label="Réf *" id="ref" type="text" defaultValue={data?.sale.ref} name="ref" placeholder="Référence" className="border border-sky-950" ref={inputRef} readOnly />
                <Input label="Client *" id="customer" type="text" defaultValue={data?.customer} name="customer" placeholder="Customer" className="border border-sky-950" ref={inputCustomer} readOnly />
            </div>

            <div className="flex justify-between gap-2">
                <Input label="Date *" id="dateTransaction" type="date" defaultValue={data?.sale.dateTransaction} name="dateTransaction" placeholder="Date " className="border border-sky-950" ref={inputDate} readOnly />
                <Input label="Heure *" id="time" type="time" defaultValue={data?.sale.time} name="time" placeholder="time " className="border border-sky-950" ref={inputTime} readOnly />
            </div>

            <div className="flex justify-between gap-2">
                <Input label="Prix HT *" id="priceHT" type="number" defaultValue={data?.sale.priceHt} name="priceHT" placeholder="Prix HT " className="border border-sky-950" ref={inputPrice} readOnly />
                <Input label="Remise *" id="discount" type="number" defaultValue={data?.sale.discount} name="discount" placeholder="Rémise " className="border border-sky-950" ref={inputDiscount} readOnly />
            </div>
            <div className="flex justify-between gap-2">
                <Input label="Prix TTC *" id="priceTTC" type="number" defaultValue={data?.sale.priceTtc} name="priceTTC" placeholder="Prix TTC" className="border border-sky-950" ref={inputPriceTTC} readOnly />
                <Input label="Acompte *" id="payment" type="number" defaultValue={data?.sale.payment} name="payment" placeholder="Acompte " className="border border-sky-950" ref={inputPayment} readOnly />
            </div>
            <div className="flex justify-between gap-2">
                <Input label="Reste *" id="rest" type="number" defaultValue={data?.sale.rest} name="rest" placeholder="Reste" className="border border-sky-950" ref={inputRest} readOnly />
                <Input label="Caisse *" id="cash" type="text" defaultValue={data?.sale.cash} name="cash" placeholder="Caisse " className="border border-sky-950" ref={inputCash} readOnly />
            </div>
        </div>

        {user.role.includes("ROLE_CAISSIER") && <div className="absolute bottom-10 right-10 flex flex-col gap-2">
            <Submit onClick={() => handleClick("duplicata")}>
                Duplicata
            </Submit>
        </div>}

        <Modal ref={dialog} title="Sélection du format d'impression" size="h-2/5 ">
            {data.prints.length > 0 ? <div className="flex flex-col items-center justify-center gap-4 mb-4">
                {data.prints.map(p => <button key={p.id} className="text-sky-50 bg-sky-950 font-bold p-2 border rounded w-full cursor-pointer shadow-sky-950 shadow-md hover:bg-sky-50 hover:text-sky-950" onClick={(e) => handleSelectionPrint(e.target.textContent)}>
                    <FontAwesomeIcon icon={faPrint} className="me-2"></FontAwesomeIcon>
                    {p.name}
                </button>)}
            </div> : <button className="text-sky-50 bg-sky-950 font-bold p-2 border rounded w-full cursor-pointer shadow-sky-950 shadow-md hover:bg-sky-50 hover:text-sky-950 mb-4" onClick={(e) => handleSelectionPrint(e.target.textContent)}>
                IMPRIMANTE_LASER
            </button>}
            <Submit onClick={() => dialog.current.close()}>Fermer</Submit>
        </Modal>

    </>
}