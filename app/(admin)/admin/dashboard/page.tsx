"use client"

import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, DollarSign, Users, FileText, MoreVertical, Clock } from 'lucide-react';
import StatCard from '@/components/shared/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable, DataTableColumn } from '@/components/ui/data-table';
import useDashboard from './_hooks/useDashboard';

interface User {
    id: string
    name: string
    email: string
    type: 'individual' | 'business'
    status: 'active' | 'pending' | 'inactive'
    lastActivity: string
}

interface Booking {
    id: string
    userName: string
    type: string
    date: string
    time: string
    status: 'upcoming' | 'completed' | 'cancelled'
}

export default function ReportPage() {
    const {
        dashboardData,
        dashboardLoading,
        usersLimit,
        handleUsersPageChange,
        handleUsersLimitChange,
        bookingsLimit,
        handleBookingsPageChange,
        handleBookingsLimitChange,
        usersError,
        bookingsError,
    } = useDashboard("dashboard");

    const [dateRange, setDateRange] = React.useState('This Month');

    // User columns definition
    const userColumns: DataTableColumn<User>[] = [
        {
            key: "name",
            header: "Name",
            cell: (user) => (
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs sm:text-sm font-semibold text-primary">
                            {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </span>
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="font-medium text-xs sm:text-sm truncate">{user.name}</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                </div>
            ),
            sortable: false,
        },
        {
            key: "type",
            header: "Type",
            cell: (user) => (
                <span className="text-xs sm:text-sm capitalize">{user.type}</span>
            ),
            sortable: false,
        },
        {
            key: "lastActivity",
            header: "Last Activity",
            cell: (user) => (
                <span className="text-[10px] sm:text-xs text-muted-foreground">{user.lastActivity}</span>
            ),
            sortable: false,
        },
        {
            key: "status",
            header: "Status",
            cell: (user) => (
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${user.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : user.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </span>
            ),
            sortable: false,
        },
    ];

    // Booking columns definition
    const bookingColumns: DataTableColumn<Booking>[] = [
        {
            key: "userName",
            header: "Client",
            cell: (booking) => (
                <div className="flex items-start gap-2 sm:gap-3">
                    <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-xs sm:text-sm truncate">{booking.userName}</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{booking.type}</p>
                    </div>
                </div>
            ),
            sortable: false,
        },
        {
            key: "date",
            header: "Date",
            cell: (booking) => (
                <span className="text-[10px] sm:text-xs font-medium text-primary">{booking.date}</span>
            ),
            sortable: false,
        },
        {
            key: "time",
            header: "Time",
            cell: (booking) => (
                <span className="text-[10px] sm:text-xs text-muted-foreground">{booking.time}</span>
            ),
            sortable: false,
        },
        {
            key: "status",
            header: "Status",
            cell: (booking) => (
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${booking.status === 'upcoming'
                    ? 'bg-blue-100 text-blue-800'
                    : booking.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
            ),
            sortable: false,
        },
    ];

    const stats = dashboardData?.stats;
    const charts = dashboardData?.charts;
    const recentUsers = dashboardData?.recentUsers;
    const upcomingBookings = dashboardData?.upcomingBookings;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 py-3 sm:py-4 px-4 sm:px-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-500 text-xs sm:text-sm mt-0.5 sm:mt-1">Track financial performance and user analytics</p>
                    </div>
                </div>
            </div>

            <div className="space-y-4 py-2 ">
                {/* Stats Grid - Responsive from 1 column mobile to 2 columns tablet to 4 columns desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                    <StatCard
                        title="Total Revenue"
                        value={`$${stats?.totalRevenue || '0'}`}
                        change={`${stats?.revenueChange || '0'}%`}
                        isPositive={parseFloat(stats?.revenueChange || '0') >= 0}
                        icon={DollarSign}
                        color="bg-indigo-500"
                    />
                    <StatCard
                        title="Active Users"
                        value={stats?.activeUsers?.toString() || '0'}
                        change={`${stats?.usersChange || '0'}%`}
                        isPositive={parseFloat(stats?.usersChange || '0') >= 0}
                        icon={Users}
                        color="bg-violet-500"
                    />
                    <StatCard
                        title="Reports Generated"
                        value={stats?.reportsGenerated?.toString() || '0'}
                        change="3.1%"
                        isPositive={false}
                        icon={FileText}
                        color="bg-purple-500"
                    />
                    <StatCard
                        title="Avg. Revenue/User"
                        value={`$${stats?.avgRevenuePerUser || '0'}`}
                        change="5.8%"
                        isPositive={true}
                        icon={TrendingUp}
                        color="bg-fuchsia-500"
                    />
                </div>

                {/* Charts Row - Stack on mobile, side by side on desktop */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
                    {/* Revenue Chart - Full width on mobile, 2/3 width on desktop */}
                    <div className="lg:col-span-2 bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4 sm:mb-5">
                            <div>
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Revenue vs Expenses</h3>
                                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Monthly financial overview</p>
                            </div>
                            <button className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition">
                                <MoreVertical size={16} className="text-gray-400 sm:w-[18px] sm:h-[18px]" />
                            </button>
                        </div>
                        <ResponsiveContainer width="100%" height={250} className="sm:!h-[280px]">
                            <BarChart data={charts?.revenueVsExpenses || []} barGap={8}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} className="sm:text-xs" />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} className="sm:text-xs" tickFormatter={(v) => `$${v / 1000}k`} />
                                <Tooltip formatter={(v: any) => [`$${v.toLocaleString()}`, '']} contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: '12px' }} />
                                <Legend wrapperStyle={{ fontSize: '12px' }} />
                                <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} name="Revenue" />
                                <Bar dataKey="expenses" fill="#e0e7ff" radius={[4, 4, 0, 0]} name="Expenses" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* User Distribution - Full width on mobile, 1/3 width on desktop */}
                    <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4 sm:mb-5">
                            <div>
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900">User Distribution</h3>
                                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">By user type</p>
                            </div>
                            <button className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition">
                                <MoreVertical size={16} className="text-gray-400 sm:w-[18px] sm:h-[18px]" />
                            </button>
                        </div>
                        <ResponsiveContainer width="100%" height={180} className="sm:!h-[200px]">
                            <PieChart>
                                <Pie data={charts?.userDistribution || []} cx="50%" cy="50%" innerRadius={45} outerRadius={70} className="sm:!innerRadius-[50] sm:!outerRadius-[80]" paddingAngle={3} dataKey="value">
                                    {(charts?.userDistribution || []).map((entry: { color: string | undefined; }, i: React.Key | null | undefined) => <Cell key={i} fill={entry.color} />)}
                                </Pie>
                                <Tooltip formatter={(v: any) => [`${v}%`, '']} contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: '12px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="grid grid-cols-2 gap-2 mt-3">
                            {(charts?.userDistribution || []).map((item: { color: any; name: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; value: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }, i: React.Key | null | undefined) => (
                                <div key={i} className="flex items-center gap-1.5 sm:gap-2">
                                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-[10px] sm:text-xs text-gray-600 truncate">{item.name}</span>
                                    <span className="text-[10px] sm:text-xs font-semibold text-gray-900 ml-auto">{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* DataTables Row - Stack on mobile and tablet, side by side on large screens */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Recent Users Table */}
                    <Card className="lg:col-span-2">
                        <CardHeader className="pb-3 sm:pb-6">
                            <div>
                                <CardTitle className="text-base sm:text-lg">Recent Users</CardTitle>
                                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">Latest user activity</p>
                            </div>
                        </CardHeader>
                        <CardContent className="px-3 sm:px-6">
                            <DataTable
                                data={recentUsers?.users || []}
                                columns={userColumns}
                                isLoading={dashboardLoading}
                                keyExtractor={(user) => user.id}
                                error={usersError ? "Failed to load users... Please try again." : undefined}
                                pagination={{
                                    pageSize: usersLimit,
                                    total: recentUsers?.pagination?.total || 0,
                                    pageSizeOptions: [5, 10, 20],
                                    showSizeChanger: false,
                                    serverSide: true,
                                    position: "bottom",
                                    onPageChange: handleUsersPageChange,
                                    onPageSizeChange: handleUsersLimitChange,
                                }}
                                selectable={false}
                                searchable={false}
                                showColumnFilters={false}
                                className="shadow-sm"
                                expandable={false}
                            />
                        </CardContent>
                    </Card>

                    {/* Upcoming Bookings Table */}
                    <Card className="lg:col-span-1">
                        <CardHeader className="pb-3 sm:pb-6">
                            <div>
                                <CardTitle className="text-base sm:text-lg">Upcoming</CardTitle>
                                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">Scheduled Bookings</p>
                            </div>
                        </CardHeader>
                        <CardContent className="px-3 sm:px-6">
                            <DataTable
                                data={upcomingBookings?.bookings || []}
                                columns={bookingColumns}
                                isLoading={dashboardLoading}
                                keyExtractor={(booking) => booking.id}
                                error={bookingsError ? "Failed to load bookings... Please try again." : undefined}
                                pagination={{
                                    pageSize: bookingsLimit,
                                    total: upcomingBookings?.pagination?.total || 0,
                                    pageSizeOptions: [4, 8, 12],
                                    showSizeChanger: false,
                                    serverSide: true,
                                    position: "bottom",
                                    onPageChange: handleBookingsPageChange,
                                    onPageSizeChange: handleBookingsLimitChange,
                                }}
                                selectable={false}
                                searchable={false}
                                showColumnFilters={false}
                                className="shadow-sm"
                                expandable={false}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}