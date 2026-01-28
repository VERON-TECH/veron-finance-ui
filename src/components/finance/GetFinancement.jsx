import Submit from "../../layout/Submit.jsx";
import { getProjectAttributionById } from "../../utils/http.js";
import Input from "../../layout/Input.jsx"
import Select from "../../layout/Select.jsx";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

export default function GetFinancement() {
  const user = JSON.parse(localStorage.getItem("user"))
  const id = useSelector(state => state.modal.value)
  const { data } = useQuery({
    queryKey: ["finances", { id }],
    queryFn: ({ signal }) => getProjectAttributionById({ signal, id }),
    enabled: user.role.includes("ROLE_ADMIN") && id !== "" && id !== undefined || user.role.includes("ROLE_AGENT") && id !== "" && id !== undefined
  })



  return <>


    <div className="flex justify-between gap-2">
      <Input label="N.U.I." type="text" defaultValue={data?.nui} placeholder="Numéro unique" className="border border-green-950" readOnly />
      <Input label="ID segment" type="text" defaultValue={data?.project} placeholder="Référence du segment" className="border border-green-950" readOnly />
    </div>

    <div className="flex justify-between gap-2">
      <Input label="ID Bénéficiare" type="text" defaultValue={data?.beneficiary} placeholder="Référence du bénéficiare" className="border border-green-950" readOnly />
      <Input label="Nom complet" type="text" defaultValue={data?.fullName} placeholder="Nom complet" className="border border-green-950" readOnly />
    </div>

    <div className="flex justify-between gap-2">
      <Input label="Réf. du domaine *" type="text" defaultValue={data?.uniqueProject} placeholder="Référence du domaine" className="border border-green-950" readOnly />
      <Input label="Domaine *" type="text" defaultValue={data?.domain} placeholder="Domaine" className="border border-green-950" readOnly />
    </div>

    <div className="flex justify-between gap-2">
      <Input label="Réf. de l'activité*" type="text" defaultValue={data?.typeActivity} placeholder="Référence de l'activité" className="border border-green-950" readOnly />
      <Input label="Activité *" type="text" defaultValue={data?.activity} placeholder="Activité" className="border border-green-950" readOnly />
    </div>

    <div className="flex justify-between gap-2">
      <Input label="Créé le" type="text" defaultValue={data?.dateCreation} placeholder="Date de création" className="border border-green-950" readOnly />
      <Input label="Créé par *" type="text" defaultValue={data?.userCreated} placeholder="L'agent" className="border border-green-950" readOnly />
    </div>


  </>
}