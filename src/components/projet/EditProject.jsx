import Submit from "../../layout/Submit.jsx";
import { isNotEmpty } from "../../utils/validation.jsx";
import { useActionState, useRef, } from "react";
import { editProject, getProjectById, queryClient } from "../../utils/http.js";
import Input from "../../layout/Input.jsx"
import Select from "../../layout/Select.jsx";
import { useMutation, useQuery } from "@tanstack/react-query";
import { noteActions } from "../../store/noteSlice.js";
import { useDispatch, useSelector } from "react-redux";
import responseHttp from "../../utils/responseHttp.js";
import { AnimatePresence, useAnimate } from "framer-motion";
import { domains, typeActivity } from "../../data/extraInfo.js";
import Modal from "../../layout/Modal.jsx";
import AddBeneficiary from "./AddBeneficiary.jsx";
import BeneficiaryList from "./BeneficiaryList.jsx";

export default function EditProject() {

  const inputName = useRef();
  const dialog = useRef();
  const dialog1 = useRef();
  const user = JSON.parse(localStorage.getItem("user"));

  const dispatch = useDispatch();
  const [scope, animate] = useAnimate();

  async function handleSubmit(prevState, formData) {

    let errors = [];


    const name = formData.get("name")
    const typeActivity = formData.get("typeActivity")
    const uniqueProject = formData.get("uniqueProject")
    const actualTypeActivity = formData.get("actualTypeActivity")
    const actualUniqueProject = formData.get("actualUniqueProject")


    if (!isNotEmpty(name)) {
      animate(inputName.current, { x: [0, 15, 0] }, { bounce: 0.75 })
      errors.push("Le nom du segment est obligatoire !")
    }




    if (errors.length > 0) {
      dispatch(noteActions.show());
      dispatch(noteActions.error(true));
      dispatch(noteActions.relaunch());
      dispatch(noteActions.sendData(errors))

      return {
        errors
      }
    }


    const projectDto = {
      name,
      uniqueProject: uniqueProject === null ? actualUniqueProject : uniqueProject,
      typeActivity: typeActivity === null ? actualTypeActivity : typeActivity,
    }
    mutate({ id, projectDto })
    return { errors: null }
  }


  const [formState, formAction] = useActionState(handleSubmit, { errors: null })

  const { mutate } = useMutation({
    mutationFn: editProject,
    onSuccess: (responseData) => {
      const state = responseHttp(responseData);
      if (state) {
        dispatch(noteActions.error(true))
      } else {
        dispatch(noteActions.error(false))
      }
      dispatch(noteActions.show());
      dispatch(noteActions.relaunch());
      dispatch(noteActions.sendData(responseData))
      queryClient.cancelQueries(["projects"])
    }
  })

  const id = useSelector(state => state.modal.value)
  const { data } = useQuery({
    queryKey: ["projects", { id }],
    queryFn: ({ signal }) => getProjectById({ signal, id }),
    enabled: user.role.includes("ROLE_ADMIN") && id !== "" && id !== undefined || user.role.includes("ROLE_AGENT") && id !== "" && id !== undefined
  })


  function handleBlur(field, value) {

    if (field === "name") {
      if (!isNotEmpty(value)) {
        animate(inputName.current, { x: [0, 15, 0] }, { bounce: 0.75 })
      }
    }


  }


  function handleAddBeneficiary() {
    dialog.current.open();
  }

  function handleListBeneficiary() {
    dialog1.current.open();
  }




  return <>

    <form action={formAction} className="flex flex-col items-center justify-between gap-2rounded-lg text-green-50 p-4" ref={scope}>

      <div className="flex justify-between gap-2">
        <Input label="Domaine actuel *" type="text" defaultValue={data?.uniqueProject} name="actualUniqueProject" placeholder="Domaine actuel" className="border border-green-950" readOnly />
        <Select label="Domaine *" id="uniqueProject" name="uniqueProject" selectedTitle="Sélectionner un domaine" data={domains} />
      </div>

      <div className="flex justify-between gap-2">
        <Input label="Activité actuel *" type="text" defaultValue={data?.typeActivity} name="actualTypeActivity" placeholder="Type d'activité actuel" className="border border-green-950" readOnly />
        <Select label="Type d'activité *" id="typeActivity" name="typeActivity" selectedTitle="Sélectionner un type d'activité" data={typeActivity} />
      </div>

      <div className="flex justify-between gap-2">
        <Input label="ID segment *" type="text" defaultValue={data?.refProject} placeholder="Réf" className="border border-green-950" readOnly />
        <Input label="Nom *" type="text" defaultValue={data?.name} name="name" placeholder="Nom du segment" className="border border-green-950" onBlur={(event) => handleBlur("name", event.target.value)} ref={inputName} />

      </div>

      <Submit>
        Enregistrer
      </Submit>
    </form>

    <div className="flex justify-center gap-4">

      <Submit onClick={handleListBeneficiary}>
        Liste des bénéficiaires
      </Submit>

      <Submit onClick={handleAddBeneficiary}>
        Ajouter un bénéficiaires
      </Submit>
    </div>

    <AnimatePresence>
      <Modal ref={dialog} size="lg:h-9/10 lg:w-8/15" title="Ajouter un bénéficiaire">
        <AddBeneficiary />
      </Modal>
    </AnimatePresence>

    <AnimatePresence>
      <Modal ref={dialog1} size="lg:h-8/10 lg:w-8/15" title="Liste des bénéficiaires">
        <BeneficiaryList />
      </Modal>
    </AnimatePresence>



  </>
}