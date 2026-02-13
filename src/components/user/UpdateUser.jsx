

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { activateUser, getAuthoritiByUsername, getEnterpriseBySlug, getUserById } from "../../utils/http";
import Input from "../../layout/Input.jsx"
import Submit from "../../layout/Submit.jsx"
import { noteActions } from "../../store/noteSlice.js";
import responseHttp from "../../utils/responseHttp.js"
import Modal from "../../layout/Modal.jsx";
import AttributeRole from "./AttributeRole.jsx";
import ReinitialisationUser from "./ReinitilisationUser.jsx";

export default function UpdateUser() {
    const id = useSelector(state => state.modal.value)
    const userData = JSON.parse(localStorage.getItem("user"))

    const inputPersonal = useRef();
    const inputLastName = useRef();
    const inputFirstName = useRef();
    const inputUsername = useRef();
    const inputPhone = useRef();
    const inputEmail = useRef();
    const inputEnabled = useRef();
    const inputConnected = useRef();
    const dialog = useRef()
    const dialog1 = useRef()


    const dispatch = useDispatch();
    const [data, setData] = useState({
        user: {},
        connected: false,
        authorities: [],
        isAttribute: false,
    })


    useEffect(() => {
        if (id !== "") {
            let connected = false
            let isAttribute = false
            async function get(signal) {
                const user = await getUserById({ id, signal })
                if (user.username === userData.username) {
                    connected = true
                }
                const authorities = await getAuthoritiByUsername(user.username)
                const enterprise = await getEnterpriseBySlug({ slug: user.username, signal })
                let tb = [enterprise]
                if (tb[0].includes("Impossible de recupérer les données")) {
                    isAttribute = true
                }
                setData(prev => {
                    return {
                        ...prev,
                        user,
                        connected,
                        authorities,
                        isAttribute,
                    }
                })
            }
            get()
        }

    }, [id])

    async function handleClick(identifer, value) {
        if (identifer === "enabled") {
            if (value === "on") {
                const responseData = await activateUser(data?.user?.username)
                const state = responseHttp(responseData);
                if (state) {
                    dispatch(noteActions.error(true))
                } else {
                    dispatch(noteActions.error(false))
                }
                dispatch(noteActions.show());
                dispatch(noteActions.relaunch());
                dispatch(noteActions.sendData(responseData))

            }

            if (value === "off") {
                const responseData = await activateUser(data?.user?.username)
                const state = responseHttp(responseData);
                if (state) {
                    dispatch(noteActions.error(true))
                } else {
                    dispatch(noteActions.error(false))
                }
                dispatch(noteActions.show());
                dispatch(noteActions.relaunch());
                dispatch(noteActions.sendData(responseData))

            }
        }
    }

    function handleOpenModal(identifier) {
        if (identifier === "role") {
            dialog.current.open()
        } else if (identifier === "reinitialisation") {
            dialog1.current.open()
        }

    }


    return <>

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg text-sky-50 p-4" >

            <div className="flex justify-between gap-2">
                <Input label="Nom" id="lastName" type="text" defaultValue={data?.user?.lastName} name="lastName" placeholder="Nom" className="border border-sky-950" ref={inputLastName} />
                <Input label="Prénom" id="firstName" type="text" defaultValue={data?.user?.firstName} name="firstName" placeholder="Prénom" className="border border-sky-950" ref={inputFirstName} />
            </div>
            <div className="flex justify-between gap-2">
                <Input label="Login" id="username" type="text" defaultValue={data?.user?.username} name="username" placeholder="Login" className="border border-sky-950" ref={inputUsername} />
                <Input label="Employé" id="personal" type="number" defaultValue={data?.user?.personal} name="personal" placeholder="Employé" className="border border-sky-950" ref={inputPersonal} />
            </div>

            <div className="flex justify-between gap-2">
                <Input label="Email" id="email" type="text" defaultValue={data?.user?.email} name="email" placeholder="Email" className="border border-sky-950" ref={inputEmail} />
                <Input label="phone" id="phone" type="text" defaultValue={data?.user?.phone} name="phone" placeholder="Tél." className="border border-sky-950" ref={inputPhone} />
            </div>

            {!data.connected && <div className="flex justify-between gap-2">
                <Input label="Actif" id="enabled" type="checkBox" checked={data?.user?.enabled} name="enabled" className="border border-sky-950" onClick={(e) => handleClick("enabled", e.target.value)} ref={inputEnabled} />
                <Input label="Connecté" id="connected" type="checkBox" checked={data?.user?.connected} name="connected" className="border border-sky-950" onClick={(e) => handleClick("connected", e.target.value)} ref={inputConnected} />
            </div>}

            {data.authorities.length > 0 && <div className="border flex justify-center mb-4">
                <table style={{ color: "black" }}>
                    <thead>
                        <tr className="bg-sky-950 text-sky-50">
                            <th style={{ border: "1px solid black", padding: "5px" }}>
                                id
                            </th>
                            <th style={{ border: "1px solid black", padding: "5px" }}>
                                Rôle
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.authorities.map(a => <tr key={a.id}>
                            <td style={{ border: "1px solid black", padding: "5px 100px" }}>{a.id}</td>
                            <td style={{ border: "1px solid black", padding: "5px 100px" }}>{a.name}</td>
                        </tr>)}
                    </tbody>
                </table>
            </div>}

            <div className="flex justify-center gap-4">
                {data.isAttribute && <Submit onClick={() => handleOpenModal("role")}>
                    Attribuer un rôle
                </Submit>}
                {!data?.connected && <Submit onClick={() => handleOpenModal("reinitialisation")}>
                    Réinitialiser
                </Submit>}
            </div>
        </div>

        <Modal ref={dialog} size="lg:h-3/11 lg:w-4/15" title="Attribuer un rôle" >
            <AttributeRole username={data?.user?.username} />
        </Modal>

        <Modal ref={dialog1} size="lg:h-3/15 lg:w-5/16" title="Réinitialiser le mot de passe" >
            <ReinitialisationUser username={data?.user?.username} />
        </Modal>


    </>

}