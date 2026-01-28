import { useActionState, useEffect, useRef, useState } from "react"
import { noteActions } from "../../store/noteSlice";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { addBenficiaryToProject, getAllBeneficiary, getAllFinancements, getBeneficiaryById, getProjectById, queryClient } from "../../utils/http";
import responseHttp from "../../utils/responseHttp";
import Input from "../../layout/Input";
import Select from "../../layout/Select";
import Submit from "../../layout/Submit";
import Modal from "../../layout/Modal";
import { AnimatePresence } from "framer-motion";

export default function AddBeneficiary() {
  const dispatch = useDispatch();
  const selectBeneficiary = useRef();
  const dialog = useRef();
  const user = JSON.parse(localStorage.getItem("user"));
  const [beneficiaryState, setBeneficiaryState] = useState({
    allBeneficiaries: [],
    beneficiary: {},
  })
  const [nui, setNui] = useState("")

  async function handleSubmit(prevState, formData) {

    const refProject = formData.get("refProject")
    const refBeneficiary = formData.get("refBeneficiary")

    mutate({ refProject, refBeneficiary })
    return { errors: null }
  }

  const { mutate } = useMutation({
    mutationFn: addBenficiaryToProject,
    onSuccess: (responseData) => {
      const state = responseHttp(responseData.errors || responseData.success);
      let tb = [responseData.errors || responseData.success]
      if (state) {
        dispatch(noteActions.error(true))
      } else {
        dispatch(noteActions.error(false))
        setNui(responseData.nui)
        dialog.current.open();
      }
      dispatch(noteActions.show());
      dispatch(noteActions.relaunch());
      dispatch(noteActions.sendData(tb))
      queryClient.cancelQueries(["projects"])
      queryClient.cancelQueries(["beneficiaries"])






    }
  })


  const id = useSelector(state => state.modal.value)
  const { data } = useQuery({
    queryKey: ["project", { id }],
    queryFn: ({ signal }) => getProjectById({ signal, id }),
    enabled: user.role.includes("ROLE_ADMIN") && id !== "" && id !== undefined || user.role.includes("ROLE_AGENT") && id !== "" && id !== undefined
  })



  useEffect(() => {
    let tb = [];
    async function get() {
      const allBeneficiaries = await getAllBeneficiary();
      allBeneficiaries.forEach(b => {
        tb.push({ key: b.id, name: b.lastName + " " + b.firstName, value: b.id })
      })
      setBeneficiaryState(prev => {
        return {
          ...prev,
          allBeneficiaries: tb,
        }
      })
    }
    get()

  }, [selectBeneficiary.current?.value])


  async function handleChange(field, id) {
    if (field === "beneficiary") {
      async function get(signal) {
        const beneficiary = await getBeneficiaryById({ signal, id });
        setBeneficiaryState(prev => {
          return {
            ...prev,
            beneficiary,
          }
        })
      }
      get()
    }


  }

  const [formState, formAction] = useActionState(handleSubmit, { errors: null })

  return <>
    <form action={formAction} className="flex flex-col items-center justify-between gap-2rounded-lg text-green-50" >
      <fieldset className="mb-2 flex flex-col border-1 border-green-950 p-4 rounded-xl shadow- shadow-green-950">
        <legend className="bg-green-950 text-green-50 font-extrabold text-lg shadow shadow-green-950 text-shadow-green-950 text-center p-2 rounded ">ID: {data?.refProject}</legend>
        <div className="flex justify-between gap-2 ">
          <Input label="Réf Domaine" type="text" defaultValue={data?.uniqueProject} placeholder="Référence du domaine" className="border border-green-950" readOnly />
          <Input label="Domaine" type="text" defaultValue={data?.domain} placeholder="Domaine" className="border border-green-950" readOnly />
        </div>

        <div className="flex justify-between gap-2 ">
          <Input label="Réf. Activité" type="text" defaultValue={data?.typeActivity} placeholder="Référence de l'activité" className="border border-green-950" readOnly />
          <Input label="Activité" type="text" defaultValue={data?.activity} placeholder="Activité" className="border border-green-950" readOnly />
        </div>

        <div className="flex justify-between gap-2">
          <Input label="ID segment *" type="text" defaultValue={data?.refProject} name="refProject" placeholder="Réf" className="border border-green-950" readOnly />
          <Input label="Nom *" type="text" defaultValue={data?.name} placeholder="Nom du segment" className="border border-green-950" readOnly />
        </div>

      </fieldset>

      <fieldset className="mb-4 flex flex-col border-1 border-green-950 p-4 rounded-xl shadow shadow-green-950">
        <legend className="bg-green-950 text-green-50 font-extrabold text-lg shadow shadow-green-950 text-shadow-green-950 text-center p-2 rounded">Informations sur le bénéficiare</legend>
        <div className="flex justify-between gap-2 ">
          <Select label="Bénéficiaire *" id="beneficiary" selectedTitle="Sélectionner un bénéficiare" data={beneficiaryState.allBeneficiaries} onChange={(event) => handleChange("beneficiary", event.target.value)} ref={selectBeneficiary} />
          <Input label="Tél." type="text" defaultValue={beneficiaryState.beneficiary?.phone} placeholder="Nº de téléphone" className="border border-green-950" readOnly />
        </div>

        <div className="flex justify-between gap-2 ">
          <Input label="Tél2." type="text" defaultValue={beneficiaryState.beneficiary?.phone2} placeholder="Nº de téléphone Nº2" className="border border-green-950" readOnly />
          <Input label="E-mail" type="text" defaultValue={beneficiaryState.beneficiary?.email} placeholder="E-mail" className="border border-green-950" readOnly />
        </div>

        <div className="flex justify-between gap-2">
          <Input label="Adresse" type="text" defaultValue={beneficiaryState.beneficiary?.address} placeholder="Addresse" className="border border-green-950" readOnly />
          <Input label="Type" type="text" defaultValue={beneficiaryState.beneficiary?.type} placeholder="Type de bénéficiare" className="border border-green-950" readOnly />
        </div>

        <div className="flex justify-between gap-2">
          <Input label="Catégorie" type="text" defaultValue={beneficiaryState.beneficiary?.category} placeholder="Catégorie" className="border border-green-950" readOnly />
          <Input label="ID" type="text" defaultValue={beneficiaryState.beneficiary?.refBeneficiary} name="refBeneficiary" placeholder="Référence" className="border border-green-950" readOnly />
        </div>

      </fieldset>

      <Submit>
        Ajouter
      </Submit>
    </form>
    <AnimatePresence>
      <Modal ref={dialog} size="lg:h-2/11 lg:w-4/15" title="Financement généré">
        <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 font-extrabold">{nui}</span>
      </Modal>
    </AnimatePresence>

  </>
}