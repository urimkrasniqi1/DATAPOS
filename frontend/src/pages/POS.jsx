import React, { useState, useEffect, useRef, useCallback } from 'react';
import { api, useAuth } from '../App';
import { toast } from 'sonner';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  Receipt,
  FileText,
  Package,
  User,
  Percent,
  Calculator,
  X,
  Delete
} from 'lucide-react';

const POS = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [cashDrawer, setCashDrawer] = useState(null);
  const [showOpenDrawer, setShowOpenDrawer] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [openingBalance, setOpeningBalance] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cashAmount, setCashAmount] = useState('');
  const [customerName, setCustomerName] = useState('');
  const searchRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsRes, drawerRes] = await Promise.all([
        api.get('/products'),
        api.get('/cashier/current').catch(() => ({ data: null }))
      ]);
      setProducts(productsRes.data);
      setCashDrawer(drawerRes.data);
    } catch (error) {
      console.error('Error loading POS data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDrawer = async () => {
    try {
      const response = await api.post('/cashier/open', {
        opening_balance: parseFloat(openingBalance) || 0,
        branch_id: user?.branch_id
      });
      setCashDrawer(response.data);
      setShowOpenDrawer(false);
      setOpeningBalance('');
      toast.success('Arka u hap me sukses');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Gabim gjatë hapjes së arkës');
    }
  };

  const handleCloseDrawer = async () => {
    if (!window.confirm('Jeni të sigurt që doni të mbyllni arkën?')) return;
    
    const actualBalance = prompt('Vendosni bilancin aktual në arkë (€):');
    if (actualBalance === null) return;

    try {
      const response = await api.post('/cashier/close', { actual_balance: parseFloat(actualBalance) || 0 });
      setCashDrawer(null);
      toast.success(`Arka u mbyll. Diferenca: €${response.data.discrepancy.toFixed(2)}`);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Gabim gjatë mbylljes së arkës');
    }
  };

  const filteredProducts = products.filter(p => 
    (p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.barcode?.includes(search)) && p.current_stock > 0
  );

  const addToCart = useCallback((product) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.product_id === product.id);
      if (existing) {
        if (existing.quantity >= product.current_stock) {
          toast.error('Stok i pamjaftueshëm');
          return prevCart;
        }
        return prevCart.map(item =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, {
        product_id: product.id,
        product_name: product.name,
        quantity: 1,
        unit_price: product.sale_price || 0,
        discount_percent: 0,
        vat_percent: product.vat_rate || 0,
        max_stock: product.current_stock
      }];
    });
  }, []);

  const updateQuantity = (productId, delta) => {
    setCart(prevCart =>
      prevCart.map(item => {
        if (item.product_id === productId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return item;
          if (newQty > item.max_stock) {
            toast.error('Stok i pamjaftueshëm');
            return item;
          }
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const updateDiscount = (productId, discount) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.product_id === productId
          ? { ...item, discount_percent: Math.min(100, Math.max(0, parseFloat(discount) || 0)) }
          : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.product_id !== productId));
  };

  const clearCart = () => {
    if (cart.length > 0 && window.confirm('Jeni të sigurt që doni të pastroni shportën?')) {
      setCart([]);
    }
  };

  // Calculate totals
  const calculateItemTotal = (item) => {
    const subtotal = item.quantity * item.unit_price;
    const discount = subtotal * (item.discount_percent / 100);
    const afterDiscount = subtotal - discount;
    const vat = afterDiscount * (item.vat_percent / 100);
    return { subtotal, discount, vat, total: afterDiscount + vat };
  };

  const cartTotals = cart.reduce((acc, item) => {
    const { subtotal, discount, vat, total } = calculateItemTotal(item);
    return {
      subtotal: acc.subtotal + subtotal,
      discount: acc.discount + discount,
      vat: acc.vat + vat,
      total: acc.total + total
    };
  }, { subtotal: 0, discount: 0, vat: 0, total: 0 });

  const changeAmount = Math.max(0, (parseFloat(cashAmount) || 0) - cartTotals.total);

  const handlePayment = async () => {
    if (cart.length === 0) {
      toast.error('Shporta është bosh');
      return;
    }

    if (paymentMethod === 'cash' && (parseFloat(cashAmount) || 0) < cartTotals.total) {
      toast.error('Shuma e paguar është më e vogël se totali');
      return;
    }

    try {
      const saleData = {
        items: cart.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          discount_percent: item.discount_percent,
          vat_percent: item.vat_percent
        })),
        payment_method: paymentMethod,
        cash_amount: paymentMethod === 'cash' ? parseFloat(cashAmount) || 0 : 0,
        bank_amount: paymentMethod === 'bank' ? cartTotals.total : 0,
        customer_name: customerName || null
      };

      const response = await api.post('/sales', saleData);
      toast.success(`Shitja u regjistrua: ${response.data.receipt_number}`);
      setCart([]);
      setShowPayment(false);
      setCashAmount('');
      setCustomerName('');
      loadData(); // Reload to update stock
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Gabim gjatë regjistrimit të shitjes');
    }
  };

  // Numpad handler
  const handleNumpad = (value) => {
    if (value === 'clear') {
      setCashAmount('');
    } else if (value === 'backspace') {
      setCashAmount(prev => prev.slice(0, -1));
    } else {
      setCashAmount(prev => prev + value);
    }
  };

  // Keyboard shortcut for barcode scanner
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && search) {
        const product = products.find(p => p.barcode === search);
        if (product) {
          addToCart(product);
          setSearch('');
        }
      }
    };
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [search, products, addToCart]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="spinner" />
      </div>
    );
  }

  // Check if drawer is open
  if (!cashDrawer) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]" data-testid="pos-open-drawer">
        <div className="text-center space-y-4">
          <div className="h-20 w-20 mx-auto bg-[#E53935]/10 rounded-full flex items-center justify-center">
            <Calculator className="h-10 w-10 text-[#E53935]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Arka është e Mbyllur</h2>
          <p className="text-gray-500">Hapni arkën për të filluar shitjen</p>
          <Button
            onClick={() => setShowOpenDrawer(true)}
            className="bg-[#E53935] hover:bg-[#D32F2F] text-white px-8 py-6 text-lg"
            data-testid="open-drawer-btn"
          >
            Hap Arkën
          </Button>
        </div>

        {/* Open Drawer Dialog */}
        <Dialog open={showOpenDrawer} onOpenChange={setShowOpenDrawer}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Hap Arkën</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Bilanci Fillestar (€)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={openingBalance}
                  onChange={(e) => setOpeningBalance(e.target.value)}
                  placeholder="0.00"
                  className="mt-1"
                  data-testid="opening-balance-input"
                />
              </div>
              <Button
                onClick={handleOpenDrawer}
                className="w-full bg-[#E53935] hover:bg-[#D32F2F]"
                data-testid="confirm-open-drawer"
              >
                Konfirmo
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-4" data-testid="pos-page">
      {/* Left Side - Product Search & Cart */}
      <div className="flex-1 flex flex-col">
        {/* Header with search */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <User className="h-4 w-4" />
            <span>{user?.full_name}</span>
          </div>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              ref={searchRef}
              type="text"
              placeholder="Kërko produkt ose skano barkod..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-12 border-[#00B9D7] focus:ring-[#00B9D7]"
              data-testid="pos-search-input"
            />
          </div>
        </div>

        {/* Cart Table */}
        <Card className="flex-1 border-0 shadow-sm overflow-hidden">
          <div className="bg-[#00B9D7]/10 px-4 py-2 border-b border-[#00B9D7]/20">
            <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-gray-600">
              <div className="col-span-1">Nr</div>
              <div className="col-span-3">Emërtimi</div>
              <div className="col-span-1 text-center">Sasia</div>
              <div className="col-span-2 text-right">Çmimi</div>
              <div className="col-span-1 text-center">Zbritja %</div>
              <div className="col-span-1 text-center">Tvsh %</div>
              <div className="col-span-2 text-right">Çmimi me tvsh</div>
              <div className="col-span-1 text-right">Total</div>
            </div>
          </div>
          <div className="overflow-auto flex-1" style={{ maxHeight: 'calc(100vh - 24rem)' }}>
            <Table>
              <TableBody>
                {cart.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center py-12 text-gray-400">
                      <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      Shtoni produkte në shportë
                    </TableCell>
                  </TableRow>
                ) : (
                  cart.map((item, index) => {
                    const { subtotal, total } = calculateItemTotal(item);
                    return (
                      <TableRow key={item.product_id} className="table-row-hover">
                        <TableCell className="w-12">{index + 1}</TableCell>
                        <TableCell>
                          <Select
                            value={item.product_id}
                            onValueChange={(value) => {
                              const product = products.find(p => p.id === value);
                              if (product) {
                                setCart(prev => prev.map((it, i) => 
                                  i === index ? {
                                    ...it,
                                    product_id: product.id,
                                    product_name: product.name,
                                    unit_price: product.sale_price || 0,
                                    vat_percent: product.vat_rate || 0,
                                    max_stock: product.current_stock
                                  } : it
                                ));
                              }
                            }}
                          >
                            <SelectTrigger className="border-[#00B9D7]">
                              <SelectValue>{item.product_name || 'Zgjidh'}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {products.filter(p => p.current_stock > 0).map(p => (
                                <SelectItem key={p.id} value={p.id}>
                                  {p.name || p.barcode || p.id}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(item.product_id, -1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(item.product_id, 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">€{item.unit_price.toFixed(2)}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={item.discount_percent}
                            onChange={(e) => updateDiscount(item.product_id, e.target.value)}
                            className="w-16 h-8 text-center"
                          />
                        </TableCell>
                        <TableCell className="text-center">{item.vat_percent}</TableCell>
                        <TableCell className="text-right">€{(item.unit_price * (1 + item.vat_percent / 100)).toFixed(2)}</TableCell>
                        <TableCell className="text-right font-semibold">€{total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-500 hover:text-red-700"
                            onClick={() => removeFromCart(item.product_id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Cart Totals */}
          <div className="border-t border-[#00B9D7] bg-gray-50 p-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1 text-sm">
                <div className="flex gap-8">
                  <span className="text-gray-500">Subtotal: <span className="font-medium text-gray-900">€{cartTotals.subtotal.toFixed(2)}</span></span>
                  <span className="text-gray-500">Zbritja: <span className="font-medium text-red-500">-€{cartTotals.discount.toFixed(2)}</span></span>
                  <span className="text-gray-500">TVSH: <span className="font-medium text-gray-900">€{cartTotals.vat.toFixed(2)}</span></span>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                €{cartTotals.total.toFixed(2)}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Right Side - Action Buttons */}
      <div className="w-full lg:w-48 flex flex-row lg:flex-col gap-2">
        <Button
          variant="outline"
          className="flex-1 lg:h-14 flex items-center justify-center gap-2"
          onClick={() => {/* Document functionality */}}
          data-testid="pos-documents-btn"
        >
          <FileText className="h-5 w-5" />
          <span className="hidden lg:inline">Dokumentin</span>
        </Button>
        <Button
          variant="outline"
          className="flex-1 lg:h-14 flex items-center justify-center gap-2"
          onClick={() => {/* Add product functionality */}}
          data-testid="pos-add-product-btn"
        >
          <Package className="h-5 w-5" />
          <span className="hidden lg:inline">Kërko artikullin</span>
        </Button>
        <Button
          variant="outline"
          className="flex-1 lg:h-14 flex items-center justify-center gap-2"
          data-testid="pos-stock-btn"
        >
          <Receipt className="h-5 w-5" />
          <span className="hidden lg:inline">Shtyp Noten</span>
        </Button>
        <Button
          variant="outline"
          className="flex-1 lg:h-14 flex items-center justify-center gap-2"
          data-testid="pos-delete-btn"
        >
          <Trash2 className="h-5 w-5" />
          <span className="hidden lg:inline">Fshij artikullin</span>
        </Button>
        <Button
          variant="outline"
          className="flex-1 lg:h-14 flex items-center justify-center gap-2"
          data-testid="pos-customer-btn"
        >
          <User className="h-5 w-5" />
          <span className="hidden lg:inline">Konsumatori</span>
        </Button>
        <Button
          variant="outline"
          className="flex-1 lg:h-14 flex items-center justify-center gap-2"
          data-testid="pos-params-btn"
        >
          <Calculator className="h-5 w-5" />
          <span className="hidden lg:inline">Parametrat</span>
        </Button>
        <Button
          variant="outline"
          className="flex-1 lg:h-14 flex items-center justify-center gap-2"
          data-testid="pos-list-btn"
        >
          <Package className="h-5 w-5" />
          <span className="hidden lg:inline">Shtyp</span>
        </Button>
        <Button
          variant="outline"
          className="flex-1 lg:h-14 flex items-center justify-center gap-2"
          onClick={handleCloseDrawer}
          data-testid="pos-close-btn"
        >
          <X className="h-5 w-5" />
          <span className="hidden lg:inline">Provo Art</span>
        </Button>
        <Button
          variant="outline"
          className="flex-1 lg:h-14 flex items-center justify-center gap-2 text-red-500"
          onClick={clearCart}
          data-testid="pos-clear-btn"
        >
          <Trash2 className="h-5 w-5" />
          <span className="hidden lg:inline">Pastro</span>
        </Button>
        <Button
          className="flex-1 lg:h-14 flex items-center justify-center gap-2 bg-[#E53935] hover:bg-[#D32F2F]"
          onClick={() => cart.length > 0 && setShowPayment(true)}
          disabled={cart.length === 0}
          data-testid="pos-pay-btn"
        >
          <Percent className="h-5 w-5" />
          <span className="hidden lg:inline">Pa TVSH</span>
        </Button>
      </div>

      {/* Time Display */}
      <div className="fixed bottom-4 right-4 text-right hidden lg:block">
        <div className="text-4xl font-bold text-[#00B9D7]">
          {new Date().toLocaleTimeString('sq-AL', { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="text-gray-500">
          {new Date().toLocaleDateString('sq-AL')}
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>Shtyp faturën</DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => setShowPayment(false)}>
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Total */}
            <div className="text-center text-3xl font-bold text-gray-900">
              €{cartTotals.total.toFixed(2)}
            </div>

            {/* Payment Method Tabs */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                className={paymentMethod === 'cash' ? 'bg-[#E53935] hover:bg-[#D32F2F]' : ''}
                onClick={() => setPaymentMethod('cash')}
                data-testid="payment-cash-btn"
              >
                <Banknote className="h-4 w-4 mr-2" />
                Cash
              </Button>
              <Button
                variant={paymentMethod === 'bank' ? 'default' : 'outline'}
                className={paymentMethod === 'bank' ? 'bg-[#E53935] hover:bg-[#D32F2F]' : ''}
                onClick={() => setPaymentMethod('bank')}
                data-testid="payment-bank-btn"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Bank
              </Button>
            </div>

            {/* Cash Input */}
            {paymentMethod === 'cash' && (
              <>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00B9D7] font-bold">€</span>
                  <Input
                    type="text"
                    value={cashAmount}
                    onChange={(e) => setCashAmount(e.target.value)}
                    className="pl-8 h-12 text-xl font-semibold"
                    placeholder="0.00"
                    data-testid="cash-amount-input"
                  />
                </div>

                {/* Totals Display */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500">Total:</p>
                    <p className="text-lg font-bold">€{cartTotals.total.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Bank:</p>
                    <p className="text-lg font-bold">€0.00</p>
                  </div>
                  <div className="col-span-2">
                    <p className={`text-2xl font-bold ${changeAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      €{changeAmount >= 0 ? `-${changeAmount.toFixed(2)}` : changeAmount.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Numpad */}
                <div className="grid grid-cols-3 gap-2">
                  {['7', '8', '9', '4', '5', '6', '1', '2', '3', '.', '0'].map((num) => (
                    <button
                      key={num}
                      className="numpad-btn"
                      onClick={() => handleNumpad(num)}
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    className="numpad-btn"
                    onClick={() => handleNumpad('backspace')}
                  >
                    <Delete className="h-5 w-5 mx-auto" />
                  </button>
                </div>
              </>
            )}

            {/* Confirm Button */}
            <Button
              className="w-full h-12 bg-[#2196F3] hover:bg-[#1976D2]"
              onClick={handlePayment}
              data-testid="confirm-payment-btn"
            >
              Shtyp
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default POS;
