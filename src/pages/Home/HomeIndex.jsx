import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { identifierMenuActions } from "../../store/identifierSlice"
import Logo from "../../layout/Logo"
import { motion } from "framer-motion"
import CardDashboard from "../../components/dashboard/cardDashboard"
import { getAllBeneficiary } from "../../utils/http"

export default function HomeIndexPage() {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user"));
  const menu = useSelector(state => state.identifier.menu);
  const [data, setData] = useState(
    { beneficiary: 0 }
  )

  useEffect(() => {
    async function get() {
      const beneficiaries = await getAllBeneficiary()

      setData(prev => {
        return {
          ...prev,
          beneficiary: beneficiaries?.length
        }
      })
    }
    get()



    if (user.role.includes("ROLE_ADMIN")) {
      dispatch(identifierMenuActions.updateMenu({ menu: "beneficiary" }))
    }

    if (user.role.includes("ROLE_AGENT")) {
      dispatch(identifierMenuActions.updateMenu({ menu: "beneficiary" }))
    }

  }, [dispatch, menu])



  return <>
    {user.role.includes("ROLE_SUPERADMIN") && <Logo position="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" className="animate-bounce" />}
    {user.role.includes("ROLE_ADMIN") || user.role.includes("ROLE_AGENT") ? <div className="flex flex-wrap gap-4 justify-center p-4">
      <CardDashboard title="Bénéficiaires" detail={data?.beneficiary} />
    </div> : undefined}
  </>
}