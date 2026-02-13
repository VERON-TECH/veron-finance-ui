import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getPersonalById } from "../../utils/http";

export default function CashReportPage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const print = useSelector(state => state.print);


    useEffect(() => {
        async function get(signal) {
            const personal = await getPersonalById({ id: user.id, signal })
        }
        get()
    }, [])



    return <div className="p-4">
        <div className="flex justify-between">
            <div className="font-bold" >{print.enterprise}</div>
            <div className="font-bold" ><span>Date: </span><span>{print.date}</span></div>
        </div>
        <div className="flex justify-center font-bold mb-1">
            <p>COMPTE RENDU DE CAISSE</p>
        </div>
        <div className="flex justify-between mb-2">
            <div ><span className="font-bold me-2">Agence: </span><span>{print?.agency}</span></div>
            <div><span className="font-bold me-2">Responsable: </span><span >{print?.personal}</span></div>
        </div>
        <div className="flex justify-end font-bold">
            <p><span className="font-bold me-2">Solde initial: </span><span>{print.initial}</span></p>
        </div>
        <div >
            <table className="w-full">
                <thead className="text-sky-50 bg-sky-950">
                    <tr>
                        <th className="text-center border border-sky-50">Type</th>
                        <th className="text-center border border-sky-50">Encaissement</th>
                        <th className="text-center border border-sky-50">Décaissement</th>
                    </tr>

                </thead>
                <tbody>
                    {print?.data && print.data.map(d => <tr key={d.ref}>
                        <td className="font-bold border border-sky-950 text-start"> {d.type}</td>
                        <td className="border border-sky-950 text-end py-1"> {d.sens == "ENCAISSEMENT" ? d.amount.toLocaleString() : 0}</td>
                        <td className="border border-sky-950 text-end py-1">{d.sens == "DECAISSEMENT" ? d.amount.toLocaleString() : 0}</td>
                    </tr>)}

                </tbody>
                <tfoot className="bg-sky-950 text-sky-50">
                    <tr>
                        <td className="font-bold border py-1">Total Général</td>
                        <td className="font-bold text-end border py-1">{print?.incoming.toLocaleString()}</td>
                        <td className="font-bold text-end border py-1"> {print?.outgoing.toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td className="font-bold border py-1"> Solde final</td>
                        <td className="font-bold border py-1"></td>
                        <td className="font-bold text-end border py-1">{print.balance.toLocaleString()}</td>
                    </tr>

                </tfoot>
            </table>
        </div>
    </div>
}
