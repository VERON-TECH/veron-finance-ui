import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { getAgencyById, getAllMvtCash, getArchiveBalance, getCashBySlug, getEnterpriseById, getPersonalById } from "../../utils/http";
import Notification from "../../layout/Notification.jsx"
import { useEffect, useRef, useState } from "react";
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
import Logo from "../../layout/LogoDark.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins, faSpinner } from "@fortawesome/free-solid-svg-icons";




export default function MvtCashPage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const errorNotification = useSelector(state => state.note.error);
    const relaunch = useSelector(state => state.note.relaunch);
    const dataItem = useSelector(state => state.note.dataItem)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const menu = useSelector(state => state.identifier.menu)
    const [data, setData] = useState({
        mvtCash: [],
        cashes: [],
        isLoading: false
    })



    useEffect(() => {
        dispatch(identifierMenuActions.updateMenu({ menu: "cash" }))
        setData(prev => {
            return {
                ...prev,
                isLoading: true
            }
        })
        if (user.role.includes("ROLE_CAISSIER") || user.role.includes("ROLE_CHEF_CAISSIER") || user.role.includes("ROLE_COMPTABLE")) {
            async function get(signal) {
                let cashes = []
                for (let cash of user.cashes) {
                    const allMvtCash = await getAllMvtCash({ signal, enterprise: user.enterprise, agency: user.agency, cash: cash.key, startDate: new Date().toLocaleDateString(), endDate: new Date().toLocaleDateString() })
                    const cash_ = await getCashBySlug({ slug: cash.value, signal })
                    cashes.push({ key: cash_.id, name: cash_.name, value: cash_.slug, balance: cash_.balance })
                    let tb = []
                    let enterprise = {}
                    let agency = {}
                    for (let m of allMvtCash) {
                        enterprise = await getEnterpriseById({ id: m.enterprise, signal })
                        agency = await getAgencyById({ id: m.agency, signal })
                        m.enterprise = enterprise.slug
                        m.agency = agency.slug
                        tb.push(m)
                    }
                    setData(prev => {
                        return {
                            ...prev,
                            mvtCash: tb,
                            isLoading: false,

                        }
                    })
                }
                setData(prev => {
                    return {
                        ...prev,
                        cashes
                    }
                })
            }
            get()
        }
    }, [menu, dispatch])



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
        {user.cashes.length > 0 ? <>
            <div className="flex gap-2 w-full shadow-xl shadow-sky-50 p-2">
                <div className="w-2/3 h-26 bg-sky-950 rounded flex flex-wrap p-2 gap-2 rounded">
                    {data?.cashes.map(c => <div className="flex flex-col bg-sky-50 text-sky-950 font-medium rounded p-2 w-35 gap-2" key={c.key}>
                        <span className="bg-sky-950 text-sky-50 font-medium border border rounded px-1 shadow-sky-950 shadow-md text-center"><FontAwesomeIcon icon={faCoins} className="me-1" />{c.value.toUpperCase()}</span>
                        <div className="flex flex-col bg-sky-950 rounded p-1 gap-1 shadow-sky-950 shadow-md">
                            <span className="bg-sky-950 text-sky-50">Solde disponible:</span>
                            <span className="bg-sky-950 text-sky-50 text-end">{Number(c.balance).toLocaleString()} FCFA</span>
                        </div>
                    </div>)}
                </div>

                <div className="flex justify-center mb-2">
                    {user.role.includes("ROLE_CAISSIER") || user.role.includes("ROLE_CHEF_CAISSIER") ? <Submit onClick={() => handleModal("new")}>Nouveau</Submit> : undefined}
                    {user.role.includes("ROLE_CAISSIER") || user.role.includes("ROLE_CHEF_CAISSIER") ? <Submit onClick={() => handleModal("report")}>Rapport</Submit> : undefined}
                </div>
            </div>

        </> : <p className="text-red-500 text-center font-medium">Aucune caisse rattachée</p>}
        <Table data={data?.mvtCash} headers={mvtCashes.header} emptyMessage="Aucune opération trouvée." globalFilterFields={mvtCashes.global} sheet="mvt_caisse" titleRef="Visualiser un mouvement de caisse" size="lg:h-5/11 lg:w-4/15" />
        {data?.isLoading && <div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}
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