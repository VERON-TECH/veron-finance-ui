import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { identifierMenuActions } from "../../store/identifierSlice"
import Logo from "../../layout/LogoDark"


export default function HomeIndexPage() {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user"));
  const menu = useSelector(state => state.identifier.menu);


  useEffect(() => {
    if (user.role.includes("ROLE_ADMIN")) {
      dispatch(identifierMenuActions.updateMenu({ menu: "administration" }))
    }

    if (user.role.includes("ROLE_RESPONSABLE_RH")) {
      dispatch(identifierMenuActions.updateMenu({ menu: "personal" }))
    }

    if (user.role.includes("ROLE_COMPTABLE")) {
      dispatch(identifierMenuActions.updateMenu({ menu: "financial" }))
    }




  }, [dispatch, menu])



  return <>
    {user.role.includes("ROLE_ADMIN") && <Logo position="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" className="animate-bounce" />}

  </>
}