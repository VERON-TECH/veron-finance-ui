import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { getAllMissing, getAllSurplus } from "../../utils/http";
import Notification from "../../layout/Notification.jsx"
import { useEffect } from "react";
import Table from "../../layout/Table.jsx"
import { identifierMenuActions } from "../../store/identifierSlice.js"
import { missings, surplus } from "../../data/dataTable.js";
import Logo from "../../layout/LogoDark.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";




export default function SurplusPage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const errorNotification = useSelector(state => state.note.error);
    const relaunch = useSelector(state => state.note.relaunch);
    const dataItem = useSelector(state => state.note.dataItem)
    const dispatch = useDispatch()
    const menu = useSelector(state => state.identifier.menu)
    const cash = user?.cashes[0] || 0



    useEffect(() => {
        dispatch(identifierMenuActions.updateMenu({ menu: "cash" }))
    }, [menu, dispatch])

    const { data, isLoading } = useQuery({
        queryKey: ["surplus", { enterprise: user.enterprise, agency: user.agency, cash: cash.key, startDate: new Date().toLocaleDateString(), endDate: new Date().toLocaleDateString() }],
        queryFn: ({ signal }) => getAllSurplus({ signal, personal: user.personal }),
        enabled: user.role.includes("ROLE_CAISSIER") || user.role.includes("ROLE_CHEF_CAISSIER") || user.role.includes("ROLE_COMPTABLE")
    })



    return <>
        <Table data={data} headers={surplus.header} emptyMessage="Aucun surplus trouvé." globalFilterFields={surplus.global} sheet="surplus" titleRef="Visualiser un surplus" size="lg:h-5/11 lg:w-4/15" />
        {isLoading && <div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}
        {dataItem.length > 0 && <Notification key={relaunch} error={errorNotification} messages={dataItem} />}
    </>
}