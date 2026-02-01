
interface Transaction {
    id: string;
    user: string;
    type: string;
    amount: string;
    status: string;
    date: string;
}

export default function RecentTransactions({ transactions }: { transactions: Transaction[] }) {
    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Recent Transactions</h3>
                <button className="text-sm text-purple-600 font-bold hover:text-purple-700">View All</button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-gray-400 text-xs uppercase tracking-wider">
                            <th className="pb-4 font-medium">User</th>
                            <th className="pb-4 font-medium">Type</th>
                            <th className="pb-4 font-medium">Amount</th>
                            <th className="pb-4 font-medium">Status</th>
                            <th className="pb-4 font-medium text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {transactions.map((tx) => (
                            <tr key={tx.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                <td className="py-4 font-bold text-gray-900">{tx.user}</td>
                                <td className="py-4 text-gray-500">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${tx.type === 'Premium Sub' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                                        }`}>
                                        {tx.type}
                                    </span>
                                </td>
                                <td className="py-4 font-bold text-gray-900">{tx.amount}</td>
                                <td className="py-4 text-gray-500">{tx.date}</td>
                                <td className="py-4 text-right">
                                    <button className="text-purple-600 hover:text-purple-800 text-xs font-bold">View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
