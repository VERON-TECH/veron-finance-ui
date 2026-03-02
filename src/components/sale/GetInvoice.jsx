import { useAnimate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getCustomerById, getInvoiceById, getSaleById } from "../../utils/http";
import Input from "../../layout/Input.jsx"
import Submit from "../../layout/Submit.jsx"
import Modal from "../../layout/Modal.jsx";
import CreatePayment from "../payment/CreatePayment.jsx";


export default function GetInvoice() {
    const dialog = useRef()
    const [scope] = useAnimate();
    const user = JSON.parse(localStorage.getItem("user"))
    const cash = useSelector(state => state.cash)
    const [data, setData] = useState({
        invoice: {},
        customer: {},
        sale: {},
        products: []
    })
    const id = useSelector(state => state.modal.value)
    useEffect(() => {
        async function get(signal) {
            if (user.role.includes("ROLE_ADMIN") && id != "" || user.role.includes("ROLE_COMPTABLE") && id != "" || user.role.includes("CHEF_CAISSIER") && id != "" || user.role.includes("ROLE_CAISSIER") && id != "") {
                const invoice = await getInvoiceById({ signal, id })
                const customer = await getCustomerById({ signal, id: invoice.tiers })
                const sale = await getSaleById({ signal, id: invoice.sale })
                let products = []
                if (invoice.products.length > 0) {
                    for (let p of invoice.products) {
                        let items = p.split(":")
                        products.push({ product: items[2], quantity: items[5], price: items[6] })

                    }
                }

                setData(prev => {
                    return {
                        invoice,
                        customer,
                        sale,
                        products
                    }
                })
            }
        }
        get()

    }, [id])


    function handleClick() {
        dialog.current.open()
    }

    return <><div className="absolute left-1/2 transform -translate-x-1/2 rounded-lg text-sky-50 p-4" ref={scope}>
        <div className="flex justify-between gap-2">
            <Input label="Date *" type="text" defaultValue={data?.invoice.dateTransaction} name="dateTransaction" placeholder="Date de la transaction" className="border border-sky-950" readOnly />
            <Input label="Référence *" type="text" defaultValue={data?.invoice.ref} name="ref" placeholder="Référence" className="border border-sky-950" readOnly />
        </div>
        <div className="flex justify-between gap-2">
            <Input label="Client *" type="text" defaultValue={data?.customer.lastName} name="customer" placeholder="Client" className="border border-sky-950" readOnly />
            <Input label="Motif *" type="text" defaultValue={data?.motif} name="motif" placeholder="Motif" className="border border-sky-950" readOnly />
        </div>

        <div className="flex justify-between gap-2">
            <Input label="Réf. Ventes *" type="text" defaultValue={data?.sale.ref} name="sale" placeholder="Vente" className="border border-sky-950" readOnly />
            <Input label="Montant *" type="number" defaultValue={data?.invoice.amount} name="amount" placeholder="Montant" className="border border-sky-950" readOnly />
        </div>

        <div className="flex justify-between gap-2">
            <Input label="Avance *" type="number" defaultValue={data?.invoice.advance} name="advance" placeholder="Avance" className="border border-sky-950" readOnly />
            <Input label="Solde *" type="number" defaultValue={data?.invoice.balance} name="balance" placeholder="Solde" className="border border-sky-950" readOnly />
        </div>
        <div className="flex justify-between gap-2">
            <Input label="Profit *" type="number" defaultValue={data?.invoice.profit} name="profit" placeholder="Profit" className="border border-sky-950" readOnly />
            <Input label="Statut *" type="text" defaultValue={data?.invoice.statusInvoice} name="statusInvoice" placeholder="Statut" className="border border-sky-950" readOnly />
        </div>

        {data.invoice.statusInvoice === "EN_INSTANCE" && cash !== "" ? <Submit onClick={handleClick}>
            Régler
        </Submit> : <p className="text-center text-red-500">Facture soldée ou caisse non rattachée</p>}
    </div>
        <div className="w-2/3 flex justify-center absolute left-1/2 transform -translate-x-1/2 bottom-20">
            <table className="w-full" >
                <thead>
                    <tr className="bg-sky-950 text-sky-50">
                        <th className="border">
                            Produit
                        </th>
                        <th className="border">
                            Quantité
                        </th>
                        <th className="border">
                            Prix
                        </th>

                    </tr>
                </thead>
                <tbody>
                    {data?.products.length > 0 && data.products.map(p => <tr key={p.product}>
                        <td className="border border-sky-950 text-center">{p.product}</td>
                        <td className="border border-sky-950 text-center">{p.quantity}</td>
                        <td className="border border-sky-950 text-center ">{p.price}</td>

                    </tr>)}
                </tbody>

            </table>
        </div>

        <Modal ref={dialog} size="lg:h-10/14 lg:w-4/15" title="Créer un règlement">
            <CreatePayment />
        </Modal>


    </>

}