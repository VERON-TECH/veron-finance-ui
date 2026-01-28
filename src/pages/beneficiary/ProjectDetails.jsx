import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getProjectById } from "../../utils/http";
import Input from "../../layout/Input";

export default function ProjectDetailPage() {
  const param = useParams();
  const user = JSON.parse(localStorage.getItem("user"))

  const { data } = useQuery({
    queryKey: ["projects", { id: param.id }],
    queryFn: ({ signal }) => getProjectById({ signal, id: param.id }),
    enabled: user.role.includes("ROLE_ADMIN") && param.id !== "" || user.role.includes("ROLE_AGENT") && param.id !== ""
  })


  return <div className="border-1 border-green-950 p-4 rounded shadow shadow-green-950">
    <div className="flex justify-between gap-2">
      <Input label="Domaine" type="text" defaultValue={data?.domain} placeholder="Domaine" className="border border-green-950" readOnly />
      <Input label="Activité" type="text" defaultValue={data?.activity} placeholder="Type d'activité" className="border border-green-950" readOnly />
    </div>


    <div className="flex justify-between gap-2">
      <Input label="ID segment *" type="text" defaultValue={data?.refProject} placeholder="Réf." className="border border-green-950" readOnly />
      <Input label="Nom *" type="text" defaultValue={data?.name} placeholder="Nom du segment" className="border border-green-950" readOnly />
    </div>

  </div>
}