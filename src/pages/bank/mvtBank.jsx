import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { identifierMenuActions } from "../../store/identifierSlice"
import Table from "../../layout/Table"
import Modal from "../../layout/Modal"
import { getAgencyById, getAllMvtBank, getAllMvtCash, getEnterpriseById } from "../../utils/http"
import { mvtBanks } from "../../data/dataTable"
import Logo from "../../layout/LogoDark"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"
import Submit from "../../layout/Submit"
import CreateMvtBank from "../../components/mvtBank/CreateMvtBank"
import Notification from "../../layout/Notification"


export default function MvtBankPage() {
    const dispatch = useDispatch()
    const dialog = useRef()
    const errorNotification = useSelector(state => state.note.error);
    const relaunch = useSelector(state => state.note.relaunch);
    const dataItem = useSelector(state => state.note.dataItem)
    const user = JSON.parse(localStorage.getItem("user"))
    const [data, setData] = useState({
        mvtBank: [],
        isLoading: false
    })
    useEffect(() => {
        dispatch(identifierMenuActions.updateMenu({ menu: "bank" }))
        setData(prev => {
            return {
                ...prev,
                isLoading: true
            }
        })
        if (user.role.includes("ROLE_CHEF_CAISSIER")) {
            let tb = []
            let enterprise = {}
            let agency = {}
            async function get(signal) {
                const allMvtBank = await getAllMvtBank({ signal, enterprise: user.enterprise, agency: user.agency, startDate: new Date().toLocaleDateString(), endDate: new Date().toLocaleDateString() })

                for (let m of allMvtBank) {
                    enterprise = await getEnterpriseById({ id: m.enterprise, signal })
                    agency = await getAgencyById({ id: m.agency, signal })
                    m.enterprise = enterprise.slug
                    m.agency = agency.slug
                    tb.push(m)

                    setData(prev => {
                        return {
                            ...prev,
                            mvtBank: tb,
                            isLoading: false,
                        }
                    })
                }
                setData(prev => {
                    return {
                        ...prev,
                        isLoading: false,
                    }
                })

            }
            get()
        }
    }, [])


    function handleModal(identifier) {
        if (identifier === "new") {
            dialog.current.open();
        }
    }


    return <>
        <div className="flex justify-center mb-2">
            {user.role.includes("ROLE_CHEF_CAISSIER") ? <Submit onClick={() => handleModal("new")}>Nouveau</Submit> : undefined}
        </div>
        <Table data={data?.mvtBank} headers={mvtBanks.header} emptyMessage="Aucune opération trouvée." globalFilterFields={mvtBanks.global} sheet="mvt_caisse" titleRef="Visualiser un mouvement de banque" size="lg:h-5/11 lg:w-4/15" />
        {data?.isLoading && <div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}
        <Modal ref={dialog} size="lg:h-7/15 lg:w-8/16" title="Créer une opération bancaire">
            <CreateMvtBank />
        </Modal>
        {dataItem.length > 0 && <Notification key={relaunch} error={errorNotification} messages={dataItem} />}
    </>
}