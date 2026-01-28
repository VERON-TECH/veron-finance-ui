
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { getAllProjectsByBeneficiary } from "../../utils/http";

import { faFolderOpen, faHandPointRight } from "@fortawesome/free-solid-svg-icons";
import { Outlet, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ProjectList() {

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate()


  const id = useSelector(state => state.modal.value)
  const { data } = useQuery({
    queryKey: ["projects", { id }],
    queryFn: ({ signal }) => getAllProjectsByBeneficiary({ signal, id }),
    enabled: user.role.includes("ROLE_ADMIN") && id !== "" && id !== undefined || user.role.includes("ROLE_AGENT") && id !== "" && id !== undefined
  })

  function handleClick(field, id) {
    if (field === "project") {
      navigate(`${id}`)
    }
  }

  return <>
    <div>
      {data?.length > 0 ? data.map(p => <div key={p.id} whileHover={{ scale: 1.1 }} className="font-bold bg-green-950 text-green-50 shadow-green-950 shadow-md p-2 rounded mb-4"><FontAwesomeIcon icon={faHandPointRight} className="me-4" /><span >{p.name + " (" + p.refProject + ")"}</span><FontAwesomeIcon icon={faFolderOpen} className="absolute right-8 cursor-pointer" onClick={() => handleClick("project", p.id)} /></div>) : <div className="font-medium">Aucun segment trouvé pour ce bénéficiare</div>}
      <Outlet />
    </div>
  </>
}