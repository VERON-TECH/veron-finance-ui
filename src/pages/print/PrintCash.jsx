import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getPersonalById } from "../../utils/http";

export default function CashReportPage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const print = useSelector(state => state.print);

    useEffect(() => {
        const controller = new AbortController();

        async function get(signal) {
            await getPersonalById({ id: user.id, signal: controller.signal });
        }

        get();

        return () => controller.abort();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
            <div className="bg-white w-full max-w-5xl shadow-xl rounded-2xl p-8">

                {/* HEADER */}
                <div className="flex justify-between items-center border-b pb-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-sky-900">
                            {print.enterprise}
                        </h1>
                        <p className="text-sm text-gray-500">
                            Agence : {print?.agency}
                        </p>
                    </div>

                    <div className="text-right">
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-semibold text-sky-900">{print.date}</p>
                    </div>
                </div>

                {/* TITLE */}
                <div className="text-center mb-8">
                    <h2 className="text-xl font-bold tracking-wide text-gray-800">
                        COMPTE RENDU DE CAISSE
                    </h2>
                    <p className="text-sm text-gray-500">
                        Responsable : {print?.personal}
                    </p>
                </div>

                {/* SUMMARY CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-sky-50 p-4 rounded-xl shadow">
                        <p className="text-sm text-gray-500">Solde initial</p>
                        <p className="text-lg font-bold text-sky-900">
                            {print?.initial?.toLocaleString()}
                        </p>
                    </div>

                    <div className="bg-green-50 p-4 rounded-xl shadow">
                        <p className="text-sm text-gray-500">Encaissements</p>
                        <p className="text-lg font-bold text-green-700">
                            {print?.incoming?.toLocaleString()}
                        </p>
                    </div>

                    <div className="bg-red-50 p-4 rounded-xl shadow">
                        <p className="text-sm text-gray-500">Décaissements</p>
                        <p className="text-lg font-bold text-red-700">
                            {print?.outgoing?.toLocaleString()}
                        </p>
                    </div>

                    <div className="bg-gray-900 p-4 rounded-xl shadow">
                        <p className="text-sm text-gray-300">Solde final</p>
                        <p className="text-lg font-bold text-white">
                            {print?.balance?.toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* TABLE */}
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse rounded-xl overflow-hidden">
                        <thead>
                            <tr className="bg-sky-900 text-white text-sm">
                                <th className="py-3 px-4 text-left">Type</th>
                                <th className="py-3 px-4 text-right">Encaissement</th>
                                <th className="py-3 px-4 text-right">Décaissement</th>
                            </tr>
                        </thead>
                        <tbody>
                            {print?.data?.map(d => (
                                <tr
                                    key={d.ref}
                                    className="border-b hover:bg-gray-50 transition"
                                >
                                    <td className="py-2 px-4 font-medium text-gray-700">
                                        {d.type}
                                    </td>
                                    <td className="py-2 px-4 text-right text-green-600">
                                        {d.sens === "ENCAISSEMENT"
                                            ? d.amount.toLocaleString()
                                            : "-"}
                                    </td>
                                    <td className="py-2 px-4 text-right text-red-600">
                                        {d.sens === "DECAISSEMENT"
                                            ? d.amount.toLocaleString()
                                            : "-"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}