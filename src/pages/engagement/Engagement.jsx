import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { getAllEngagements } from "../../utils/http";
import Notification from "../../layout/Notification.jsx"
import { useEffect } from "react";
import Table from "../../layout/Table.jsx"
import { identifierMenuActions } from "../../store/identifierSlice.js"
import { engagements } from "../../data/dataTable.js";
import Submit from "../../layout/Submit.jsx";



export default function EngagementPage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const errorNotification = useSelector(state => state.note.error);
    const relaunch = useSelector(state => state.note.relaunch);
    const dataItem = useSelector(state => state.note.dataItem)
    const dispatch = useDispatch()
    const menu = useSelector(state => state.identifier.menu)


    const { data } = useQuery({
        queryKey: ["engagements", { enterprise: user.enterprise, agency: user.agency }],
        queryFn: ({ signal }) => getAllEngagements({ signal, enterprise: user.enterprise, agency: user.agency }),
        enabled: user.role.includes("ROLE_ADMIN") || user.role.includes("ROLE_COMPTABLE")
    })



    useEffect(() => {
        dispatch(identifierMenuActions.updateMenu({ menu: "engagement" }))
    }, [menu, dispatch])

    return <>
        <div className="flex justify-center gap-4">
            <Submit onClick={() => handleClick("supplies")}>
                Fournitures
            </Submit>
            <Submit onClick={() => handleClick("rebuts")}>
                Rébuts
            </Submit>
            <Submit onClick={() => handleClick("packages")}>
                Paquets
            </Submit>
        </div>
        <Table data={data} headers={engagements.header} emptyMessage="Aucun engagement trouvé." globalFilterFields={engagements.global} sheet="Engagement" titleRef="Visualiser les engagements" size="lg:h-9/12 lg:w-11/15 xl:w-13/15 xl:h-9/12" />

        {dataItem.length > 0 && <Notification key={relaunch} error={errorNotification} messages={dataItem} />}
    </>
}