import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { getAllBankAccount, getBankById, getEnterpriseById } from "../../utils/http";
import Notification from "../../layout/Notification.jsx"
import { memo, useEffect, useRef, useState } from "react";
import Submit from "../../layout/Submit.jsx"
import Table from "../../layout/Table.jsx"
import Modal from "../../layout/Modal.jsx";
import { identifierMenuActions } from "../../store/identifierSlice.js"
import { bankAccounts } from "../../data/dataTable.js";
import CreateBankAccount from "../../components/bankAccount/CreateBankAccount.jsx";
import Bank from "../../components/bankAccount/Bank.jsx";




export default memo(function BankAccountPage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const errorNotification = useSelector(state => state.note.error);
    const relaunch = useSelector(state => state.note.relaunch);
    const dataItem = useSelector(state => state.note.dataItem)
    const dispatch = useDispatch()
    const menu = useSelector(state => state.identifier.menu)
    const [data, setData] = useState({
        bankAccount: []
    })


    const dialog = useRef()
    const dialog1 = useRef()

    function handleModal(identifier) {
        if (identifier === "bank") {
            dialog.current.open();
        } else if (identifier === "account") {
            dialog1.current.open();
        }

    }

    useEffect(() => {
        dispatch(identifierMenuActions.updateMenu({ menu: "financial" }))
        if (user.role.includes("ROLE_ADMIN") || user.role.includes("ROLE_COMPTABLE")) {
            async function get(signal) {
                const allBankAccounts = await getAllBankAccount({ signal, agency: user?.agency })
                let tb = []
                let enterprise = {}
                let bank = {}
                for (let b of allBankAccounts) {
                    enterprise = await getEnterpriseById({ id: b.enterprise, signal })
                    bank = await getBankById({ id: b.bank, signal })
                    b.enterprise = enterprise.slug
                    b.bank = bank.slug
                    tb.push(b)
                }
                setData(prev => {
                    return {
                        ...prev,
                        bankAccount: tb
                    }
                })

            }
            get()
        }
    }, [menu, dispatch])

    return <>
        <div className="flex justify-center gap-2 mb-2">
            {user.role.includes("ROLE_ADMIN") ? <Submit onClick={() => handleModal("bank")}>Banques</Submit> : undefined}
            {user.role.includes("ROLE_ADMIN") ? <Submit onClick={() => handleModal("account")}>Nouveau</Submit> : undefined}
        </div>
        <Table data={data.bankAccount} headers={bankAccounts.header} emptyMessage="Aucun compte bancaire trouvé." globalFilterFields={bankAccounts.global} sheet="Compte bancaire" titleRef="Mise à jour informations d'un compte bancaire" size="lg:h-5/11 lg:w-4/15" />
        <Modal ref={dialog} size="lg:h-6/11 lg:w-12/15 overflow-auto" title="Informations sur les banques">
            <Bank />
        </Modal>
        <Modal ref={dialog1} size="lg:h-6/14 lg:w-4/15" title="Créer un compte bancaire">
            <CreateBankAccount />
        </Modal>
        {dataItem.length > 0 && <Notification key={relaunch} error={errorNotification} messages={dataItem} />}
    </>
})