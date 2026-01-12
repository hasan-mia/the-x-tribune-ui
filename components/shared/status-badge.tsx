const StatusBadge = ({ status }: { status: 'Completed' | 'In Progress' | 'Pending Review' }) => {
    const styles = {
        'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-200',
        'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
        'Pending Review': 'bg-amber-50 text-amber-700 border-amber-200',
    } as const;
    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
            {status}
        </span>
    );
};

export default StatusBadge;