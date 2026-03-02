import { useSelector } from "react-redux"

export default function PrintReportPage() {
    const print = useSelector(state => state.print)

    return (
        <div className="p-8 bg-gray-50 min-h-screen text-gray-800">

            {/* HEADER */}
            <div className="bg-white shadow-md rounded-2xl p-6 mb-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-sky-900">
                            {print.enterprise.name}
                        </h1>
                        <p className="text-gray-500">
                            {print.agency.name}
                        </p>
                    </div>

                    <div className="text-center border border-sky-900 px-6 py-3 rounded-xl">
                        <h2 className="text-xl font-bold text-sky-900">
                            BILAN PÉRIODIQUE
                        </h2>
                        <p className="text-sm text-gray-600">
                            Du {print.period.startDate} au {print.period.endDate}
                        </p>
                    </div>

                    <div className="text-right text-sm text-gray-500">
                        Fait le {print.date}
                    </div>
                </div>
            </div>

            {/* PRODUITS & SERVICES */}
            <div className="bg-white shadow-md rounded-2xl p-6 mb-8">
                <h3 className="text-lg font-semibold mb-4 text-sky-900">
                    Produits & Services
                </h3>

                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr className="bg-sky-900 text-white">
                            <th className="p-3 text-left">Désignation</th>
                            <th className="p-3 text-right">Nombre</th>
                            <th className="p-3 text-right">Montant</th>
                        </tr>
                    </thead>
                    <tbody>

                        {/* Categories */}
                        <tr className="bg-gray-100">
                            <td colSpan="3" className="p-3 font-bold">
                                Classement par Catégorie
                            </td>
                        </tr>

                        {print?.categories.map(c => (
                            <tr key={c.key} className="border-b">
                                <td className="p-3">{c.name}</td>
                                <td className="p-3 text-right">
                                    {Number(c.number).toLocaleString()}
                                </td>
                                <td className="p-3 text-right">
                                    {Number(c.amount).toLocaleString()}
                                </td>
                            </tr>
                        ))}

                        {/* Services */}
                        <tr className="bg-gray-100">
                            <td colSpan="3" className="p-3 font-bold">
                                Classement par Service
                            </td>
                        </tr>

                        {print?.services.map(s => (
                            <tr key={s.key} className="border-b">
                                <td className="p-3">
                                    {s.category} - {s.name}
                                </td>
                                <td className="p-3 text-right">
                                    {Number(s.number).toLocaleString()}
                                </td>
                                <td className="p-3 text-right">
                                    {Number(s.amount).toLocaleString()}
                                </td>
                            </tr>
                        ))}

                        <tr className="bg-sky-900 text-white font-bold">
                            <td className="p-3 text-right" colSpan="2">
                                Total Produits & Services
                            </td>
                            <td className="p-3 text-right">
                                {Number(print.amountService).toLocaleString()}
                            </td>
                        </tr>

                    </tbody>
                </table>
            </div>

            {/* CHARGES */}
            <div className="bg-white shadow-md rounded-2xl p-6 mb-8">
                <h3 className="text-lg font-semibold mb-4 text-sky-900">
                    Charges
                </h3>

                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr className="bg-sky-900 text-white">
                            <th className="p-3 text-left">Désignation</th>
                            <th className="p-3 text-right">Montant</th>
                        </tr>
                    </thead>
                    <tbody>
                        {print.spend.map(s => (
                            <tr key={s.key} className="border-b">
                                <td className="p-3">{s.name}</td>
                                <td className="p-3 text-right">
                                    {Number(s.amount).toLocaleString()}
                                </td>
                            </tr>
                        ))}

                        <tr className="bg-sky-900 text-white font-bold">
                            <td className="p-3 text-right">
                                Total Charges
                            </td>
                            <td className="p-3 text-right">
                                {Number(print.amountSpent).toLocaleString()}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* RÉSULTAT */}
            <div className="bg-white shadow-md rounded-2xl p-6 mb-8 max-w-md ml-auto">
                <h3 className="text-lg font-semibold mb-4 text-sky-900">
                    Résultat des Activités
                </h3>

                <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span>Total Produits</span>
                        <span>{Number(print.amountService).toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Total Charges</span>
                        <span>{Number(print.amountSpent).toLocaleString()}</span>
                    </div>

                    <div className={`flex justify-between font-bold text-lg ${print.difference >= 0 ? "text-green-600" : "text-red-600"
                        }`}>
                        <span>Résultat Net</span>
                        <span>{Number(print.difference).toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* SIGNATURES */}
            <div className="flex justify-end gap-24 mt-12 text-center">
                <div>
                    <p className="font-semibold">Comptable</p>
                    <div className="h-16"></div>
                </div>

                <div>
                    <p className="font-semibold">Directeur Général</p>
                    <div className="h-16"></div>
                </div>
            </div>

        </div>
    )
}