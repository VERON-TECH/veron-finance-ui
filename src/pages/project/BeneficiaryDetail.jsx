import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom"
import { getBeneficiaryById } from "../../utils/http";
import Input from "../../layout/Input";
import Select from "../../layout/Select";

export default function BeneficiaryDetailPage() {
  const param = useParams();
  const user = JSON.parse(localStorage.getItem("user"))

  const { data } = useQuery({
    queryKey: ["beneficiaries", { id: param.id }],
    queryFn: ({ signal }) => getBeneficiaryById({ signal, id: param.id }),
    enabled: user.role.includes("ROLE_ADMIN") && param.id !== "" || user.role.includes("ROLE_AGENT") && param.id !== ""
  })


  return <div className="border-1 border-green-950 p-4 rounded shadow shadow-green-950">
    <div className="flex justify-between">
      <Input label="Pays" type="text" defaultValue={data?.country} placeholder="Pays" className="border border-green-950" readOnly />
      <Input label="Ville" type="text" defaultValue={data?.city} placeholder="Ville" className="border border-green-950" readOnly />
    </div>


    <div className="flex justify-between">
      <Input label="Type" type="text" defaultValue={data?.typeBeneficiary} placeholder="Type actuel" className="border border-green-950" readOnly />
      <Input label="Catégorie" type="text" defaultValue={data?.categorySocioEconomic} placeholder="Catégorie" className="border border-green-950" readOnly />
    </div>



    <div className="flex justify-between">
      <Input label="Addresse *" type="text" defaultValue={data?.address} name="address" placeholder="Addresse" className="border border-green-950" readOnly />
      <Input label="E-mail *" type="text" defaultValue={data?.email} name="email" placeholder="E-mail" className="border border-green-950" readOnly />
    </div>

    <div className="flex justify-between">
      <Input label="Nom *" type="text" defaultValue={data?.lastName} name="lastName" placeholder="Nom" className="border border-green-950" readOnly />
      <Input label="Prénom " type="text" defaultValue={data?.firstName} name="firstName" placeholder="Prénom" className="border border-green-950" readOnly />
    </div>

    <div className="flex justify-between">
      <Input label="Tél. *" type="text" defaultValue={data?.phone} name="phone" placeholder="Nº de téléphone" className="border border-green-950" readOnly />
      <Input label="Tél. 2" type="text" defaultValue={data?.phone2} name="phone2" placeholder="Nº de téléphone" className="border border-green-950" readOnly />
    </div>

    <div className="flex justify-between">
      <Input label="C.N.I. *" type="text" defaultValue={data?.idCard} name="idCard" placeholder="Nº C.N.I." className="border border-green-950" readOnly />
      <Input label="Délivrée le *" type="date" defaultValue={data?.dateObtention} name="dateObtention" placeholder="Date de délivrance" className="border border-green-950" readOnly />
    </div>

    <div className="flex justify-between">
      <Input label="Délivrée à *" type="text" defaultValue={data?.placeObtention} name="placeObtention" placeholder="Lieu de délivrance" className="border border-green-950" readOnly />
      <Input label="Délivrée par *" type="text" defaultValue={data?.commissaire} name="commissaire" placeholder="Délégué" className="border border-green-950" readOnly />
    </div>

  </div>
}