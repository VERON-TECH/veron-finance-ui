
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { getAllBeneficiriesByProject } from "../../utils/http";

import { faFolderOpen, faHandPointRight } from "@fortawesome/free-solid-svg-icons";
import { Outlet, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function BeneficiaryList() {

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate()


  const id = useSelector(state => state.modal.value)
  const { data } = useQuery({
    queryKey: ["beneficiaries", { id }],
    queryFn: ({ signal }) => getAllBeneficiriesByProject({ signal, id }),
    enabled: user.role.includes("ROLE_ADMIN") && id !== "" && id !== undefined || user.role.includes("ROLE_AGENT") && id !== "" && id !== undefined
  })

  function handleClick(field, id) {
    if (field === "beneficiary") {
      navigate(`${id}`)
    }
  }

  return <>
    <div>
      {data?.length > 0 ? data.map(b => <div key={b.id} whileHover={{ scale: 1.1 }} className="font-bold bg-green-950 text-green-50 shadow-green-950 shadow-md p-2 rounded mb-4"><FontAwesomeIcon icon={faHandPointRight} className="me-4" /><span >{b.lastName + " " + b.firstName}</span><FontAwesomeIcon icon={faFolderOpen} className="absolute right-8 cursor-pointer" onClick={() => handleClick("beneficiary", b.id)} /></div>) : <div className="font-medium">Aucun bénéficiaire trouvé pour ce segment</div>}
      <Outlet />
    </div>
  </>
}