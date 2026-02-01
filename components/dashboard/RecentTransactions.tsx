
interface Transaction {
    id: string;
    user: string;
    type: string;
    amount: string;
    status: string;
    date: string;
}

export default function RecentTransactions({ transactions }: { transactions: any[] }) {
    if (!transactions || transactions.length === 0) return (
        <div className="py-20 text-center">
            <p className="text-zinc-400 font-bold uppercase text-xs tracking-widest">No recent financial activity</p>
        </div>
    );

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-zinc-50">
                        <th className="pb-6 text-[10px] font-black text-zinc-300 uppercase tracking-widest">User / ID</th>
                        <th className="pb-6 text-[10px] font-black text-zinc-300 uppercase tracking-widest">Transaction Type</th>
                        <th className="pb-6 text-[10px] font-black text-zinc-300 uppercase tracking-widest">Amount</th>
                        <th className="pb-6 text-[10px] font-black text-zinc-300 uppercase tracking-widest">Status</th>
                        <th className="pb-6 text-[10px] font-black text-zinc-300 uppercase tracking-widest text-right">Date</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                    {transactions.map((tx) => (
                        <tr key={tx.id} className="group hover:bg-zinc-50/50 transition-colors">
                            <td className="py-5">
                                <span className="font-black text-zinc-900 leading-none">@{tx.user || "unknown"}</span>
                            </td>
                            <td className="py-5">
                                <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${tx.type === 'Withdrawal' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                                    }`}>
                                    {tx.type}
                                </span>
                            </td>
                            <td className="py-5">
                                <span className="font-black text-zinc-900">{tx.amount ? `$${tx.amount}` : "$0.00"}</span>
                            </td>
                            <td className="py-5">
                                <span className={`text-[10px] font-black uppercase tracking-widest ${tx.status === 'completed' || tx.status === 'SUCCESS' ? 'text-green-500' : 'text-zinc-400'
                                    }`}>
                                    {tx.status || 'PENDING'}
                                </span>
                            </td>
                            <td className="py-5 text-right text-zinc-400 font-bold text-xs">
                                {new Date(tx.date).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
