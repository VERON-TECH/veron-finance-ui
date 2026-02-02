import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { getAllMobileMoney } from "../../utils/http";
import Notification from "../../layout/Notification.jsx"
import { useEffect, useRef } from "react";
import Submit from "../../layout/Submit.jsx"
import Table from "../../layout/Table.jsx"
import Modal from "../../layout/Modal.jsx";
import { identifierMenuActions } from "../../store/identifierSlice.js"
import { mobileMonies } from "../../data/dataTable.js";
import CreateMobileMoney from "../../components/mobile_money/CreateMobileMoney.jsx";
import Operator from "../../components/mobile_money/Operator.jsx";




export default function ServicePage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const errorNotification = useSelector(state => state.note.error);
    const relaunch = useSelector(state => state.note.relaunch);
    const dataItem = useSelector(state => state.note.dataItem)
    const dispatch = useDispatch()
    const menu = useSelector(state => state.identifier.menu)


    const { data } = useQuery({
        queryKey: ["mobilemoney"],
        queryFn: getAllMobileMoney,
        enabled: user.role.includes("ROLE_ADMIN") || user.role.includes("ROLE_COMPTABLE")
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
    }, [menu, dispatch])

    return <>
        <div className="flex justify-center gap-2 mb-2">
            {user.role.includes("ROLE_ADMIN") ? <Submit onClick={() => handleModal("operator")}>Opérateurs</Submit> : undefined}
            {user.role.includes("ROLE_ADMIN") ? <Submit onClick={() => handleModal("account")}>Nouveau</Submit> : undefined}
        </div>
        <Table data={data} headers={mobileMonies.header} emptyMessage="Aucun compte mobile money trouvé." globalFilterFields={mobileMonies.global} sheet="Compte mobile money" titleRef="Mise à jour informations d'un compte mobile money" size="lg:h-7/13 lg:w-4/15" />
        <Modal ref={dialog} size="lg:h-6/12 lg:w-4/15" title="Créer une compte mobile money">
            <CreateMobileMoney />
        </Modal>
        <Modal ref={dialog1} size="lg:h-6/11 lg:w-12/15 overflow-auto" title="Opérateurs">
            <Operator />
        </Modal>

        {dataItem.length > 0 && <Notification key={relaunch} error={errorNotification} messages={dataItem} />}
    </>
}