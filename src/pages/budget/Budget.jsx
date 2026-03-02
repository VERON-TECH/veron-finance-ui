import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { getAgencyById, getAllBudgets, getEnterpriseById, getSpentById } from "../../utils/http";
import Notification from "../../layout/Notification.jsx"
import { useEffect, useRef, useState } from "react";
import Submit from "../../layout/Submit.jsx"
import Table from "../../layout/Table.jsx"
import Modal from "../../layout/Modal.jsx";
import { identifierMenuActions } from "../../store/identifierSlice.js"
import { budgets } from "../../data/dataTable.js";
import CreateBudget from "../../components/budget/CreateBudget.jsx";
import ConfirmationDelete from "../../components/global/ConfirmationDelete.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Logo from "../../layout/LogoDark.jsx";




export default function BudgetPage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const errorNotification = useSelector(state => state.note.error);
    const relaunch = useSelector(state => state.note.relaunch);
    const dataItem = useSelector(state => state.note.dataItem)
    const dispatch = useDispatch()
    const menu = useSelector(state => state.identifier.menu)
    const [data, setData] = useState({
        budget: [],
        isLoading: false
    })

    const dialog = useRef()
    const dialog1 = useRef()
    const dialog2 = useRef()

    async function handleModal(identifier) {
        if (identifier === "new") {
            dialog.current.open();
        } else if (identifier === "validate") {
            dialog1.current.open();
        } else if (identifier === "clean") {
            dialog2.current.open();
        }

    }

    useEffect(() => {
        dispatch(identifierMenuActions.updateMenu({ menu: "budget" }))
        setData(prev => {
            return {
                ...prev,
                isLoading: true
            }
        })
        if (user.role.includes("ROLE_ADMIN") || user.role.includes("ROLE_COMPTABLE")) {
            async function get(signal) {
                const allBudgets = await getAllBudgets({ signal, enterprise: user?.enterprise, agency: user?.agency })
                let tb = []
                let enterprise = {}
                let agency = {}
                let spent = {}
                for (let b of allBudgets) {
                    enterprise = await getEnterpriseById({ id: b.enterprise, signal })
                    agency = await getAgencyById({ id: b.agency, signal })
                    spent = await getSpentById({ id: b.spent, signal })
                    b.enterprise = enterprise.slug
                    b.agency = agency.slug
                    b.spent = spent.slug
                    tb.push(b)
                }
                setData(prev => {
                    return {
                        ...prev,
                        budget: tb,
                        isLoading: false
                    }
                })

            }
            get()
        }
    }, [menu, dispatch])

    return <>
        <div className="flex justify-center mb-2">
            {user.role.includes("ROLE_ADMIN") && data?.budget.length > 0 ? <Submit onClick={() => handleModal("validate")}>Valider tout</Submit> : undefined}
            {user.role.includes("ROLE_ADMIN") && data?.budget.length > 0 ? <Submit onClick={() => handleModal("clean")}>Nettoyer tout</Submit> : undefined}
            {user.role.includes("ROLE_COMPTABLE") ? <Submit onClick={() => handleModal("new")}>Nouveau</Submit> : undefined}
        </div>
        <Table data={data?.budget} headers={budgets.header} emptyMessage="Aucun budget trouvée." globalFilterFields={budgets.global} sheet="Budget" titleRef="Mise à jour informations de la prévision" size="lg:h-6/11 lg:w-4/15 xl:h-7/11" />

        {data?.isLoading && <div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}

        <Modal ref={dialog} size="lg:h-5/11 lg:w-4/15 xl:h-6/12" title="Créer une budget">
            <CreateBudget />
        </Modal>

        <Modal ref={dialog1} size="lg:h-4/18 lg:w-4/16 xl:w-4/16 xl:h-4/18" title="Validation de toutes les prévisions">
            <ConfirmationDelete authorize="validationAllBudget" />
        </Modal>

        <Modal ref={dialog2} size="lg:h-3/15 lg:w-5/16" title="Nettoyer de toutes les prévisions inactives">
            <ConfirmationDelete authorize="cleanAllBudget" />
        </Modal>
        {dataItem.length > 0 && <Notification key={relaunch} error={errorNotification} messages={dataItem} />}
    </>
}