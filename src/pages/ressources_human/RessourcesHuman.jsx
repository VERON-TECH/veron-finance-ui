import { useEffect } from "react";
import { identifierMenuActions } from "../../store/identifierSlice";
import { useDispatch, useSelector } from "react-redux";

export default function RessourcesHumanPage() {
    const dispatch = useDispatch()
    const menu = useSelector(state => state.identifier.menu)

    useEffect(() => {
        dispatch(identifierMenuActions.updateMenu({ menu: "personal" }))
    }, [menu, dispatch])

    return <>

    </>
}