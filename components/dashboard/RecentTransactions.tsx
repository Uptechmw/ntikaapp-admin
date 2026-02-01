
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
            <p className="text-zinc-400 font-bold uppercase text-xs tracking-widest">No recent audit logs available</p>
        </div>
    );

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-zinc-50">
                        <th className="pb-6 text-[10px] font-black text-zinc-300 uppercase tracking-widest">Entity / Subject</th>
                        <th className="pb-6 text-[10px] font-black text-zinc-300 uppercase tracking-widest">Activity Type</th>
                        <th className="pb-6 text-[10px] font-black text-zinc-300 uppercase tracking-widest">Magnitude</th>
                        <th className="pb-6 text-[10px] font-black text-zinc-300 uppercase tracking-widest">Timestamp</th>
                        <th className="pb-6 text-[10px] font-black text-zinc-300 uppercase tracking-widest text-right">Audit</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                    {transactions.map((tx) => (
                        <tr key={tx.id} className="group hover:bg-zinc-50/50 transition-colors">
                            <td className="py-5">
                                <span className="font-black text-zinc-900 leading-none">{tx.user || tx.userId || "System"}</span>
                            </td>
                            <td className="py-5">
                                <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${tx.type?.includes('Premium') ? 'bg-orange-50 text-orange-600' : 'bg-zinc-100 text-zinc-600'
                                    }`}>
                                    {tx.type || "Interaction"}
                                </span>
                            </td>
                            <td className="py-5">
                                <span className="font-black text-zinc-900">{tx.amount ? `$${tx.amount}` : "--"}</span>
                            </td>
                            <td className="py-5 text-zinc-400 font-bold text-xs">
                                {new Date(tx.date || tx.timestamp).toLocaleDateString()}
                            </td>
                            <td className="py-5 text-right">
                                <button className="p-2 bg-white border border-zinc-100 rounded-lg text-zinc-400 hover:text-zinc-950 hover:border-zinc-300 transition-all">
                                    <span className="text-[10px] font-black uppercase tracking-widest px-2">Inspect</span>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
