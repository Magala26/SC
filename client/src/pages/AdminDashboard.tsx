import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { DollarSign, BookOpen, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  // Fetch bookings with date range
  const { data: bookingsList, isLoading: bookingsLoading } = trpc.admin.bookings.list.useQuery({
    status: selectedStatus as any,
    startDate,
    endDate,
    limit: 100,
  });

  // Fetch booking counts by status with date range
  const { data: statusCounts } = trpc.admin.bookings.countByStatusWithDateRange.useQuery({
    startDate,
    endDate,
  });

  // Fetch analytics with date range
  const { data: analytics } = trpc.admin.bookings.analytics.useQuery({
    startDate,
    endDate,
  });

  // Update booking status mutation
  const updateStatusMutation = trpc.admin.bookings.updateStatus.useMutation({
    onSuccess: () => {
      trpc.useUtils().admin.bookings.list.invalidate();
      trpc.useUtils().admin.bookings.countByStatus.invalidate();
      trpc.useUtils().admin.bookings.analytics.invalidate();
    },
  });

  const handlePresetRange = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    setStartDate(start);
    setEndDate(end);
  };

  const handleClearFilter = () => {
    setStartDate(undefined);
    setEndDate(undefined);
  };

  if (loading) {
    return <DashboardLayout><div>Loading...</div></DashboardLayout>;
  }

  if (!user || user.role !== "admin") {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground">You do not have permission to access this dashboard.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Business Analytics</h1>
          <p className="text-muted-foreground mt-2">Track your sneaker care business performance</p>
        </div>

        {/* Date Range Filter */}
        <Card>
          <CardHeader>
            <CardTitle>Date Range Filter</CardTitle>
            <CardDescription>Select a time period to view analytics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={startDate && endDate ? "default" : "outline"}
                size="sm"
                onClick={() => handlePresetRange(7)}
              >
                Last 7 Days
              </Button>
              <Button
                variant={startDate && endDate ? "default" : "outline"}
                size="sm"
                onClick={() => handlePresetRange(30)}
              >
                Last 30 Days
              </Button>
              <Button
                variant={startDate && endDate ? "default" : "outline"}
                size="sm"
                onClick={() => handlePresetRange(90)}
              >
                Last 90 Days
              </Button>
              {(startDate || endDate) && (
                <Button variant="outline" size="sm" onClick={handleClearFilter}>
                  Clear Filter
                </Button>
              )}
            </div>
            {startDate && endDate && (
              <div className="text-sm text-muted-foreground">
                Showing data from {startDate.toLocaleDateString()} to {endDate.toLocaleDateString()}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <BookOpen className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.totalBookings || 0}</div>
              <p className="text-xs text-muted-foreground">All time bookings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R{(analytics?.totalRevenue || 0).toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">From completed bookings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.completedBookings || 0}</div>
              <p className="text-xs text-muted-foreground">Finished services</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.pendingBookings || 0}</div>
              <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Services Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Top Services</CardTitle>
              <CardDescription>Most popular services by booking count</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics?.topServices && analytics.topServices.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.topServices}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="bookingCount" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Booking Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Status Distribution</CardTitle>
              <CardDescription>{startDate && endDate ? `Bookings from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}` : "Current booking statuses"}</CardDescription>
            </CardHeader>
            <CardContent>
              {statusCounts ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Pending", value: statusCounts.pending },
                        { name: "Confirmed", value: statusCounts.confirmed },
                        { name: "Completed", value: statusCounts.completed },
                        { name: "Cancelled", value: statusCounts.cancelled },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Bookings Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Manage and view all bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex gap-2">
              {["pending", "confirmed", "completed", "cancelled"].map((status) => (
                <Badge
                  key={status}
                  variant={selectedStatus === status ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedStatus(selectedStatus === status ? undefined : status)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Badge>
              ))}
            </div>

            {bookingsLoading ? (
              <div className="text-center py-8">Loading bookings...</div>
            ) : bookingsList && bookingsList.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-2 px-4">ID</th>
                      <th className="text-left py-2 px-4">Customer</th>
                      <th className="text-left py-2 px-4">Email</th>
                      <th className="text-left py-2 px-4">Date</th>
                      <th className="text-left py-2 px-4">Status</th>
                      <th className="text-left py-2 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookingsList.map((booking) => (
                      <tr key={booking.id} className="border-b hover:bg-muted/50">
                        <td className="py-2 px-4">#{booking.id}</td>
                        <td className="py-2 px-4">{booking.customerName}</td>
                        <td className="py-2 px-4">{booking.customerEmail}</td>
                        <td className="py-2 px-4">{new Date(booking.bookingDate).toLocaleDateString()}</td>
                        <td className="py-2 px-4">
                          <Badge
                            variant={
                              booking.status === "completed"
                                ? "default"
                                : booking.status === "cancelled"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {booking.status}
                          </Badge>
                        </td>
                        <td className="py-2 px-4">
                          <select
                            value={booking.status}
                            onChange={(e) =>
                              updateStatusMutation.mutate({
                                bookingId: booking.id,
                                status: e.target.value as any,
                              })
                            }
                            className="text-sm border rounded px-2 py-1"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">No bookings found</div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
