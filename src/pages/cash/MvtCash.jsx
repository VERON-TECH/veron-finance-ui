import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { getAgencyById, getAllMvtCash, getArchiveBalance, getCashBySlug, getEnterpriseById, getPersonalById } from "../../utils/http";
import Notification from "../../layout/Notification.jsx"
import { useEffect, useRef } from "react";
import Submit from "../../layout/Submit.jsx"
import Table from "../../layout/Table.jsx"
import Modal from "../../layout/Modal.jsx";
import { identifierMenuActions } from "../../store/identifierSlice.js"
import { mvtCashes } from "../../data/dataTable.js";
import CreateMvtCash from "../../components/mvtCash/CreateMvtCash.jsx";
import Select from "../../layout/Select.jsx";
import { printActions } from "../../store/print.js";
import { useNavigate } from "react-router-dom";
import Input from "../../layout/Input.jsx";




export default function MvtCashPage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const errorNotification = useSelector(state => state.note.error);
    const relaunch = useSelector(state => state.note.relaunch);
    const dataItem = useSelector(state => state.note.dataItem)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const menu = useSelector(state => state.identifier.menu)
    const cash = user?.cashes[0] || 0



    useEffect(() => {
        dispatch(identifierMenuActions.updateMenu({ menu: "cash" }))
    }, [menu, dispatch])

    const { data } = useQuery({
        queryKey: ["mvtCashes", { enterprise: user.enterprise, agency: user.agency, cash: cash.key, startDate: new Date().toLocaleDateString(), endDate: new Date().toLocaleDateString() }],
        queryFn: ({ signal }) => getAllMvtCash({ signal, enterprise: user.enterprise, agency: user.agency, cash: cash.key, startDate: new Date().toLocaleDateString(), endDate: new Date().toLocaleDateString() }),
        enabled: user.role.includes("ROLE_CAISSIER") || user.role.includes("ROLE_CHEF_CAISSIER") || user.role.includes("ROLE_COMPTABLE")
    })


    const dialog = useRef()
    const dialog1 = useRef()
    const selectedCash = useRef();
    const inputStartDate = useRef();
    const inputEndDate = useRef();

    function handleModal(identifier) {
        if (identifier === "new") {
            dialog.current.open();
        } else if (identifier === "report") {
            dialog1.current.open();
        }
    }



    async function handleVisualize() {
        const controller = new AbortController();
        const signal = controller.signal;
        const enterprise_ = await getEnterpriseById({ id: user.enterprise, signal })
        const enterprise = enterprise_.name
        const agency_ = await getAgencyById({ id: user.agency, signal })
        const agency = agency_.name
        const selectCash = selectedCash?.current?.value;
        const cash = await getCashBySlug({ slug: selectCash, signal })
        const startDate = inputStartDate.current.value;
        const endDate = inputEndDate.current.value;
        const mvtCashData = await getAllMvtCash({ enterprise: user.enterprise, agency: user.agency, cash: cash.id, startDate, endDate })
        const archiveBalance = await getArchiveBalance({ slug: selectCash, startDate, endDate: startDate })
        const initial = archiveBalance.length > 0 ? archiveBalance[0].balance : 0
        const personal_ = await getPersonalById({ id: user.personal, signal })
        const personal = personal_.lastName + " " + personal_.firstName
        const date = new Date().toLocaleDateString()
        const period = { startDate, endDate }
        const data = []
        let incoming = 0
        let outgoing = 0

        for (let m of mvtCashData) {
            if (m.sens === "ENCAISSEMENT") {
                incoming += m.amount
            } else {
                outgoing += m.amount
            }
            const exists = data.some(d => d.type === m.type);
            if (!exists) {
                data.push({
                    ref: m.ref,
                    type: m.type,
                    sens: m.sens,
                    amount: m.amount
                });
            }
        }


        const printCash = {
            enterprise,
            agency,
            period,
            data,
            date,
            personal,
            initial,
            cash,
            incoming,
            outgoing,
            balance: initial + incoming - outgoing
        }
        dispatch(printActions.getPrint(printCash))
        navigate("/print-cash")
    }



    return <>
        <div className="flex justify-center mb-2">
            {user.role.includes("ROLE_CAISSIER") || user.role.includes("ROLE_CHEF_CAISSIER") ? <Submit onClick={() => handleModal("new")}>Nouveau</Submit> : undefined}
            {user.role.includes("ROLE_CAISSIER") || user.role.includes("ROLE_CHEF_CAISSIER") ? <Submit onClick={() => handleModal("report")}>Rapport</Submit> : undefined}
        </div>
        <Table data={data} headers={mvtCashes.header} emptyMessage="Aucune opération trouvée." globalFilterFields={mvtCashes.global} sheet="mvt_caisse" titleRef="Visualiser un mouvement de caisse" size="lg:h-5/11 lg:w-4/15" />
        <Modal ref={dialog} size="lg:h-7/15 lg:w-8/16" title="Créer une opération">
            <CreateMvtCash />
        </Modal>
        <Modal ref={dialog1} size="lg:h-6/15 lg:w-4/16" title="Compte rendu de caisse">
            <div className="flex flex-col items-center mb-4">
                <Select label="Caisse *" id="cash" name="cash" selectedTitle="Sélectionner une caisse" data={user?.cashes} ref={selectedCash} />

                <Input label="Date de début" id="startDate" type="date" name="startDate" className="border border-sky-950" ref={inputStartDate} />
                <Input label="Date de fin" id="endDate" type="date" name="endDate" className="border border-sky-950" ref={inputEndDate} />
            </div>
            <Submit onClick={handleVisualize}>Visualiser</Submit>
        </Modal>
        {dataItem.length > 0 && <Notification key={relaunch} error={errorNotification} messages={dataItem} />}
    </>
}