import Submit from "../../layout/Submit.jsx";
import { isNotEmpty } from "../../utils/validation.jsx";
import { useActionState, useRef, } from "react";
import { addProject, queryClient } from "../../utils/http.js";
import Input from "../../layout/Input.jsx"
import Select from "../../layout/Select.jsx";
import { useMutation } from "@tanstack/react-query";
import { noteActions } from "../../store/noteSlice.js";
import { useDispatch } from "react-redux";
import responseHttp from "../../utils/responseHttp.js";
import { useAnimate } from "framer-motion";
import { domains, typeActivity } from "../../data/extraInfo.js";

export default function CreateProject() {
  const inputName = useRef();
  const selectType = useRef();
  const selectDomain = useRef();

  const dispatch = useDispatch();
  const [scope, animate] = useAnimate();

  async function handleSubmit(prevState, formData) {
    const allData = Object.fromEntries(formData.entries())
    let errors = [];

    const name = formData.get("name")
    const typeActivity = formData.get("typeActivity")
    const uniqueProject = formData.get("uniqueProject")


    if (!isNotEmpty(name)) {
      animate(inputName.current, { x: [0, 15, 0] }, { bounce: 0.75 })
      errors.push("Le nom du segment est obligatoire !")
    }



    if (typeActivity === null) {
      animate(selectType.current, { x: [0, 15, 0] }, { bounce: 0.75 })
      errors.push("Le type d'activité est obligatoire !")
    }



    if (uniqueProject === null) {
      animate(selectDomain.current, { x: [0, 15, 0] }, { bounce: 0.75 })
      errors.push("Le domaine du segment est obligatoire !")
    }


    if (errors.length > 0) {
      dispatch(noteActions.show());
      dispatch(noteActions.error(true));
      dispatch(noteActions.relaunch());
      dispatch(noteActions.sendData(errors))

      return {
        errors, enteredValue: {
          name,
        }
      }
    }

    mutate(allData)
    return { errors: null }
  }


  const [formState, formAction] = useActionState(handleSubmit, { errors: null })


  const { mutate } = useMutation({
    mutationFn: addProject,
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





  function handleBlur(field, value) {


    if (field === "name") {
      if (!isNotEmpty(value)) {
        animate(inputName.current, { x: [0, 15, 0] }, { bounce: 0.75 })
      }
    }



  }



  return <>

    <form action={formAction} className="rounded-lg text-green-50 p-4" ref={scope}>


      <div className="flex flex-col justify-between gap-2">
        <Select label="Domaine *" id="uniqueProject" name="uniqueProject" selectedTitle="Sélectionner un domaine" data={domains} ref={selectDomain} />
        <Select label="Type d'activité *" id="typeActivity" name="typeActivity" selectedTitle="Sélectionner un type d'activité" data={typeActivity} ref={selectType} />
        <Input label="Nom *" type="text" defaultValue={formState.enteredValue?.name} name="name" placeholder="Nom du segment" className="border border-green-950" onBlur={(event) => handleBlur("name", event.target.value)} ref={inputName} />
      </div>



      <Submit>
        Créer
      </Submit>
    </form>


  </>
}