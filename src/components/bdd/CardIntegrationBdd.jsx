import { useRef, useState } from "react"
import { uploadEntity } from "../../utils/http";
import responseHttp from "../../utils/responseHttp";
import { noteActions } from "../../store/noteSlice";
import { useDispatch } from "react-redux";

export default function CardIntegrationBdd({ name, type }) {
    const [file, setFile] = useState(null);
    const dispatch = useDispatch()
    const form = useRef()
    async function handleSubmit(e) {
        e.preventDefault();
        let responseData;
        const formData = new FormData();
        formData.append("file", file);
        responseData = await uploadEntity(formData, type);



        const state = responseHttp(responseData);
        if (state) {
            dispatch(noteActions.error(true))
        } else {
            dispatch(noteActions.error(false))
            form.current.reset()
        }
        dispatch(noteActions.show());
        dispatch(noteActions.relaunch());
        dispatch(noteActions.sendData(responseData))


    }

    function handleChange(e) {
        setFile(e.target.files[0]);
    }

    return <div className="bg-sky-950 text-sky-50 w-1/5 h-24 shadow-md shadow-sky-950 border rounded font-bold items-center flex flex-col gap-2">
        <header className="w-full bg-sky-50 text-sky-950 border text-center rounded">{name}</header>
        <form onSubmit={handleSubmit} className="w-full flex items-center flex-col gap-2" encType="multipart/form-data" ref={form}>
            <input type="file" name="file" className="w-2/3 border bg-sky-50 text-sky-950 cursor-pointer rounded p-1" onChange={handleChange} />
            <button className="bg-sky-50 text-sky-950 rounded w-32 justify-center p-1 cursor-pointer">
                Importer
            </button>
        </form>

    </div>
}