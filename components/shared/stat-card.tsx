import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const StatCard = ({ title, value, change, isPositive, icon: Icon, color }: any) => (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm text-gray-500 font-medium">{title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                <div className={`flex items-center mt-2 text-sm ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                    {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    <span className="font-medium">{change}</span>
                    <span className="text-gray-400 ml-1">vs last month</span>
                </div>
            </div>
            <div className={`p-3 rounded-lg ${color}`}>
                <Icon size={22} className="text-white" />
            </div>
        </div>
    </div>
);

export default StatCard