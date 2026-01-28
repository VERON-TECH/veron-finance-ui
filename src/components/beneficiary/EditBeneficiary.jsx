import Submit from "../../layout/Submit.jsx";
import { isEmail, isNotEmpty } from "../../utils/validation.jsx";
import { useActionState, useRef, useState, } from "react";
import { editBeneficiary, getBeneficiaryById, queryClient } from "../../utils/http.js";
import Input from "../../layout/Input.jsx"
import Select from "../../layout/Select.jsx";
import { useMutation, useQuery } from "@tanstack/react-query";
import { noteActions } from "../../store/noteSlice.js";
import { useDispatch, useSelector } from "react-redux";
import responseHttp from "../../utils/responseHttp.js";
import { AnimatePresence, useAnimate } from "framer-motion";
import { categorySocioEconomics, cities, countries, genders, states, typeBeneficiaries } from "../../data/extraInfo.js";
import ProjectList from "./ProjectList.jsx";
import Modal from "../../layout/Modal.jsx";

export default function EditBeneficiary() {
  const inputEmail = useRef();
  const inputPlaceObtention = useRef();
  const inputCommissaire = useRef();
  const inputDateObtention = useRef();
  const inputIdCard = useRef();
  const inputPhone2 = useRef();
  const inputPhone = useRef();
  const inputFirstName = useRef();
  const inputLastName = useRef();
  const selectCategory = useRef();
  const selectType = useRef();
  const inputAddress = useRef();
  const selectCity = useRef();
  const selectCountry = useRef();
  const selectState = useRef();
  const selectGender = useRef();
  const dispatch = useDispatch();
  const [scope, animate] = useAnimate();
  const [cityState, setCityState] = useState([]);
  const [stateName, setStateName] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const dialog = useRef();

  async function handleSubmit(prevState, formData) {
    let errors = [];

    const email = formData.get("email")
    const placeObtention = formData.get("placeObtention")
    const commissaire = formData.get("commissaire")
    const dateObtention = formData.get("dateObtention")
    const idCard = formData.get("idCard")
    const phone2 = formData.get("phone2")
    const phone = formData.get("phone")
    const lastName = formData.get("lastName")
    const address = formData.get("address")
    const typeBeneficiary = formData.get("typeBeneficiary")
    const categorySocioEconomic = formData.get("categorySocioEconomic")
    const country = formData.get("country")
    const state = formData.get("state")
    const city = formData.get("city")
    const actualCategorySocioEconomic = formData.get("actualCategorySocioEconomic")
    const actualTypeBeneficiary = formData.get("actualTypeBeneficiary")
    const actualCountry = formData.get("actualCountry")
    const actualState = formData.get("actualState")
    const actualCity = formData.get("actualCity")
    const actualGender = formData.get("actualGender")
    const gender = formData.get("gender")
    const firstName = formData.get("firstName")



    if (!isNotEmpty(email)) {
      animate(inputEmail.current, { x: [0, 15, 0] }, { bounce: 0.75 })
      errors.push("L'email est obligatoire !")
    }

    if (!isEmail(email)) {
      animate(inputEmail.current, { x: [0, 15, 0] }, { bounce: 0.75 })
      errors.push("Bien vouloir renseigner une adresse e-mail valide !")
    }

    if (!isNotEmpty(placeObtention)) {
      animate(inputPlaceObtention.current, { x: [0, 15, 0] }, { bounce: 0.75 })
      errors.push("Le lieu de délivrance est obligatoire !")
    }

    if (!isNotEmpty(commissaire)) {
      animate(inputCommissaire.current, { x: [0, 15, 0] }, { bounce: 0.75 })
      errors.push("Le lieu de délivrance est obligatoire !")
    }


    if (dateObtention === null) {
      animate(inputDateObtention.current, { x: [0, 15, 0] }, { bounce: 0.75 })
      errors.push("La date de délivrance est obligatoire !")
    }

    if (!isNotEmpty(idCard)) {
      animate(inputIdCard.current, { x: [0, 15, 0] }, { bounce: 0.75 })
      errors.push("Le nº de C.N.I. est obligatoire !")
    }


    if (!isNotEmpty(phone) && !isNotEmpty(phone2)) {
      animate(inputPhone.current, { x: [0, 15, 0] }, { bounce: 0.75 })
      animate(inputPhone2.current, { x: [0, 15, 0] }, { bounce: 0.75 })
      errors.push("Le nº de téléphone. est obligatoire !")
    }

    if (!isNotEmpty(lastName)) {
      animate(inputLastName.current, { x: [0, 15, 0] }, { bounce: 0.75 })
      errors.push("Le nom du bénéficiaire est obligatoire !")
    }



    if (!isNotEmpty(address)) {
      animate(inputAddress.current, { x: [0, 15, 0] }, { bounce: 0.75 })
      errors.push("L'addresse du bénéficiaire est obligatoire !")
    }



    if (errors.length > 0) {
      dispatch(noteActions.show());
      dispatch(noteActions.error(true));
      dispatch(noteActions.relaunch());
      dispatch(noteActions.sendData(errors))

      return {
        errors,
      }
    }


    const beneficiaryDto = {
      typeBeneficiary: typeBeneficiary === null ? actualTypeBeneficiary : typeBeneficiary,
      categorySocioEconomic: categorySocioEconomic === null ? actualCategorySocioEconomic : categorySocioEconomic,
      country: country === null ? actualCountry : country,
      state: state === null ? actualState : state,
      city: city === null ? actualCity : city,
      gender: gender === null ? actualGender : gender,
      address,
      lastName,
      firstName,
      phone,
      phone2,
      email,
      idCard,
      dateObtention,
      commissaire,
      placeObtention
    }

    mutate({ id, beneficiaryDto })
    return { errors: null }
  }


  const [formState, formAction] = useActionState(handleSubmit, { errors: null })


  const { mutate } = useMutation({
    mutationFn: editBeneficiary,
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
      queryClient.cancelQueries(["beneficiaries"])
    }
  })

  const id = useSelector(state => state.modal.value)
  const { data } = useQuery({
    queryKey: ["beneficiaries", { id }],
    queryFn: ({ signal }) => getBeneficiaryById({ signal, id }),
    enabled: user.role.includes("ROLE_ADMIN") && id !== "" || user.role.includes("ROLE_AGENT") && id !== ""
  })


  function handleBlur(field, value) {


    if (field === "address") {
      if (!isNotEmpty(value)) {
        animate(inputAddress.current, { x: [0, 15, 0] }, { bounce: 0.75 })
      }
    }

    if (field === "lastName") {
      if (!isNotEmpty(value)) {
        animate(inputLastName.current, { x: [0, 15, 0] }, { bounce: 0.75 })
      }
    }


    if (field === "firstName") {
      if (!isNotEmpty(value)) {
        animate(inputFirstName.current, { x: [0, 15, 0] }, { bounce: 0.75 })
      }
    }


    if (field === "idCard") {
      if (!isNotEmpty(value)) {
        animate(inputIdCard.current, { x: [0, 15, 0] }, { bounce: 0.75 })
      }
    }


    if (field === "dateObtention") {
      if (value === null) {
        animate(inputDateObtention.current, { x: [0, 15, 0] }, { bounce: 0.75 })
      }
    }


    if (field === "placeObtention") {
      if (!isNotEmpty(value)) {
        animate(inputPlaceObtention.current, { x: [0, 15, 0] }, { bounce: 0.75 })
      }
    }

    if (field === "phone") {
      if (!isNotEmpty(value)) {
        animate(inputPhone.current, { x: [0, 15, 0] }, { bounce: 0.75 })
      }
    }

    if (field === "phone2") {
      if (!isNotEmpty(value)) {
        animate(inputPhone2.current, { x: [0, 15, 0] }, { bounce: 0.75 })
      }
    }

    if (field === "email") {
      if (!isNotEmpty(value)) {
        animate(inputEmail.current, { x: [0, 15, 0] }, { bounce: 0.75 })
      }
      if (!isEmail(value)) {
        animate(inputEmail.current, { x: [0, 15, 0] }, { bounce: 0.75 })
      }
    }
  }


  function handleChange(field, value) {
    let tb = []
    if (field === "country") {
      states.forEach(s => {
        if (s.country === value) {
          tb.push({ key: s.key, name: s.name, value: s.value })
        }
      })
      setStateName(tb)
    }

    if (field === "state") {
      cities.forEach(c => {
        if (c.state === value) {
          tb.push({ key: c.key, name: c.name, value: c.value })
        }
      })
      setCityState(tb)
    }

  }

  function handleListProjects() {
    dialog.current.open();
  }

  return <>

    <form action={formAction} className="rounded-lg text-green-50 p-4" ref={scope}>


      <div className="flex justify-between gap-2">
        <Input label="Pays actuel *" type="text" defaultValue={data?.country} name="actualCountry" placeholder="Pays" className="border border-green-950" readOnly />
        <Select label="Pays *" name="country" selectedTitle="Sélectionner un pays" data={countries} ref={selectCountry} onChange={(event) => handleChange("country", event.target.value)} />
      </div>

      <div className="flex justify-between gap-2">
        <Input label="Région actuelle" type="text" defaultValue={data?.state} name="actualState" placeholder="Région actuelle" className="border border-green-950" readOnly />
        <Select label="Région *" name="state" selectedTitle="Sélectionner une région" data={stateName} ref={selectState} onChange={(event) => handleChange("state", event.target.value)} />
      </div>

      <div className="flex justify-between gap-2">
        <Input label="Ville actuelle" type="text" defaultValue={data?.city} name="actualCity" placeholder="Ville actuelle" className="border border-green-950" readOnly />
        <Select label="Ville *" name="city" selectedTitle="Sélectionner une ville" data={cityState} ref={selectCity} />
      </div>


      <div className="flex justify-between gap-2">
        <Input label="Genre actuel" type="text" defaultValue={data?.gender} name="actualGender" placeholder="Genre actuelle" className="border border-green-950" readOnly />
        <Select label="Genre *" name="gender" selectedTitle="Sélectionner un genre" data={genders} ref={selectGender} />
      </div>

      <div className="flex justify-between gap-2">
        <Input label="Type actuel" type="text" defaultValue={data?.typeBeneficiary} name="actualTypeBeneficiary" placeholder="Type actuel" className="border border-green-950" readOnly />
        <Select label="Type *" name="typeBeneficiary" selectedTitle="Sélectionner un type de bénéficiaire" data={typeBeneficiaries} ref={selectType} />
      </div>

      <div className="flex justify-between gap-2">
        <Input label="Catégorie act." type="text" defaultValue={data?.categorySocioEconomic} name="actualCategorySocioEconomic" placeholder="Catégorie actuelle" className="border border-green-950" readOnly />
        <Select label="Catégorie *" name="categorySocioEconomic" selectedTitle="Sélectionner une catégorie socio-économique" data={categorySocioEconomics} ref={selectCategory} />
      </div>

      <div className="flex justify-between gap-2">
        <Input label="Addresse *" type="text" defaultValue={data?.address} name="address" placeholder="Addresse" className="border border-green-950" onBlur={(event) => handleBlur("address", event.target.value)} ref={inputAddress} />
        <Input label="E-mail *" type="text" defaultValue={data?.email} name="email" placeholder="E-mail" className="border border-green-950" onBlur={(event) => handleBlur("email", event.target.value)} ref={inputEmail} />
      </div>

      <div className="flex justify-between gap-2">
        <Input label="Nom *" type="text" defaultValue={data?.lastName} name="lastName" placeholder="Nom" className="border border-green-950" onBlur={(event) => handleBlur("lastName", event.target.value)} ref={inputLastName} />
        <Input label="Prénom " type="text" defaultValue={data?.firstName} name="firstName" placeholder="Prénom" className="border border-green-950" onBlur={(event) => handleBlur("firstName", event.target.value)} ref={inputFirstName} />
      </div>

      <div className="flex justify-between gap-2">
        <Input label="Tél. *" type="text" defaultValue={data?.phone} name="phone" placeholder="Nº de téléphone" className="border border-green-950" onBlur={(event) => handleBlur("phone", event.target.value)} ref={inputPhone} />
        <Input label="Tél. 2" type="text" defaultValue={data?.phone2} name="phone2" placeholder="Nº de téléphone" className="border border-green-950" onBlur={(event) => handleBlur("phone2", event.target.value)} ref={inputPhone2} />
      </div>

      <div className="flex justify-between gap-2">
        <Input label="C.N.I. *" type="text" defaultValue={data?.idCard} name="idCard" placeholder="Nº C.N.I." className="border border-green-950" onBlur={(event) => handleBlur("idCard", event.target.value)} ref={inputIdCard} />
        <Input label="Délivrée le *" type="date" defaultValue={data?.dateObtention} name="dateObtention" placeholder="Date de délivrance" className="border border-green-950" onBlur={(event) => handleBlur("dateObtention", event.target.value)} ref={inputDateObtention} />
      </div>

      <div className="flex justify-between gap-2">
        <Input label="Délivrée à *" type="text" defaultValue={data?.placeObtention} name="placeObtention" placeholder="Lieu de délivrance" className="border border-green-950" onBlur={(event) => handleBlur("placeObtention", event.target.value)} ref={inputPlaceObtention} />
        <Input label="Délivrée par *" type="text" defaultValue={data?.commissaire} name="commissaire" placeholder="Délégué" className="border border-green-950" onBlur={(event) => handleBlur("commissaire", event.target.value)} ref={inputCommissaire} />
      </div>



      {user.role.includes("ROLE_AGENT") && <Submit>
        Enregistrer
      </Submit>}

    </form>
    <Submit onClick={handleListProjects}>
      Liste des segments
    </Submit>

    <AnimatePresence>
      <Modal ref={dialog} size="lg:h-8/11 lg:w-8/15" title="Liste des segments">
        <ProjectList />
      </Modal>
    </AnimatePresence>
  </>
}