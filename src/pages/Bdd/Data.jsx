import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { identifierMenuActions } from "../../store/identifierSlice"
import Logo from "../../layout/Logo";

export default function DataPage() {
  const menu = useSelector(state => state.identifier.menu);
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user"))

  useEffect(() => {
    dispatch(identifierMenuActions.updateMenu({ menu: "bdd" }))
  }, [dispatch, menu])
  return <>
    {user.role.includes("ROLE_SUPERADMIN") && <Logo position="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2" className="animate-bounce" />
    }
  </>
}