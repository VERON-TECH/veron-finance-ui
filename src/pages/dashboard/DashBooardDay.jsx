import { useDispatch, useSelector } from "react-redux"
import { identifierMenuActions } from "../../store/identifierSlice"
import { useEffect, useState } from "react"
import { getAllBankAccount, getAllCashes, getAllEngagements, getAllInvoices, getAllMobileMoney, getAllMvtCash, getAllProfits, getAllPurchaseOrders, getAllSales } from "../../utils/http"
import CardDashboard from "../../components/dashboard/cardDashboard"





export default function DashBoardDayPage() {
    const dispatch = useDispatch()
    const [data, setData] = useState({
        sales: { nb: 0, amount: 0 },
        profits: { amount: 0 },
        spend: { amount: 0 },
        bank: { balance: 0 },
        mobile: { balance: 0 },
        cash: { balance: 0 },
        invoice: { balance: 0 },
        invoice_: { balance: 0 },
        borrow: { balance: 0 },
        loan: { balance: 0 },
        purchase: { balance: 0 }
    })
    const user = JSON.parse(localStorage.getItem("user"))
    const menu = useSelector(state => state.identifier.menu)
    useEffect(() => {
        dispatch(identifierMenuActions.updateMenu({ menu: "reporting" }))
        async function get(signal) {
            const sales = await getAllSales({ signal, enterprise: user.enterprise, agency: user.agency, startDate: new Date().toLocaleDateString(), endDate: new Date().toLocaleDateString() })
            const profits = await getAllProfits({ signal, enterprise: user.enterprise, agency: user.agency })
            const mvtCash = await getAllMvtCash({ signal, enterprise: user.enterprise, agency: user.agency, cash: 0, startDate: new Date().toLocaleDateString(), endDate: new Date().toLocaleDateString() })
            const bankAccounts = await getAllBankAccount({ signal, agency: user.agency })
            const mobileMoney = await getAllMobileMoney({ signal, agency: user.agency })
            const cashes = await getAllCashes({ signal, enterprise: user.enterprise, agency: user.agency })
            const invoices = await getAllInvoices({ signal, enterprise: user.enterprise, agency: user.agency, invoiceType: "EMISE" })
            const invoices_ = await getAllInvoices({ signal, enterprise: user.enterprise, agency: user.agency, invoiceType: "RECUE" })
            const engagements = await getAllEngagements({ signal, enterprise: user.enterprise, agency: user.agency })
            const purchases = await getAllPurchaseOrders({ signal, enterprise: user.enterprise, agency: user.agency })
            let amountSale = 0
            for (let s of sales) {
                amountSale += Number(s.priceTtc)
            }
            let amountProfit = 0
            for (let p of profits) {
                for (let s of sales) {
                    if (p.sale === s.id) {
                        amountProfit += Number(p.amount)
                    }
                }
            }

            let amountSpend = 0

            for (let m of mvtCash) {
                if (m.type === "DEPENSES") {
                    amountSpend += Number(m.amount)
                }
            }

            let balanceBank = 0
            for (let b of bankAccounts) {
                balanceBank += Number(b.balance)
            }

            let balanceMobile = 0
            for (let m of mobileMoney) {
                balanceMobile += Number(m.balance)
            }

            let balanceCash = 0
            for (let c of cashes) {
                balanceCash += Number(c.balance)
            }

            let balanceInvoice = 0
            for (let i of invoices) {
                balanceInvoice += Number(i.balance)
            }

            let balanceInvoice_ = 0
            for (let i of invoices_) {
                balanceInvoice_ += Number(i.balance)
            }

            let balanceBorrow = 0
            let balanceLoan = 0
            for (let e of engagements) {
                if (e.typeEngagement === "EMPRUNT") {
                    balanceBorrow += Number(e.balance)
                }
                if (e.typeEngagement === "PRET") {
                    balanceLoan += Number(e.balance)
                }

            }


            let balancePurchase = 0
            for (let p of purchases) {
                balancePurchase += Number(p.balance)
            }


            setData(prev => {
                return {
                    ...prev,
                    sales: {
                        nb: sales.length,
                        amount: amountSale,
                    },
                    profits: {
                        amount: amountProfit,
                    },
                    spend: {
                        amount: amountSpend
                    },
                    bank: {
                        balance: balanceBank
                    },
                    mobile: {
                        balance: balanceMobile
                    },
                    cash: {
                        balance: balanceCash
                    },
                    invoice: {
                        balance: balanceInvoice
                    },
                    invoice_: {
                        balance: balanceInvoice_
                    },
                    borrow: {
                        balance: balanceBorrow
                    },
                    loan: {
                        balance: balanceLoan
                    },
                    purchase: {
                        balance: balancePurchase
                    }
                }
            })
        }
        get()

    }, [menu, dispatch])

    return <>

        <div className="flex gap-2 flex-wrap">
            <CardDashboard title="Ventes" balance={data?.sales?.nb} account="Nombre" />
            <CardDashboard title="Montant" balance={data?.sales?.amount} account="Recettes" />
            <CardDashboard title="Montant" balance={data?.profits?.amount} account="Profits générés" />
            <CardDashboard title="Dépenses" balance={data?.spend?.amount} account="Dépenses" />
            <CardDashboard title="Comptes bancaires" balance={data?.bank?.balance} account="Soldes" />
            <CardDashboard title="Comptes mobiles" balance={data?.mobile?.balance} account="Soldes" />
            <CardDashboard title="Caisses" balance={data?.cash?.balance} account="Soldes" />
            <CardDashboard title="Factures clients" balance={data?.invoice?.balance} account="Soldes" />
            <CardDashboard title="Factures fournisseurs" balance={data?.invoice_?.balance} account="Soldes" />
            <CardDashboard title="Emprunts" balance={data?.borrow?.balance} account="Soldes" />
            <CardDashboard title="Prêts" balance={data?.loan?.balance} account="Soldes" />
            <CardDashboard title="Commandes" balance={data?.purchase?.balance} account="Soldes" />
        </div>


    </>
}