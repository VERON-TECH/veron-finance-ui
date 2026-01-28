import { useEffect, useState } from "react"
import { identifierMenuActions } from "../../store/identifierSlice"
import { useDispatch, useSelector } from "react-redux"
import { getAllProjects, getAllFinancements } from "../../utils/http.js"
import CardDashboard from "../../components/dashboard/cardDashboard"

export default function ProjectsPage() {
  const dispatch = useDispatch()
  const menu = useSelector(state => state.identifier.menu)
  const user = JSON.parse(localStorage.getItem("user"))
  const [data, setData] = useState({
    projectCreated: 0,
    financement: 0
  })
  useEffect(() => {
    async function get() {
      const allProjects = await getAllProjects();
      const allFinancements = await getAllFinancements()

      setData(prev => {
        return {
          ...prev,
          projectCreated: allProjects?.length,
          financement: allFinancements?.length,
        }
      })
    }
    get()
    dispatch(identifierMenuActions.updateMenu({ menu: "project" }))
  }, [menu, dispatch])
  return <>
    {user.role.includes("ROLE_ADMIN") || user.role.includes("ROLE_AGENT") ? <div className="flex flex-wrap gap-4 justify-center p-4">
      <CardDashboard title="Segments" detail={data?.projectCreated} />
      <CardDashboard title="Segments alloués" detail={data?.financement} />
    </div> : undefined}
  </>
}