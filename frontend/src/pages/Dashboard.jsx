import React, { useState, useEffect } from 'react';
import { api, useAuth } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  DollarSign,
  ShoppingCart,
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ArrowRight
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('all');

  useEffect(() => {
    loadData();
  }, [selectedBranch]);

  const loadData = async () => {
    try {
      setLoading(true);
      const params = selectedBranch !== 'all' ? { branch_id: selectedBranch } : {};
      const [statsRes, branchesRes] = await Promise.all([
        api.get('/reports/dashboard', { params }),
        api.get('/branches')
      ]);
      setStats(statsRes.data);
      setBranches(branchesRes.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => `€${(value || 0).toFixed(2)}`;

  // Mock chart data - in production would come from API
  const salesChartData = [
    { name: 'Hën', sales: 1200 },
    { name: 'Mar', sales: 1900 },
    { name: 'Mër', sales: 1500 },
    { name: 'Enj', sales: 2100 },
    { name: 'Pre', sales: 2400 },
    { name: 'Sht', sales: 1800 },
    { name: 'Die', sales: 900 },
  ];

  const topProductsData = [
    { name: 'Qumësht', sales: 150 },
    { name: 'Bukë', sales: 120 },
    { name: 'Ujë', sales: 100 },
    { name: 'Kafe', sales: 80 },
    { name: 'Sheqer', sales: 60 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="dashboard-page">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Mirësevini, {user?.full_name}!
          </h1>
          <p className="text-gray-500 mt-1">Përmbledhja e ditës</p>
        </div>
        
        {user?.role === 'admin' && branches.length > 0 && (
          <Select value={selectedBranch} onValueChange={setSelectedBranch}>
            <SelectTrigger className="w-[200px]" data-testid="branch-filter">
              <SelectValue placeholder="Zgjidh degën" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Të gjitha degët</SelectItem>
              {branches.map((branch) => (
                <SelectItem key={branch.id} value={branch.id}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow" data-testid="kpi-sales">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Shitjet Sot</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(stats?.total_sales_today)}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-500">+12.5%</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-[#E53935]/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-[#E53935]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow" data-testid="kpi-transactions">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Transaksionet</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats?.total_transactions_today || 0}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-500">+8.2%</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-[#00B9D7]/10 flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-[#00B9D7]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow" data-testid="kpi-products">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Produktet</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats?.total_products || 0}
                </p>
                <p className="text-sm text-gray-400 mt-2">Në total</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <Package className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow" data-testid="kpi-lowstock">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Stok i Ulët</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats?.low_stock_products || 0}
                </p>
                <p className="text-sm text-orange-500 mt-2">Kërkon vëmendje</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Shitjet Javore</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={12} />
                  <YAxis stroke="#64748B" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#E53935"
                    strokeWidth={3}
                    dot={{ fill: '#E53935', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: '#E53935' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Produktet më të Shitura</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProductsData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis type="number" stroke="#64748B" fontSize={12} />
                  <YAxis dataKey="name" type="category" stroke="#64748B" fontSize={12} width={60} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="sales" fill="#00B9D7" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sales & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Sales */}
        <Card className="border-0 shadow-sm lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Shitjet e Fundit</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/reports')}
              className="text-[#E53935] hover:text-[#D32F2F]"
            >
              Shiko të gjitha
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.recent_sales?.slice(0, 5).map((sale, index) => (
                <div
                  key={sale.id || index}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-[#E0F7FA]/50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900">{sale.receipt_number}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(sale.created_at).toLocaleString('sq-AL')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(sale.grand_total)}</p>
                    <p className="text-xs text-gray-500 capitalize">{sale.payment_method}</p>
                  </div>
                </div>
              )) || (
                <p className="text-center text-gray-500 py-8">Nuk ka shitje sot</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Veprime të Shpejta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              className="w-full justify-start gap-3 h-12 bg-[#E53935] hover:bg-[#D32F2F] text-white"
              onClick={() => navigate('/pos')}
              data-testid="quick-action-pos"
            >
              <ShoppingCart className="h-5 w-5" />
              Hap Arkën
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-12"
              onClick={() => navigate('/products')}
              data-testid="quick-action-products"
            >
              <Package className="h-5 w-5" />
              Shto Produkt
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-12"
              onClick={() => navigate('/stock')}
              data-testid="quick-action-stock"
            >
              <AlertTriangle className="h-5 w-5" />
              Kontrollo Stokun
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-12"
              onClick={() => navigate('/reports')}
              data-testid="quick-action-reports"
            >
              <TrendingUp className="h-5 w-5" />
              Shiko Raportet
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
