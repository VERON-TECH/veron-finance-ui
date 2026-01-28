import { useMutation } from "@tanstack/react-query";
import { queryClient, uploadEntities } from "../../utils/http";
import responseHttp from "../../utils/responseHttp";
import { noteActions } from "../../store/noteSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";

export default function CardImport({ title }) {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);


  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file)
    mutate({ criteria: "beneficiary", formData })

  }

  const { mutate } = useMutation({
    mutationFn: uploadEntities,
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


  function handleChange(e) {
    setFile(e.target.files[0]);
  }


  return <div className="flex flex-col gap-2 w-1/4 h-32 bg-green-950 text-green-50 p-2 rounded shadow-xl shadow-green-950">
    <header className="flex-1/5 flex justify-center items-center bg-green-50 text-green-950 rounded text-center text-base text-shadow-2xs font-medium p-1">{title}</header>
    <form className="flex flex-col gap-2" onSubmit={handleSubmit} encType="multipart/form-data">
      <div className="flex-1/5 flex justify-center ">
        <input type="file" name="file" className=" bg-green-50 text-green-950 font-bold rounded p-1 cursor-pointer w-full" onChange={handleChange} />
      </div>
      <div className="flex-1/5 flex justify-center bg-green-50 rounded p-1">
        <button className="cursor-pointer bg-green-950 text-green-50 rounded border border-green-50 px-5 py-1">Importer</button>
      </div>
    </form>

  </div>
}