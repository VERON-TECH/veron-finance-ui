import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { getAllMobileMoney, getEnterpriseById, getOperatorById } from "../../utils/http";
import Notification from "../../layout/Notification.jsx"
import { useEffect, useRef, useState } from "react";
import Submit from "../../layout/Submit.jsx"
import Table from "../../layout/Table.jsx"
import Modal from "../../layout/Modal.jsx";
import { identifierMenuActions } from "../../store/identifierSlice.js"
import { mobileMonies } from "../../data/dataTable.js";
import CreateMobileMoney from "../../components/mobile_money/CreateMobileMoney.jsx";
import Operator from "../../components/mobile_money/Operator.jsx";
import Logo from "../../layout/LogoDark.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";




export default function MobileMoneyPage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const errorNotification = useSelector(state => state.note.error);
    const relaunch = useSelector(state => state.note.relaunch);
    const dataItem = useSelector(state => state.note.dataItem)
    const dispatch = useDispatch()
    const menu = useSelector(state => state.identifier.menu)
    const [data, setData] = useState({
        mobileMoney: [],
        isLoading: false
    })



    const dialog = useRef()
    const dialog1 = useRef()

    function handleModal(identifier) {
        if (identifier === "account") {
            dialog.current.open();
        }

        if (identifier === "operator") {
            dialog1.current.open();
        }


    }

    useEffect(() => {
        dispatch(identifierMenuActions.updateMenu({ menu: "financial" }))
        setData(prev => {
            return {
                ...prev,
                isLoading: true
            }
        })
        if (user.role.includes("ROLE_ADMIN") || user.role.includes("ROLE_COMPTABLE")) {
            async function get(signal) {
                const allMobileMonies = await getAllMobileMoney({ signal, agency: user?.agency })
                let tb = []
                let enterprise = {}
                let operator = {}
                for (let m of allMobileMonies) {
                    enterprise = await getEnterpriseById({ id: m.enterprise, signal })
                    operator = await getOperatorById({ id: m.operator, signal })
                    m.enterprise = enterprise.slug
                    m.operator = operator.slug
                    tb.push(m)
                }
                setData(prev => {
                    return {
                        ...prev,
                        mobileMoney: tb,
                        isLoading: false
                    }
                })

            }
            get()
        }
    }, [menu, dispatch])

    return <>
        <div className="flex justify-center gap-2 mb-2">
            {user.role.includes("ROLE_ADMIN") ? <Submit onClick={() => handleModal("operator")}>Opérateurs</Submit> : undefined}
            {user.role.includes("ROLE_ADMIN") ? <Submit onClick={() => handleModal("account")}>Nouveau</Submit> : undefined}
        </div>
        <Table data={data?.mobileMoney} headers={mobileMonies.header} emptyMessage="Aucun compte mobile money trouvé." globalFilterFields={mobileMonies.global} sheet="Compte mobile money" titleRef="Mise à jour informations d'un compte mobile money" size="lg:h-7/13 lg:w-4/15 xl:h-8/13" />
        {data?.isLoading && <div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}
        <Modal ref={dialog} size="lg:h-6/12 lg:w-4/15" title="Créer une compte mobile money">
            <CreateMobileMoney />
        </Modal>
        <Modal ref={dialog1} size="lg:h-6/11 lg:w-12/15 overflow-auto" title="Opérateurs">
            <Operator />
        </Modal>

        {dataItem.length > 0 && <Notification key={relaunch} error={errorNotification} messages={dataItem} />}
    </>
}