import { useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { identifierMenuActions } from "../../store/identifierSlice";
import { useDispatch, useSelector } from "react-redux";
import Notification from "../../layout/Notification";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArtstation, faServicestack } from "@fortawesome/free-brands-svg-icons";

export default function ApproStockPage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const errorNotification = useSelector(state => state.note.error);
    const relaunch = useSelector(state => state.note.relaunch);
    const dataItem = useSelector(state => state.note.dataItem)
    const dispatch = useDispatch()
    const menu = useSelector(state => state.identifier.menu)

    useEffect(() => {
        dispatch(identifierMenuActions.updateMenu({ menu: "stock" }))

    }, [menu, dispatch, user])

    return <>
        Hello world
        {dataItem.length > 0 && <Notification key={relaunch} error={errorNotification} messages={dataItem} />}
    </>
}