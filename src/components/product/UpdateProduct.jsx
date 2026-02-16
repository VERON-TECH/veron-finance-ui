import { useMutation } from "@tanstack/react-query";
import { useAnimate } from "framer-motion";
import { useActionState, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEnterpriseById, getProductById, queryClient, updateProduct } from "../../utils/http";
import Select from "../../layout/Select.jsx"
import Input from "../../layout/Input.jsx"
import Submit from "../../layout/Submit.jsx"
import { isNotEmpty } from "../../utils/validation.jsx"
import { noteActions } from "../../store/noteSlice.js";
import responseHttp from "../../utils/responseHttp.js"
import { categoryProduct } from "../../data/info.js";

export default function UpdateProduct() {
    const id = useSelector(state => state.modal.value)
    const user = JSON.parse(localStorage.getItem("user"))
    const selectCategory = useRef();
    const inputName = useRef();
    const inputSellingPrice = useRef();
    const inputPrice = useRef();
    const inputSecurityStock = useRef();
    const dispatch = useDispatch();
    const [scope, animate] = useAnimate();
    const [data, setData] = useState({
        product: {}
    })


    useEffect(() => {
        if (id !== "" && id !== undefined) {
            async function getAll(signal) {
                const product = await getProductById({ signal, id })

                setData(prev => {
                    return {
                        ...prev,
                        product
                    }
                })

            }
            getAll()
        }

    }, [id])


    async function handleSubmit(prevState, formData, signal) {
        let errors = [];
        const name = formData.get("name")
        const actualCategory = formData.get("actualCategory")
        const category = formData.get("category")
        const price = formData.get("price")
        const sellingPrice = formData.get("sellingPrice")
        const securityStock = formData.get("securityStock")



        if (!isNotEmpty(name)) {
            animate(inputName.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez renseigner le nom.")
        }




        if (price <= 0) {
            animate(inputName.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("veuillez renseigner le prix.")
        }

        if (category === "PRODUITS" && sellingPrice < price) {
            animate(inputPrice.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            animate(selectCategory.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            errors.push("Le prix de vente doit être superieur au prix d'achat.")
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

        const product = await getProductById({ signal, id })
        const enterprise = await getEnterpriseById({ id: product.enterprise, signal })
        const productDto = {
            enterprise: enterprise.slug,
            category: actualCategory != category && category != null ? category : actualCategory,
            name,
            price,
            sellingPrice,
            securityStock
        }

        mutate({ slug: product.slug, productDto })
        return { errors: null }
    }


    const [formState, formAction] = useActionState(handleSubmit, { errors: null })


    const { mutate } = useMutation({
        mutationFn: updateProduct,
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
            queryClient.cancelQueries(["products"])
        }
    })





    function handleBlur(field, value) {


        if (field === "name") {
            if (!isNotEmpty(value)) {
                animate(inputName.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }

        if (field === "price") {
            if (value <= 0) {
                animate(inputPrice.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }

        if (field === "sellingPrice") {
            if (value <= 0) {
                animate(inputSellingPrice.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }

        if (field === "securityStock") {
            if (value <= 0) {
                animate(inputSecurityStock.current, { x: [0, 15, 0] }, { bounce: 0.75 })
            }
        }
    }




    return <>

        <form action={formAction} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg text-sky-50 p-4" ref={scope}>
            <div className="flex flex-col justify-between gap-2">
                <Input label="Categorie actuelle" type="text" defaultValue={data?.product.category} name="actualCategory" placeholder="Catégorie actuelle" className="border border-sky-950" readOnly />
                <Select label="Catégorie *" id="category" name="category" selectedTitle="Sélectionner une catégorie" data={categoryProduct} ref={selectCategory} />
                <Input label="Nom *" type="text" defaultValue={data?.product.name} name="name" placeholder="Nom de l'article" className="border border-sky-950" onBlur={(event) => handleBlur("name", event.target.value)} ref={inputName} />
                <Input label="Prix d'achat *" type="number" defaultValue={data?.product.price} name="price" placeholder="Prix de l'article" className="border border-sky-950" onBlur={(event) => handleBlur("price", event.target.value)} ref={inputPrice} />
                <Input label="Prix de vente *" type="number" defaultValue={data?.product.sellingPrice} name="sellingPrice" placeholder="Prix de vente de l'article" className="border border-sky-950" onBlur={(event) => handleBlur("sellingPrice", event.target.value)} ref={inputSellingPrice} />
                <Input label="Stock de sécurité *" type="number" defaultValue={data?.product.securityStock} name="securityStock" placeholder="Stock de sécurité" className="border border-sky-950" onBlur={(event) => handleBlur("securityStock", event.target.value)} ref={inputSecurityStock} />

            </div>

            {user.role.includes("ROLE_COMPTABLE") || user.role.includes("ROLE_COMPTABLE_MATIERE") ? <Submit>
                Enregistrer
            </Submit> : undefined}
        </form>


    </>

}