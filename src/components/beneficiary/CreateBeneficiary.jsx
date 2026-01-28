import Submit from "../../layout/Submit.jsx";
import { isEmail, isNotEmpty } from "../../utils/validation.jsx";
import { useActionState, useRef, useState, } from "react";
import { addBeneficiary, queryClient } from "../../utils/http.js";
import Input from "../../layout/Input.jsx"
import Select from "../../layout/Select.jsx";
import { useMutation } from "@tanstack/react-query";
import { noteActions } from "../../store/noteSlice.js";
import { useDispatch } from "react-redux";
import responseHttp from "../../utils/responseHttp.js";
import { useAnimate } from "framer-motion";
import { categorySocioEconomics, cities, countries, genders, states, typeBeneficiaries } from "../../data/extraInfo.js";

export default function CreateBeneficiary() {
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
  const selectState = useRef();
  const selectCountry = useRef();
  const selectGender = useRef();
  const dispatch = useDispatch();
  const [scope, animate] = useAnimate();
  const [cityState, setCityState] = useState([]);
  const [stateName, setStateName] = useState([]);

  async function handleSubmit(prevState, formData) {
    const allData = Object.fromEntries(formData.entries())
    let errors = [];

    const email = formData.get("email")
    const placeObtention = formData.get("placeObtention")
    const commissaire = formData.get("commissaire")
    const dateObtention = formData.get("dateObtention")
    const idCard = formData.get("idCard")
    const phone2 = formData.get("phone2")
    const phone = formData.get("phone")
    const firstName = formData.get("firstName")
    const lastName = formData.get("lastName")
    const categorySocioEconomic = formData.get("categorySocioEconomic")
    const typeBeneficiary = formData.get("typeBeneficiary")
    const address = formData.get("address")
    const city = formData.get("city")
    const state = formData.get("state")
    const country = formData.get("country")
    const gender = formData.get("gender")


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

    if (categorySocioEconomic === null) {
      animate(selectCategory.current, { x: [0, 15, 0] }, { bounce: 0.75 })
      errors.push("La catégorie socio-économique du bénéficiaire est obligatoire !")
    }

    if (typeBeneficiary === null) {
      animate(selectType.current, { x: [0, 15, 0] }, { bounce: 0.75 })
      errors.push("Le type de bénéficiaire est obligatoire !")
    }

    if (!isNotEmpty(address)) {
      animate(inputAddress.current, { x: [0, 15, 0] }, { bounce: 0.75 })
      errors.push("L'addresse du bénéficiaire est obligatoire !")
    }


    if (typeBeneficiary === null) {
      animate(selectType.current, { x: [0, 15, 0] }, { bounce: 0.75 })
      errors.push("Le type de bénéficiaire est obligatoire !")
    }

    if (country === null) {
      animate(selectCountry.current, { x: [0, 15, 0] }, { bounce: 0.75 })
      errors.push("Le nom du pays est obligatoire !")
    }

    if (state === null) {
      animate(selectState.current, { x: [0, 15, 0] }, { bounce: 0.75 })
      errors.push("Le nom de la région est obligatoire !")
    }

    if (city === null) {
      animate(selectCity.current, { x: [0, 15, 0] }, { bounce: 0.75 })
      errors.push("Le nom de la ville est obligatoire !")
    }

    if (gender === null) {
      animate(selectGender.current, { x: [0, 15, 0] }, { bounce: 0.75 })
      errors.push("Le genre du bénéficiaire est obligatoire !")
    }


    if (errors.length > 0) {
      dispatch(noteActions.show());
      dispatch(noteActions.error(true));
      dispatch(noteActions.relaunch());
      dispatch(noteActions.sendData(errors))

      return {
        errors, enteredValue: {
          address,
          lastName,
          firstName,
          phone,
          phone2,
          idCard,
          commissaire,
          placeObtention,
          email
        }
      }
    }

    mutate(allData)
    return { errors: null }
  }


  const [formState, formAction] = useActionState(handleSubmit, { errors: null })


  const { mutate } = useMutation({
    mutationFn: addBeneficiary,
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

  return <>

    <form action={formAction} className="rounded-lg text-green-50 p-4" ref={scope}>


      <div className="flex justify-between gap-2">
        <Select label="Pays *" id="country" name="country" selectedTitle="Sélectionner un pays" data={countries} ref={selectCountry} onChange={(event) => handleChange("country", event.target.value)} />
        <Select label="Région *" id="state" name="state" selectedTitle="Sélectionner une région" data={stateName} ref={selectState} onChange={(event) => handleChange("state", event.target.value)} />

      </div>

      <div className="flex justify-between gap-2">
        <Select label="Ville *" id="city" name="city" selectedTitle="Sélectionner une ville" data={cityState} ref={selectCity} />
        <Select label="Genre *" id="gender" name="gender" selectedTitle="Sélectionner un genre" data={genders} ref={selectGender} />

      </div>


      <div className="flex justify-between gap-2">
        <Select label="Type *" id="typeBeneficiary" name="typeBeneficiary" selectedTitle="Sélectionner un type de bénéficiaire" data={typeBeneficiaries} ref={selectType} />
        <Select label="Catégorie *" id="categorySocioEconomic" name="categorySocioEconomic" selectedTitle="Sélectionner une catégorie socio-économique" data={categorySocioEconomics} ref={selectCategory} />
      </div>

      <div className="flex justify-between gap-2">
        <Input label="Addresse *" type="text" defaultValue={formState.enteredValue?.address} name="address" placeholder="Addresse" className="border border-green-950" onBlur={(event) => handleBlur("address", event.target.value)} ref={inputAddress} />
        <Input label="E-mail *" type="text" defaultValue={formState.enteredValue?.email} name="email" placeholder="E-mail" className="border border-green-950" onBlur={(event) => handleBlur("email", event.target.value)} ref={inputEmail} />
      </div>

      <div className="flex justify-between gap-2">
        <Input label="Nom *" type="text" defaultValue={formState.enteredValue?.lastName} name="lastName" placeholder="Nom" className="border border-green-950" onBlur={(event) => handleBlur("lastName", event.target.value)} ref={inputLastName} />
        <Input label="Prénom " type="text" defaultValue={formState.enteredValue?.firstName} name="firstName" placeholder="Prénom" className="border border-green-950" onBlur={(event) => handleBlur("firstName", event.target.value)} ref={inputFirstName} />
      </div>

      <div className="flex justify-between gap-2">
        <Input label="Tél. *" type="text" defaultValue={formState.enteredValue?.phone} name="phone" placeholder="Nº de téléphone" className="border border-green-950" onBlur={(event) => handleBlur("phone", event.target.value)} ref={inputPhone} />
        <Input label="Tél. 2" type="text" defaultValue={formState.enteredValue?.phone2} name="phone2" placeholder="Nº de téléphone" className="border border-green-950" onBlur={(event) => handleBlur("phone2", event.target.value)} ref={inputPhone2} />
      </div>

      <div className="flex justify-between gap-2">
        <Input label="C.N.I. *" type="text" defaultValue={formState.enteredValue?.idCard} name="idCard" placeholder="Nº C.N.I." className="border border-green-950" onBlur={(event) => handleBlur("idCard", event.target.value)} ref={inputIdCard} />
        <Input label="Délivrée le *" type="date" name="dateObtention" placeholder="Date de délivrance" className="border border-green-950" onBlur={(event) => handleBlur("dateObtention", event.target.value)} ref={inputDateObtention} />
      </div>

      <div className="flex justify-between gap-2">
        <Input label="Délivrée à *" type="text" defaultValue={formState.enteredValue?.placeObtention} name="placeObtention" placeholder="Lieu de délivrance" className="border border-green-950" onBlur={(event) => handleBlur("placeObtention", event.target.value)} ref={inputPlaceObtention} />
        <Input label="Délivrée par *" type="text" defaultValue={formState.enteredValue?.commissaire} name="commissaire" placeholder="Délégué" className="border border-green-950" onBlur={(event) => handleBlur("commissaire", event.target.value)} ref={inputCommissaire} />
      </div>



      <Submit>
        Créer
      </Submit>
    </form>


  </>
}