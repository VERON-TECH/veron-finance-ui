import { useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { identifierMenuActions } from "../../store/identifierSlice";
import { useDispatch, useSelector } from "react-redux";
import Notification from "../../layout/Notification";

export default function HomeProductServicePage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const errorNotification = useSelector(state => state.note.error);
    const relaunch = useSelector(state => state.note.relaunch);
    const dataItem = useSelector(state => state.note.dataItem)
    const dispatch = useDispatch()
    const menu = useSelector(state => state.identifier.menu)

    useEffect(() => {
        dispatch(identifierMenuActions.updateMenu({ menu: "store" }))

    }, [menu, dispatch, user])

    return <>
        <div className="mb-4">
            <ul className="bg-sky-950 flex gap-4 p-2 text-xs text-sky-50 rounded">
                <NavLink to="" className="w-32  p-1 hover:border-b-4 font-medium text-center cursor-pointer">Produits/Fournitures</NavLink>
                <NavLink to="service" className="w-32  p-1 hover:border-b-4 font-medium text-center cursor-pointer">Services</NavLink>
            </ul>
        </div>
        <div>
            <Outlet />
        </div>
        {dataItem.length > 0 && <Notification key={relaunch} error={errorNotification} messages={dataItem} />}
    </>
}