import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { identifierMenuActions } from "../../store/identifierSlice";
import Logo from "../../layout/Logo";
import CardDashboard from "../../components/dashboard/cardDashboard";
import { getAllUsers } from "../../utils/http";

export default function HumanPage() {
  const menu = useSelector(state => state.identifier.menu);
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user"))
  const [data, setData] = useState(
    {
      user: 0,
      userConnected: 0
    }
  )

  useEffect(() => {
    async function get() {
      const users = await getAllUsers()
      let tb = []

      users.forEach(u => {
        if (user.connected) {
          tb.push({ key: u.id, username: u.username })
        }
      })

      setData(prev => {
        return {
          ...prev,
          user: users?.length,
          userConnected: tb.length,
        }
      })
    }
    get()
    dispatch(identifierMenuActions.updateMenu({ menu: "users" }))
  }, [dispatch, menu])
  return <>
    {user.role.includes("ROLE_SUPERADMIN") && <Logo position="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2" className="animate-bounce" />}
    {user.role.includes("ROLE_ADMIN") && <div className="flex flex-wrap gap-4 justify-center p-4">
      <CardDashboard title="Utilisateurs" detail={data?.user} />
      <CardDashboard title="Utilisateurs connectés" detail={data?.userConnected} />
    </div>}

  </>
}