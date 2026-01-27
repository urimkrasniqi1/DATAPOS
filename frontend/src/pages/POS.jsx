import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, useAuth } from '../App';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { ScrollArea } from '../components/ui/scroll-area';
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
  Delete,
  Settings,
  Printer,
  List,
  XCircle,
  LogOut,
  FileDown
} from 'lucide-react';
import InvoiceA4 from '../components/InvoiceA4';
import ThermalReceipt from '../components/ThermalReceipt';
import { Checkbox } from '../components/ui/checkbox';

const POS = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [dialogSearch, setDialogSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [cashDrawer, setCashDrawer] = useState(null);
  const [showOpenDrawer, setShowOpenDrawer] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [showCustomer, setShowCustomer] = useState(false);
  const [showParams, setShowParams] = useState(false);
  const [showDocuments, setShowDocuments] = useState(false);
  const [openingBalance, setOpeningBalance] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cashAmount, setCashAmount] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerNote, setCustomerNote] = useState('');
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [recentSales, setRecentSales] = useState([]);
  const [applyNoVat, setApplyNoVat] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showInvoiceA4, setShowInvoiceA4] = useState(false);
  const [showBuyerForm, setShowBuyerForm] = useState(false);
  const [currentSaleForPrint, setCurrentSaleForPrint] = useState(null);
  const [companySettings, setCompanySettings] = useState(null);
  const [printReceipt, setPrintReceipt] = useState(true); // Default: print receipt
  const [buyerInfo, setBuyerInfo] = useState({
    name: '',
    address: '',
    phone: '',
    nui: '',
    nf: ''
  });
  const searchRef = useRef(null);
  const invoiceRef = useRef(null);
  const thermalReceiptRef = useRef(null);

  useEffect(() => {
    loadData();
    loadCompanySettings();
  }, []);

  const loadCompanySettings = async () => {
    try {
      const response = await api.get('/settings/company');
      setCompanySettings(response.data);
    } catch (error) {
      console.error('Error loading company settings:', error);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsRes, drawerRes, salesRes] = await Promise.all([
        api.get('/products'),
        api.get('/cashier/current').catch(() => ({ data: null })),
        api.get('/sales?limit=10').catch(() => ({ data: [] }))
      ]);
      setProducts(productsRes.data);
      setCashDrawer(drawerRes.data);
      setRecentSales(salesRes.data || []);
    } catch (error) {
      console.error('Error loading POS data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (cashDrawer) {
      if (!window.confirm('Keni arkë të hapur. Jeni të sigurt që doni të çkyçeni pa e mbyllur arkën?')) {
        return;
      }
    }
    logout();
    navigate('/login');
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

  // Filter products for dialog - show all products, highlight zero stock
  const filteredProducts = products.filter(p => {
    const searchTerm = (showProductSearch ? dialogSearch : search).toLowerCase().trim();
    if (!searchTerm) return true; // Show all products when no search
    return (
      p.name?.toLowerCase().includes(searchTerm) ||
      p.barcode?.toLowerCase().includes(searchTerm) ||
      p.barcode?.includes(searchTerm)
    );
  });

  // Products for main search (showing dropdown) - show all products including zero stock
  const mainSearchResults = search.trim() ? products.filter(p => 
    (p.name?.toLowerCase().includes(search.toLowerCase().trim()) ||
    p.barcode?.toLowerCase().includes(search.toLowerCase().trim()) ||
    p.barcode?.includes(search.trim()))
  ) : [];

  const addToCart = useCallback((product) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.product_id === product.id);
      if (existing) {
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
        vat_percent: applyNoVat ? 0 : (product.vat_rate || 0),
        current_stock: product.current_stock
      }];
    });
    setShowProductSearch(false);
    setSearch('');
    setShowSearchResults(false);
    
    // Show warning if product has no stock
    if (product.current_stock <= 0) {
      toast.warning(`Kujdes: "${product.name}" nuk ka stok!`);
    }
  }, [applyNoVat]);

  const updateQuantity = (productId, delta) => {
    setCart(prevCart =>
      prevCart.map(item => {
        if (item.product_id === productId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return item;
          // Allow selling without stock limit - just show warning
          if (item.current_stock > 0 && newQty > item.current_stock) {
            toast.warning('Kujdes: Po shisni mbi stokun e disponueshëm!');
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
    setSelectedItemIndex(null);
  };

  const deleteSelectedItem = () => {
    if (selectedItemIndex !== null && cart[selectedItemIndex]) {
      removeFromCart(cart[selectedItemIndex].product_id);
      toast.success('Artikulli u fshi');
    } else {
      toast.error('Zgjidhni një artikull për ta fshirë');
    }
  };

  const clearCart = () => {
    if (cart.length > 0 && window.confirm('Jeni të sigurt që doni të pastroni shportën?')) {
      setCart([]);
      setSelectedItemIndex(null);
      setCustomerName('');
      setCustomerNote('');
      toast.success('Shporta u pastrua');
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

  // State for receipt preview
  const [showReceiptPreview, setShowReceiptPreview] = useState(false);
  const [receiptDataForPrint, setReceiptDataForPrint] = useState(null);
  const [receiptComment, setReceiptComment] = useState(''); // Extra comment for receipt
  const [showCommentOnReceipt, setShowCommentOnReceipt] = useState(true); // Toggle to show comment
  const [savedReceiptComment, setSavedReceiptComment] = useState(''); // Saved comment from settings

  // Load saved comment from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('receiptDefaultComment');
    if (saved) {
      setSavedReceiptComment(saved);
    }
  }, []);

  // Print thermal receipt - show preview dialog first
  const printThermalReceipt = (saleData) => {
    setReceiptDataForPrint(saleData);
    setReceiptComment(savedReceiptComment); // Load saved comment as default
    setShowCommentOnReceipt(!!savedReceiptComment);
    setShowReceiptPreview(true);
  };

  // Save comment as default for future receipts
  const saveCommentAsDefault = () => {
    localStorage.setItem('receiptDefaultComment', receiptComment);
    setSavedReceiptComment(receiptComment);
    toast.success('Komenti u ruajt si default!');
  };

  // Clear saved comment
  const clearSavedComment = () => {
    localStorage.removeItem('receiptDefaultComment');
    setSavedReceiptComment('');
    toast.success('Komenti default u fshi!');
  };

  // Execute the actual print using iframe (more reliable, no popup blockers)
  const executeThermalPrint = () => {
    const printArea = document.getElementById('thermal-receipt-print');
    if (!printArea) {
      toast.error('Gabim: Kuponi nuk u gjet');
      return;
    }

    // Create hidden iframe for printing
    const printFrame = document.createElement('iframe');
    printFrame.id = 'thermal-print-frame';
    printFrame.style.position = 'absolute';
    printFrame.style.top = '-10000px';
    printFrame.style.left = '-10000px';
    printFrame.style.width = '90mm';
    printFrame.style.height = '0';
    
    // Remove any existing print frame
    const existingFrame = document.getElementById('thermal-print-frame');
    if (existingFrame) {
      existingFrame.remove();
    }
    
    document.body.appendChild(printFrame);

    const printDocument = printFrame.contentDocument || printFrame.contentWindow.document;
    
    printDocument.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Kupon Shitje</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Courier New', 'Lucida Console', monospace; 
              font-size: 12px; 
              line-height: 1.4;
              width: 90mm;
              max-width: 90mm;
              min-height: 140mm;
              padding: 4mm;
              background: white;
              color: #000;
            }
            div { box-sizing: border-box; }
            @media print {
              @page { 
                size: 90mm auto; 
                margin: 0; 
              }
              html, body { 
                width: 90mm !important;
                max-width: 90mm !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          ${printArea.innerHTML}
        </body>
      </html>
    `);
    
    printDocument.close();
    
    // Wait for content to load, then print
    setTimeout(() => {
      try {
        printFrame.contentWindow.focus();
        printFrame.contentWindow.print();
      } catch (e) {
        console.error('Print error:', e);
        toast.error('Gabim gjatë printimit. Provoni përsëri.');
      }
      // Remove iframe after a delay
      setTimeout(() => {
        const frame = document.getElementById('thermal-print-frame');
        if (frame) {
          frame.remove();
        }
      }, 2000);
    }, 300);
    
    toast.success('Kuponi po dërgohet për printim...');
  };

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
        customer_name: customerName || null,
        notes: customerNote || null
      };

      const response = await api.post('/sales', saleData);
      toast.success(`Shitja u regjistrua: ${response.data.receipt_number}`);
      
      // Print thermal receipt if option is checked
      if (printReceipt) {
        const receiptData = {
          ...response.data,
          items: cart.map(item => ({
            ...item,
            total: calculateItemTotal(item).total
          })),
          subtotal: cartTotals.subtotal,
          total_discount: cartTotals.discount,
          total_vat: cartTotals.vat,
          grand_total: cartTotals.total,
          cash_amount: parseFloat(cashAmount) || 0,
          change_amount: changeAmount
        };
        printThermalReceipt(receiptData);
      }
      
      setCart([]);
      setShowPayment(false);
      setCashAmount('');
      setCustomerName('');
      setCustomerNote('');
      setSelectedItemIndex(null);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Gabim gjatë regjistrimit të shitjes');
    }
  };

  // Print note (simulation)
  const handlePrintNote = () => {
    if (cart.length === 0) {
      toast.error('Shporta është bosh');
      return;
    }
    // Create printable content
    const printContent = `
      =====================================
      Mobilshopurimi POS - NOTË
      =====================================
      Data: ${new Date().toLocaleString('sq-AL')}
      Arkëtar: ${user?.full_name}
      -------------------------------------
      ${cart.map((item, i) => `${i+1}. ${item.product_name || 'Produkt'} x${item.quantity} = €${calculateItemTotal(item).total.toFixed(2)}`).join('\n')}
      -------------------------------------
      TOTAL: €${cartTotals.total.toFixed(2)}
      =====================================
    `;
    console.log(printContent);
    toast.success('Nota u dërgua për printim');
  };

  // Open buyer form before printing A4
  const handlePrintA4 = (sale = null) => {
    if (!sale && cart.length === 0) {
      toast.error('Shporta është bosh');
      return;
    }
    
    // If sale is provided (from documents), go directly to print
    if (sale) {
      setCurrentSaleForPrint(sale);
      setShowInvoiceA4(true);
      return;
    }
    
    // Otherwise show buyer form first
    setBuyerInfo({
      name: customerName || '',
      address: '',
      phone: '',
      nui: '',
      nf: ''
    });
    setShowBuyerForm(true);
  };

  // Proceed to print after filling buyer info
  const proceedToPrintA4 = () => {
    const saleData = {
      receipt_number: 'PREVIEW',
      items: cart.map(item => ({
        ...item,
        total: calculateItemTotal(item).total
      })),
      subtotal: cartTotals.subtotal,
      total_discount: cartTotals.discount,
      total_vat: cartTotals.vat,
      grand_total: cartTotals.total,
      payment_method: paymentMethod,
      cash_amount: parseFloat(cashAmount) || 0,
      bank_amount: paymentMethod === 'bank' ? cartTotals.total : 0,
      change_amount: changeAmount,
      customer_name: buyerInfo.name,
      buyer_info: buyerInfo,
      notes: customerNote,
      created_at: new Date().toISOString()
    };
    
    setCurrentSaleForPrint(saleData);
    setShowBuyerForm(false);
    setShowInvoiceA4(true);
  };

  // Print the invoice
  const executePrint = () => {
    const printContent = invoiceRef.current;
    if (!printContent) {
      toast.error('Gabim: Fatura nuk u gjet');
      return;
    }

    // Create hidden iframe for printing (more reliable than window.open)
    const printFrame = document.createElement('iframe');
    printFrame.id = 'a4-print-frame';
    printFrame.style.position = 'absolute';
    printFrame.style.top = '-10000px';
    printFrame.style.left = '-10000px';
    printFrame.style.width = '210mm';
    printFrame.style.height = '0';
    
    // Remove any existing print frame
    const existingFrame = document.getElementById('a4-print-frame');
    if (existingFrame) {
      existingFrame.remove();
    }
    
    document.body.appendChild(printFrame);

    const printDocument = printFrame.contentDocument || printFrame.contentWindow.document;
    
    printDocument.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Faturë - ${currentSaleForPrint?.receipt_number || 'Preview'}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @media print {
              body { margin: 0; padding: 0; }
              @page { size: A4; margin: 0; }
            }
            body { font-family: Arial, sans-serif; }
          </style>
        </head>
        <body>
          ${printContent.outerHTML}
        </body>
      </html>
    `);
    
    printDocument.close();
    
    // Wait for content and Tailwind to load, then print
    setTimeout(() => {
      try {
        printFrame.contentWindow.focus();
        printFrame.contentWindow.print();
      } catch (e) {
        console.error('Print error:', e);
        toast.error('Gabim gjatë printimit. Provoni përsëri.');
      }
      // Remove iframe after print dialog closes
      setTimeout(() => {
        const frame = document.getElementById('a4-print-frame');
        if (frame) {
          frame.remove();
        }
      }, 2000);
    }, 800);
    
    toast.success('Fatura po dërgohet për printim...');
  };

  // View and print recent sale A4
  const handleViewSaleA4 = async (saleId) => {
    try {
      const response = await api.get(`/sales/${saleId}`);
      setCurrentSaleForPrint(response.data);
      setShowInvoiceA4(true);
      setShowDocuments(false);
    } catch (error) {
      toast.error('Gabim gjatë ngarkimit të faturës');
    }
  };

  // Apply no VAT to all items
  const handleNoVat = () => {
    setApplyNoVat(!applyNoVat);
    setCart(prevCart => 
      prevCart.map(item => ({
        ...item,
        vat_percent: applyNoVat ? (products.find(p => p.id === item.product_id)?.vat_rate || 0) : 0
      }))
    );
    toast.success(applyNoVat ? 'TVSH u aktivizua' : 'TVSH u çaktivizua');
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

  // Reference for cash input
  const cashInputRef = useRef(null);

  // Focus on cash input when payment dialog opens
  useEffect(() => {
    if (showPayment && paymentMethod === 'cash' && cashInputRef.current) {
      setTimeout(() => {
        cashInputRef.current?.focus();
        cashInputRef.current?.select();
      }, 100);
    }
  }, [showPayment, paymentMethod]);

  // Keyboard shortcuts: F2 for payment, Enter for barcode/complete sale
  useEffect(() => {
    const handleKeyDown = (e) => {
      // F2 - Open payment dialog and focus on cash input
      if (e.key === 'F2' && cart.length > 0 && !showPayment && cashDrawer) {
        e.preventDefault();
        setCashAmount(''); // Clear previous amount
        setPaymentMethod('cash'); // Default to cash
        setShowPayment(true);
        return;
      }
      
      // Enter in payment dialog - complete sale
      if (e.key === 'Enter' && showPayment) {
        e.preventDefault();
        if (paymentMethod === 'bank' || (paymentMethod === 'cash' && parseFloat(cashAmount) >= cartTotals.total)) {
          handlePayment();
        }
        return;
      }
      
      // Enter for barcode/search (when not in payment dialog)
      if (e.key === 'Enter' && search && !showPayment && !showProductSearch) {
        e.preventDefault();
        // First try exact barcode match
        const productByBarcode = products.find(p => p.barcode === search.trim());
        if (productByBarcode) {
          addToCart(productByBarcode);
          setSearch('');
          setShowSearchResults(false);
          return;
        }
        // Then try first search result
        if (mainSearchResults.length > 0) {
          addToCart(mainSearchResults[0]);
          setSearch('');
          setShowSearchResults(false);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [search, products, addToCart, showPayment, showProductSearch, mainSearchResults, cart, cashDrawer, paymentMethod, cashAmount, cartTotals.total]);

  // Check if cashier should see full POS mode (no sidebar)
  const isCashierFullscreen = user?.role === 'cashier';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="spinner" />
      </div>
    );
  }

  // Check if drawer is open - show fullscreen for cashier
  if (!cashDrawer) {
    // For cashier - fullscreen view with header
    if (isCashierFullscreen) {
      return (
        <div className="min-h-screen bg-[#F8FAFC]">
          {/* Cashier Header */}
          <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-[#E53935]">→</span>
              <span className="text-xl font-bold">
                <span className="text-[#E53935]">t</span>
                <span className="text-gray-400">3</span>
                <span className="text-[#00B9D7]">next</span>
              </span>
              <span className="text-gray-400 mx-2">|</span>
              <span className="text-gray-600">Arka</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user?.full_name}</p>
                <p className="text-xs text-gray-500">Arkëtar</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2 text-red-600 border-red-200 hover:bg-red-50"
                data-testid="logout-btn"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Çkyçu</span>
              </Button>
            </div>
          </header>

          {/* Open Drawer Content */}
          <div className="flex flex-col items-center justify-center h-[calc(100vh-5rem)]" data-testid="pos-open-drawer">
            <div className="text-center space-y-6">
              <div className="h-24 w-24 mx-auto bg-[#E53935]/10 rounded-full flex items-center justify-center">
                <Calculator className="h-12 w-12 text-[#E53935]" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Arka është e Mbyllur</h2>
                <p className="text-gray-500 mt-2">Hapni arkën për të filluar shitjen</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => setShowOpenDrawer(true)}
                  className="bg-[#E53935] hover:bg-[#D32F2F] text-white px-8 py-6 text-lg"
                  data-testid="open-drawer-btn"
                >
                  <Calculator className="h-5 w-5 mr-2" />
                  Hap Arkën
                </Button>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="px-8 py-6 text-lg text-red-600 border-red-200 hover:bg-red-50"
                  data-testid="logout-main-btn"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Çkyçu
                </Button>
              </div>
            </div>

            {/* Open Drawer Dialog */}
            <Dialog open={showOpenDrawer} onOpenChange={setShowOpenDrawer}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Hap Arkën</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <Label>Bilanci Fillestar (€)</Label>
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
        </div>
      );
    }

    // For admin/manager - normal view
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
                <Label>Bilanci Fillestar (€)</Label>
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

  // Full screen POS layout for cashier
  const posContent = (
    <div className={`${isCashierFullscreen ? 'h-[calc(100vh-5rem)]' : 'h-[calc(100vh-8rem)]'} flex flex-col lg:flex-row gap-4`} data-testid="pos-page">
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
              onChange={(e) => {
                setSearch(e.target.value);
                setShowSearchResults(e.target.value.trim().length > 0);
              }}
              onFocus={() => search.trim() && setShowSearchResults(true)}
              onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
              className="pl-10 h-12 border-[#00B9D7] focus:ring-[#00B9D7]"
              data-testid="pos-search-input"
            />
            
            {/* Live Search Results Dropdown */}
            {showSearchResults && mainSearchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-auto">
                {mainSearchResults.map((product) => (
                  <div
                    key={product.id}
                    className={`p-3 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                      product.current_stock > 0 ? 'hover:bg-[#E0F7FA]' : 'bg-gray-50 opacity-70'
                    }`}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      addToCart(product);
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">{product.name || 'Pa emër'}</p>
                        <p className="text-sm text-gray-500">Barkod: {product.barcode || '-'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#E53935]">€{(product.sale_price || 0).toFixed(2)}</p>
                        <p className={`text-xs ${product.current_stock > 0 ? 'text-green-600' : 'text-red-500 font-semibold'}`}>
                          {product.current_stock > 0 ? `Stok: ${product.current_stock}` : 'Pa stok!'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* No results message */}
            {showSearchResults && search.trim() && mainSearchResults.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 text-center text-gray-500">
                Nuk u gjet asnjë produkt për "{search}"
              </div>
            )}
          </div>
          {customerName && (
            <div className="flex items-center gap-2 px-3 py-1 bg-[#00B9D7]/10 rounded-lg">
              <User className="h-4 w-4 text-[#00B9D7]" />
              <span className="text-sm font-medium">{customerName}</span>
            </div>
          )}
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
                    const canEdit = user?.role === 'admin' || user?.role === 'manager';
                    return (
                      <TableRow 
                        key={item.product_id} 
                        className={`table-row-hover cursor-pointer ${selectedItemIndex === index ? 'bg-[#E53935]/10' : ''}`}
                        onClick={() => setSelectedItemIndex(index)}
                      >
                        <TableCell className="w-12">{index + 1}</TableCell>
                        <TableCell>
                          {canEdit ? (
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
                                      vat_percent: applyNoVat ? 0 : (product.vat_rate || 0),
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
                          ) : (
                            <span className="font-medium">{item.product_name || 'Produkt'}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={(e) => { e.stopPropagation(); updateQuantity(item.product_id, -1); }}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={(e) => { e.stopPropagation(); updateQuantity(item.product_id, 1); }}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">€{item.unit_price.toFixed(2)}</TableCell>
                        <TableCell>
                          {canEdit ? (
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={item.discount_percent}
                              onChange={(e) => updateDiscount(item.product_id, e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              className="w-16 h-8 text-center"
                            />
                          ) : (
                            <span className="text-center">{item.discount_percent}%</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">{item.vat_percent}</TableCell>
                        <TableCell className="text-right">€{(item.unit_price * (1 + item.vat_percent / 100)).toFixed(2)}</TableCell>
                        <TableCell className="text-right font-semibold">€{total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-500 hover:text-red-700"
                            onClick={(e) => { e.stopPropagation(); removeFromCart(item.product_id); }}
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
        {/* Dokumentin - View recent documents/sales */}
        <Button
          variant="outline"
          className="flex-1 lg:h-14 flex items-center justify-center gap-2"
          onClick={() => setShowDocuments(true)}
          data-testid="pos-documents-btn"
        >
          <FileText className="h-5 w-5" />
          <span className="hidden lg:inline">Dokumentin</span>
        </Button>

        {/* Kërko artikullin - Search and add product */}
        <Button
          variant="outline"
          className="flex-1 lg:h-14 flex items-center justify-center gap-2"
          onClick={() => setShowProductSearch(true)}
          data-testid="pos-add-product-btn"
        >
          <Package className="h-5 w-5" />
          <span className="hidden lg:inline">Kërko artikullin</span>
        </Button>

        {/* Shtyp Noten - Print note/receipt */}
        <Button
          variant="outline"
          className="flex-1 lg:h-14 flex items-center justify-center gap-2"
          onClick={handlePrintNote}
          data-testid="pos-print-note-btn"
        >
          <Receipt className="h-5 w-5" />
          <span className="hidden lg:inline">Shtyp Noten</span>
        </Button>

        {/* Fshij artikullin - Delete selected item */}
        <Button
          variant="outline"
          className="flex-1 lg:h-14 flex items-center justify-center gap-2"
          onClick={deleteSelectedItem}
          data-testid="pos-delete-btn"
        >
          <Trash2 className="h-5 w-5" />
          <span className="hidden lg:inline">Fshij artikullin</span>
        </Button>

        {/* Konsumatori - Customer info */}
        <Button
          variant="outline"
          className={`flex-1 lg:h-14 flex items-center justify-center gap-2 ${customerName ? 'border-[#00B9D7] text-[#00B9D7]' : ''}`}
          onClick={() => setShowCustomer(true)}
          data-testid="pos-customer-btn"
        >
          <User className="h-5 w-5" />
          <span className="hidden lg:inline">Konsumatori</span>
        </Button>

        {/* Parametrat - Settings/params */}
        <Button
          variant="outline"
          className="flex-1 lg:h-14 flex items-center justify-center gap-2"
          onClick={() => setShowParams(true)}
          data-testid="pos-params-btn"
        >
          <Settings className="h-5 w-5" />
          <span className="hidden lg:inline">Parametrat</span>
        </Button>

        {/* Printo A4 - Print A4 Invoice */}
        <Button
          variant="outline"
          className="flex-1 lg:h-14 flex items-center justify-center gap-2 border-blue-500 text-blue-600 hover:bg-blue-50"
          onClick={() => handlePrintA4()}
          disabled={cart.length === 0}
          data-testid="pos-print-a4-btn"
        >
          <FileDown className="h-5 w-5" />
          <span className="hidden lg:inline">Printo A4</span>
        </Button>

        {/* Shtyp - Print and finish (payment) */}
        <Button
          variant="outline"
          className="flex-1 lg:h-14 flex items-center justify-center gap-2 border-green-500 text-green-600 hover:bg-green-50"
          onClick={() => cart.length > 0 && setShowPayment(true)}
          disabled={cart.length === 0}
          data-testid="pos-print-btn"
        >
          <Printer className="h-5 w-5" />
          <span className="hidden lg:inline">Shtyp</span>
        </Button>

        {/* Provo Art / Mbyll Arkën - Close drawer */}
        <Button
          variant="outline"
          className="flex-1 lg:h-14 flex items-center justify-center gap-2"
          onClick={handleCloseDrawer}
          data-testid="pos-close-drawer-btn"
        >
          <XCircle className="h-5 w-5" />
          <span className="hidden lg:inline">Mbyll Arkën</span>
        </Button>

        {/* Pastro - Clear cart */}
        <Button
          variant="outline"
          className="flex-1 lg:h-14 flex items-center justify-center gap-2 text-red-500 hover:bg-red-50"
          onClick={clearCart}
          data-testid="pos-clear-btn"
        >
          <Trash2 className="h-5 w-5" />
          <span className="hidden lg:inline">Pastro</span>
        </Button>

        {/* Pa TVSH - Toggle VAT (vetëm admin/manager) */}
        {(user?.role === 'admin' || user?.role === 'manager') && (
          <Button
            className={`flex-1 lg:h-14 flex items-center justify-center gap-2 ${applyNoVat ? 'bg-orange-500 hover:bg-orange-600' : 'bg-[#E53935] hover:bg-[#D32F2F]'}`}
            onClick={handleNoVat}
            data-testid="pos-no-vat-btn"
          >
            <Percent className="h-5 w-5" />
            <span className="hidden lg:inline">{applyNoVat ? 'Me TVSH' : 'Pa TVSH'}</span>
          </Button>
        )}
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
                    ref={cashInputRef}
                    type="text"
                    value={cashAmount}
                    onChange={(e) => setCashAmount(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && parseFloat(cashAmount) >= cartTotals.total) {
                        e.preventDefault();
                        handlePayment();
                      }
                    }}
                    className="pl-8 h-12 text-xl font-semibold"
                    placeholder="Shkruaj shumën e paguar..."
                    autoFocus
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
                    <p className="text-sm text-gray-500">Kusuri:</p>
                    <p className={`text-2xl font-bold ${changeAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      €{changeAmount.toFixed(2)}
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

            {/* Bank payment - just show total */}
            {paymentMethod === 'bank' && (
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-sm text-gray-500 mb-2">Pagesa me kartë/bank</p>
                <p className="text-2xl font-bold text-[#00B9D7]">€{cartTotals.total.toFixed(2)}</p>
              </div>
            )}

            {/* Print Receipt Option */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Checkbox
                id="printReceipt"
                checked={printReceipt}
                onCheckedChange={setPrintReceipt}
                className="border-[#E53935] data-[state=checked]:bg-[#E53935]"
              />
              <label htmlFor="printReceipt" className="text-sm font-medium cursor-pointer flex-1">
                Shtyp kupon për klientin
              </label>
              <Printer className="h-4 w-4 text-gray-400" />
            </div>

            {/* Confirm Button */}
            <Button
              className="w-full h-12 bg-[#2196F3] hover:bg-[#1976D2]"
              onClick={handlePayment}
              data-testid="confirm-payment-btn"
            >
              <Receipt className="h-4 w-4 mr-2" />
              {printReceipt ? 'Shtyp & Përfundo' : 'Përfundo pa Shtypur'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Product Search Dialog */}
      <Dialog open={showProductSearch} onOpenChange={(open) => {
        setShowProductSearch(open);
        if (!open) setDialogSearch('');
      }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Kërko Artikullin</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Kërko sipas emrit ose barkodit..."
                className="pl-10"
                autoFocus
                value={dialogSearch}
                onChange={(e) => setDialogSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && filteredProducts.length > 0) {
                    addToCart(filteredProducts[0]);
                    setDialogSearch('');
                  }
                }}
              />
            </div>
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      product.current_stock > 0 ? 'hover:bg-[#E0F7FA]' : 'bg-gray-100 opacity-70'
                    }`}
                    onClick={() => {
                      addToCart(product);
                      setDialogSearch('');
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{product.name || 'Pa emër'}</p>
                        <p className="text-sm text-gray-500">Barkod: {product.barcode || '-'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#E53935]">€{(product.sale_price || 0).toFixed(2)}</p>
                        <p className={`text-xs ${product.current_stock > 0 ? 'text-green-600' : 'text-red-500 font-semibold'}`}>
                          {product.current_stock > 0 ? `Stok: ${product.current_stock}` : 'Pa stok!'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredProducts.length === 0 && dialogSearch.trim() && (
                  <p className="text-center text-gray-400 py-8">Nuk u gjet asnjë produkt për "{dialogSearch}"</p>
                )}
                {filteredProducts.length === 0 && !dialogSearch.trim() && (
                  <p className="text-center text-gray-400 py-8">Shkruani emrin ose barkod-in e produktit</p>
                )}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>

      {/* Customer Dialog */}
      <Dialog open={showCustomer} onOpenChange={setShowCustomer}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Informacioni i Konsumatorit</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Emri i Konsumatorit</Label>
              <Input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Emri (opsional)"
                data-testid="customer-name-input"
              />
            </div>
            <div className="space-y-2">
              <Label>Shënime</Label>
              <Textarea
                value={customerNote}
                onChange={(e) => setCustomerNote(e.target.value)}
                placeholder="Shënime shtesë..."
                data-testid="customer-note-input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setCustomerName(''); setCustomerNote(''); }}>
              Pastro
            </Button>
            <Button onClick={() => setShowCustomer(false)} className="bg-[#E53935] hover:bg-[#D32F2F]">
              Ruaj
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Parameters Dialog */}
      <Dialog open={showParams} onOpenChange={setShowParams}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Parametrat e Arkës</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Bilanci Fillestar:</span>
                <span className="font-semibold">€{cashDrawer?.opening_balance?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Bilanci Aktual:</span>
                <span className="font-semibold">€{cashDrawer?.current_balance?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Bilanci i Pritshëm:</span>
                <span className="font-semibold text-[#00B9D7]">€{cashDrawer?.expected_balance?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Hapur më:</span>
                <span className="font-semibold">{cashDrawer?.opened_at ? new Date(cashDrawer.opened_at).toLocaleString('sq-AL') : '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Arkëtari:</span>
                <span className="font-semibold">{user?.full_name}</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-500">Pa TVSH:</span>
              <Button
                variant={applyNoVat ? 'default' : 'outline'}
                size="sm"
                onClick={handleNoVat}
                className={applyNoVat ? 'bg-orange-500' : ''}
              >
                {applyNoVat ? 'Aktiv' : 'Joaktiv'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Documents Dialog */}
      <Dialog open={showDocuments} onOpenChange={setShowDocuments}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Dokumentet e Fundit</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-80">
            <div className="space-y-2">
              {recentSales.map((sale) => (
                <div key={sale.id} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => handleViewSaleA4(sale.id)}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{sale.receipt_number}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(sale.created_at).toLocaleString('sq-AL')}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-bold text-[#E53935]">€{sale.grand_total?.toFixed(2)}</p>
                        <p className="text-xs text-gray-400 capitalize">{sale.payment_method}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600"
                        onClick={(e) => { e.stopPropagation(); handleViewSaleA4(sale.id); }}
                        title="Printo A4"
                      >
                        <FileDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {recentSales.length === 0 && (
                <p className="text-center text-gray-400 py-8">Nuk ka dokumente</p>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Thermal Receipt Preview Dialog - Fiscal Style */}
      <Dialog open={showReceiptPreview} onOpenChange={setShowReceiptPreview}>
        <DialogContent className="sm:max-w-lg max-h-[95vh] overflow-hidden flex flex-col">
          <DialogHeader className="pb-2">
            <DialogTitle className="flex items-center justify-between">
              <span>Kupon Shitje</span>
              <Button
                onClick={executeThermalPrint}
                className="bg-[#E53935] hover:bg-[#D32F2F]"
                size="sm"
              >
                <Printer className="h-4 w-4 mr-2" />
                Printo
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          {/* Comment Section with Save Option */}
          <div className="space-y-3 border-b pb-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="receiptComment" className="text-sm font-medium">
                Koment për kuponin
              </Label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showComment"
                  checked={showCommentOnReceipt}
                  onChange={(e) => setShowCommentOnReceipt(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="showComment" className="text-xs text-gray-600">Shfaq në kupon</label>
              </div>
            </div>
            <Textarea
              id="receiptComment"
              placeholder="P.sh: Garanci 12 muaj, Kthim brenda 14 ditëve..."
              value={receiptComment}
              onChange={(e) => setReceiptComment(e.target.value)}
              className="h-14 text-sm resize-none"
              maxLength={200}
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">{receiptComment.length}/200 karaktere</p>
              <div className="flex gap-2">
                {savedReceiptComment && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 text-xs text-red-500 hover:text-red-700"
                    onClick={clearSavedComment}
                  >
                    Fshi Default
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 text-xs"
                  onClick={saveCommentAsDefault}
                  disabled={!receiptComment}
                >
                  <Save className="h-3 w-3 mr-1" />
                  Ruaj si Default
                </Button>
              </div>
            </div>
            {savedReceiptComment && (
              <p className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                ✓ Koment default: "{savedReceiptComment.substring(0, 50)}{savedReceiptComment.length > 50 ? '...' : ''}"
              </p>
            )}
          </div>

          <div className="border rounded-lg overflow-auto flex-1 bg-gray-50 p-2">
            {receiptDataForPrint && (
              <div id="thermal-receipt-print" style={{ 
                fontFamily: "'Courier New', 'Lucida Console', monospace", 
                fontSize: '12px', 
                width: '90mm', 
                maxWidth: '90mm',
                minHeight: '140mm',
                margin: '0 auto',
                padding: '5mm',
                backgroundColor: '#fff',
                color: '#000',
                lineHeight: '1.4',
                border: '1px solid #ddd'
              }}>
                {/* === FISCAL-STYLE HEADER === */}
                <div style={{ textAlign: 'center', paddingBottom: '8px', marginBottom: '8px', borderBottom: '2px solid #000' }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '4px' }}>
                    {companySettings?.company_name || 'MOBILSHOPURIMI'}
                  </div>
                  {companySettings?.address && (
                    <div style={{ fontSize: '10px', marginBottom: '1px' }}>{companySettings.address}</div>
                  )}
                  {companySettings?.city && (
                    <div style={{ fontSize: '10px', marginBottom: '1px' }}>{companySettings.city}</div>
                  )}
                  {companySettings?.phone && (
                    <div style={{ fontSize: '10px' }}>Tel: {companySettings.phone}</div>
                  )}
                  <div style={{ marginTop: '6px', fontSize: '9px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
                    {companySettings?.nui && <span>NUI: {companySettings.nui}</span>}
                    {companySettings?.nf && <span>NF: {companySettings.nf}</span>}
                  </div>
                  {companySettings?.tvsh && (
                    <div style={{ fontSize: '9px' }}>Nr. TVSH: {companySettings.tvsh}</div>
                  )}
                </div>

                {/* === RECEIPT TYPE - FISCAL STYLE === */}
                <div style={{ 
                  textAlign: 'center', 
                  padding: '8px 0', 
                  marginBottom: '8px',
                  backgroundColor: '#f5f5f5',
                  border: '1px solid #000'
                }}>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', letterSpacing: '3px' }}>KUPON SHITJE</div>
                  <div style={{ fontSize: '10px', marginTop: '2px' }}>( Jo Fiskal - Për Evidencë )</div>
                </div>

                {/* === RECEIPT INFO === */}
                <div style={{ 
                  fontSize: '11px', 
                  borderBottom: '1px dashed #000', 
                  padding: '6px 0', 
                  marginBottom: '8px' 
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span><strong>Nr. Kuponit:</strong> {receiptDataForPrint.receipt_number}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span><strong>Data:</strong> {new Date(receiptDataForPrint.created_at).toLocaleDateString('sq-AL')}</span>
                    <span><strong>Ora:</strong> {new Date(receiptDataForPrint.created_at).toLocaleTimeString('sq-AL', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span><strong>Arkëtar:</strong> {user?.full_name || '-'}</span>
                  </div>
                </div>

                {/* === ITEMS TABLE HEADER === */}
                <div style={{ 
                  fontSize: '10px', 
                  fontWeight: 'bold', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  borderBottom: '2px solid #000', 
                  paddingBottom: '4px', 
                  marginBottom: '6px',
                  backgroundColor: '#f9f9f9',
                  padding: '4px'
                }}>
                  <span style={{ flex: 1 }}>PËRSHKRIMI</span>
                  <span style={{ width: '40px', textAlign: 'center' }}>SASIA</span>
                  <span style={{ width: '55px', textAlign: 'right' }}>ÇMIMI</span>
                  <span style={{ width: '60px', textAlign: 'right' }}>VLERA</span>
                </div>

                {/* === ITEMS LIST === */}
                <div style={{ marginBottom: '8px' }}>
                  {receiptDataForPrint.items?.map((item, index) => (
                    <div key={index} style={{ 
                      marginBottom: '6px', 
                      fontSize: '10px',
                      paddingBottom: '4px',
                      borderBottom: '1px dotted #ccc'
                    }}>
                      <div style={{ fontWeight: '600', wordBreak: 'break-word', marginBottom: '2px' }}>
                        {(item.product_name || 'Produkt').substring(0, 32)}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
                        <span style={{ flex: 1 }}></span>
                        <span style={{ width: '40px', textAlign: 'center' }}>{item.quantity}</span>
                        <span style={{ width: '55px', textAlign: 'right' }}>{(item.unit_price || 0).toFixed(2)}</span>
                        <span style={{ width: '60px', textAlign: 'right', fontWeight: 'bold' }}>
                          {(item.total || (item.quantity * item.unit_price)).toFixed(2)}
                        </span>
                      </div>
                      {item.discount_percent > 0 && (
                        <div style={{ fontSize: '9px', textAlign: 'right', color: '#666', fontStyle: 'italic' }}>
                          Zbritje: -{item.discount_percent}%
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* === SEPARATOR === */}
                <div style={{ borderTop: '2px solid #000', margin: '8px 0' }}></div>

                {/* === TOTALS SECTION === */}
                <div style={{ fontSize: '11px', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
                    <span>Nëntotali:</span>
                    <span>{(receiptDataForPrint.subtotal || 0).toFixed(2)} €</span>
                  </div>
                  {receiptDataForPrint.total_discount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666', padding: '2px 0' }}>
                      <span>Zbritja:</span>
                      <span>-{receiptDataForPrint.total_discount.toFixed(2)} €</span>
                    </div>
                  )}
                  {receiptDataForPrint.total_vat > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
                      <span>TVSH ({((receiptDataForPrint.total_vat / receiptDataForPrint.subtotal) * 100).toFixed(0) || 18}%):</span>
                      <span>{receiptDataForPrint.total_vat.toFixed(2)} €</span>
                    </div>
                  )}
                </div>

                {/* === GRAND TOTAL - FISCAL STYLE === */}
                <div style={{ 
                  backgroundColor: '#000',
                  color: '#fff',
                  padding: '8px 10px',
                  margin: '8px 0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}>
                  <span>TOTALI PËR PAGESË:</span>
                  <span>{(receiptDataForPrint.grand_total || 0).toFixed(2)} €</span>
                </div>

                {/* === PAYMENT INFO === */}
                <div style={{ 
                  fontSize: '11px', 
                  marginBottom: '8px',
                  padding: '8px',
                  backgroundColor: '#f9f9f9',
                  border: '1px solid #ddd'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span><strong>Mënyra e Pagesës:</strong></span>
                    <span style={{ fontWeight: 'bold' }}>{receiptDataForPrint.payment_method === 'cash' ? 'PARA NË DORË' : 'BANKË / KARTË'}</span>
                  </div>
                  {receiptDataForPrint.payment_method === 'cash' && (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                        <span>Shuma e Paguar:</span>
                        <span>{(receiptDataForPrint.cash_amount || 0).toFixed(2)} €</span>
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        fontWeight: 'bold', 
                        fontSize: '13px',
                        borderTop: '1px dashed #999',
                        paddingTop: '4px',
                        marginTop: '4px'
                      }}>
                        <span>KUSURI:</span>
                        <span>{(receiptDataForPrint.change_amount || 0).toFixed(2)} €</span>
                      </div>
                    </>
                  )}
                </div>

                {/* === COMMENT SECTION === */}
                {showCommentOnReceipt && receiptComment && (
                  <div style={{ 
                    borderTop: '1px dashed #000', 
                    paddingTop: '6px', 
                    marginTop: '4px',
                    fontSize: '9px'
                  }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>SHËNIM:</div>
                    <div style={{ 
                      fontStyle: 'italic', 
                      wordBreak: 'break-word',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {receiptComment}
                    </div>
                  </div>
                )}

                {/* === FOOTER === */}
                <div style={{ 
                  borderTop: '1px dashed #000', 
                  paddingTop: '6px', 
                  marginTop: '6px', 
                  textAlign: 'center' 
                }}>
                  <div style={{ fontSize: '11px', fontWeight: 'bold' }}>★ Faleminderit! ★</div>
                  <div style={{ fontSize: '9px', color: '#666', marginTop: '2px' }}>Mirë se vini përsëri</div>
                  <div style={{ fontSize: '8px', color: '#999', marginTop: '8px', letterSpacing: '0.5px' }}>
                    ════════════════════════════════
                  </div>
                  <div style={{ fontSize: '8px', color: '#666' }}>
                    {companySettings?.company_name || 'Mobilshopurimi'} POS
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Printer selection info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mt-2">
            <p className="text-xs text-blue-700">
              <span className="font-medium">💡</span> Kur klikoni "Printo", zgjidhni printerin nga dialogu.
            </p>
          </div>
          <div className="flex gap-2 mt-2">
            <Button variant="outline" className="flex-1" onClick={() => setShowReceiptPreview(false)}>
              Mbyll
            </Button>
            <Button className="flex-1 bg-[#E53935] hover:bg-[#D32F2F]" onClick={executeThermalPrint}>
              <Printer className="h-4 w-4 mr-2" />
              Printo Kuponin
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Invoice A4 Dialog */}
      <Dialog open={showInvoiceA4} onOpenChange={setShowInvoiceA4}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Fatura A4 - {currentSaleForPrint?.receipt_number || 'Preview'}</span>
              <Button
                onClick={executePrint}
                className="bg-[#E53935] hover:bg-[#D32F2F]"
              >
                <Printer className="h-4 w-4 mr-2" />
                Printo
              </Button>
            </DialogTitle>
          </DialogHeader>
          {/* Printer selection info for A4 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 -mt-2 mb-2">
            <p className="text-sm text-blue-700">
              <span className="font-medium">💡 Udhëzim:</span> Kur klikoni "Printo", do të hapet dialogu ku mund të zgjidhni printerin dhe madhësinë e letrës (A4).
            </p>
          </div>
          <div className="border rounded-lg overflow-hidden">
            <InvoiceA4 ref={invoiceRef} sale={currentSaleForPrint} companyInfo={companySettings} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Buyer Info Form Dialog */}
      <Dialog open={showBuyerForm} onOpenChange={setShowBuyerForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Të Dhënat e Blerësit</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Emri i Blerësit / Kompanisë</Label>
              <Input
                value={buyerInfo.name}
                onChange={(e) => setBuyerInfo({ ...buyerInfo, name: e.target.value })}
                placeholder="Emri i plotë ose emri i kompanisë"
              />
            </div>
            <div className="space-y-2">
              <Label>Adresa</Label>
              <Input
                value={buyerInfo.address}
                onChange={(e) => setBuyerInfo({ ...buyerInfo, address: e.target.value })}
                placeholder="Adresa e blerësit"
              />
            </div>
            <div className="space-y-2">
              <Label>Telefoni</Label>
              <Input
                value={buyerInfo.phone}
                onChange={(e) => setBuyerInfo({ ...buyerInfo, phone: e.target.value })}
                placeholder="+383 XX XXX XXX"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>NUI</Label>
                <Input
                  value={buyerInfo.nui}
                  onChange={(e) => setBuyerInfo({ ...buyerInfo, nui: e.target.value })}
                  placeholder="Numri Unik"
                />
              </div>
              <div className="space-y-2">
                <Label>NF</Label>
                <Input
                  value={buyerInfo.nf}
                  onChange={(e) => setBuyerInfo({ ...buyerInfo, nf: e.target.value })}
                  placeholder="Numri Fiskal"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowBuyerForm(false)}>
              Anulo
            </Button>
            <Button 
              onClick={proceedToPrintA4}
              className="bg-[#E53935] hover:bg-[#D32F2F]"
            >
              <FileDown className="h-4 w-4 mr-2" />
              Vazhdo me Faturën
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );

  // If cashier - show fullscreen POS with header
  if (isCashierFullscreen) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        {/* Cashier Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#E53935] p-1.5 rounded-lg">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                <line x1="12" y1="18" x2="12" y2="18"/>
              </svg>
            </div>
            <span className="text-xl font-bold">
              <span className="text-[#E53935]">Mobilshop</span>
              <span className="text-gray-500">urimi</span>
            </span>
            <span className="text-gray-400 mx-2">|</span>
            <span className="text-gray-600">Arka</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{user?.full_name}</p>
              <p className="text-xs text-gray-500">Arkëtar</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2 text-red-600 border-red-200 hover:bg-red-50"
              data-testid="logout-btn"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Çkyçu</span>
            </Button>
          </div>
        </header>
        
        {/* POS Content */}
        <main className="p-4">
          {posContent}
        </main>
      </div>
    );
  }

  // For admin/manager - return normal content (will be inside MainLayout)
  return posContent;
};

export default POS;
