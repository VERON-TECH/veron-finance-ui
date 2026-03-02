import { faFolderOpen } from "@fortawesome/free-regular-svg-icons";
import { faFileImport } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { downloadInventory, uploadEntity } from "../../utils/http";
import responseHttp from "../../utils/responseHttp";
import { useDispatch } from "react-redux";
import { noteActions } from "../../store/noteSlice";
import { modalActions } from "../../store/modalSlice";
import { useState } from "react";

export default function CreateInventory() {
    const dispatch = useDispatch()
    const [file, setFile] = useState(null)
    async function handleClick(value) {
        if (value === "Etat initial") {
            const responseData = await downloadInventory()
            const url = window.URL.createObjectURL(responseData);
            const a = document.createElement("a");
            a.href = url;
            a.download = "stocks.xlsx";
            a.click();
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()
        const formData = new FormData()
        formData.append("file", file)
        const responseData = await uploadEntity(formData, "inventory")
        const state = responseHttp(responseData);
        if (state) {
            dispatch(noteActions.error(true))
        } else {
            dispatch(noteActions.error(false))
            dispatch(modalActions.updateClose())
        }
        dispatch(noteActions.show());
        dispatch(noteActions.relaunch());
        dispatch(noteActions.sendData(responseData))
    }

    function handleChange(e) {
        setFile(e.target.files[0]);
    }


    return <div className="flex justify-center gap-8">
        <motion.button whileHover={{ scale: 1.1 }} className="bg-sky-950 h-20 w-1/3 text-sky-50 font-medium rounded shadow-sky-950 shadow-md cursor-pointer border border-2" onClick={(e) => handleClick(e.target.textContent)}>
            <FontAwesomeIcon icon={faFolderOpen} className="me-2" />
            Etat initial
        </motion.button>
        <motion.form onSubmit={handleSubmit} className="flex flex-col justify-center gap-4 items-center bg-sky-950 h-20 w-2/3 text-sky-50 font-medium rounded shadow-sky-950 shadow-md cursor-pointer border border-2" encType="multipart/form-data">
            <input type="file" name="file" onChange={handleChange} className="bg-sky-50 text-sky-950 py-1 px-5 rounded" />
            <button className="bg-sky-50 text-sky-950 py-1 px-5 rounded">
                <FontAwesomeIcon icon={faFileImport} className="me-2" />
                Importer
            </button>
        </motion.form>

    </div>
}