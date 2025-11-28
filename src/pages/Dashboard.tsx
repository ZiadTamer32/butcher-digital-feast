import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Lock, Mail, Eye, EyeOff, Pencil, Trash2, Plus, TrendingUp, Package, ShoppingCart, DollarSign } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Product, products as initialProducts } from "@/data/products";

type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
type OrderFilter = 'all' | 'new' | 'seen' | 'cancelled';
type TimePeriod = 'monthly' | '3months' | '6months';

interface Order {
  id: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    notes: string;
  };
  items: Array<{
    id: string;
    nameAr: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  date: string;
  status: OrderStatus;
  seen?: boolean;
}

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderFilter, setOrderFilter] = useState<OrderFilter>('all');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('monthly');
  const [products, setProducts] = useState<Product[]>([]);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: "",
    nameAr: "",
    description: "",
    price: 0,
    category: "beef",
    image: "",
    available: true,
  });

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
      loadProducts();
    }
  }, [isAuthenticated]);

  // Initialize products in localStorage if not exists
  useEffect(() => {
    const savedProducts = localStorage.getItem("products");
    if (!savedProducts) {
      localStorage.setItem("products", JSON.stringify(initialProducts));
    }
  }, []);

  const loadOrders = () => {
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(savedOrders.reverse()); // Show newest first
  };

  const loadProducts = () => {
    const savedProducts = JSON.parse(localStorage.getItem("products") || "[]");
    setProducts(savedProducts);
  };

  const handleProductSubmit = () => {
    if (!productForm.name || !productForm.nameAr || !productForm.price) {
      toast.error("الرجاء ملء جميع الحقول المطلوبة");
      return;
    }

    const savedProducts = JSON.parse(localStorage.getItem("products") || "[]");
    
    if (editingProduct) {
      // Update existing product
      const updatedProducts = savedProducts.map((p: Product) =>
        p.id === editingProduct.id ? { ...editingProduct, ...productForm } : p
      );
      localStorage.setItem("products", JSON.stringify(updatedProducts));
      toast.success("تم تحديث المنتج بنجاح");
    } else {
      // Add new product
      const newProduct: Product = {
        id: Date.now().toString(),
        name: productForm.name!,
        nameAr: productForm.nameAr!,
        description: productForm.description || "",
        price: productForm.price!,
        category: productForm.category as "beef" | "lamb" | "chicken",
        image: productForm.image || "",
      };
      savedProducts.push(newProduct);
      localStorage.setItem("products", JSON.stringify(savedProducts));
      toast.success("تم إضافة المنتج بنجاح");
    }

    loadProducts();
    setIsProductDialogOpen(false);
    resetProductForm();
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      const savedProducts = JSON.parse(localStorage.getItem("products") || "[]");
      const updatedProducts = savedProducts.filter((p: Product) => p.id !== productId);
      localStorage.setItem("products", JSON.stringify(updatedProducts));
      loadProducts();
      toast.success("تم حذف المنتج");
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      nameAr: product.nameAr,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      available: product.available !== false,
    });
    setIsProductDialogOpen(true);
  };

  const resetProductForm = () => {
    setEditingProduct(null);
    setProductForm({
      name: "",
      nameAr: "",
      description: "",
      price: 0,
      category: "beef",
      image: "",
      available: true,
    });
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const updatedOrders = savedOrders.map((order: Order) =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    setOrders(updatedOrders.reverse());
    toast.success("تم تحديث حالة الطلب");
  };

  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig: Record<OrderStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      pending: { label: "قيد الانتظار", variant: "secondary" },
      confirmed: { label: "مؤكد", variant: "default" },
      preparing: { label: "قيد التحضير", variant: "default" },
      ready: { label: "جاهز", variant: "default" },
      completed: { label: "مكتمل", variant: "outline" },
      cancelled: { label: "ملغي", variant: "destructive" },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const markOrderAsSeen = (orderId: string) => {
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const updatedOrders = savedOrders.map((order: Order) =>
      order.id === orderId ? { ...order, seen: true } : order
    );
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    setOrders(updatedOrders.reverse());
  };

  const getFilteredOrders = () => {
    switch (orderFilter) {
      case 'new':
        return orders.filter(order => !order.seen);
      case 'seen':
        return orders.filter(order => order.seen);
      case 'cancelled':
        return orders.filter(order => order.status === 'cancelled');
      case 'all':
      default:
        return orders;
    }
  };

  const filteredOrders = getFilteredOrders();

  const getOrdersByTimePeriod = () => {
    const now = new Date();
    const monthsBack = timePeriod === 'monthly' ? 1 : timePeriod === '3months' ? 3 : 6;
    const cutoffDate = new Date(now.setMonth(now.getMonth() - monthsBack));
    
    return orders.filter(order => new Date(order.date) >= cutoffDate);
  };

  const calculateStats = () => {
    const periodOrders = getOrdersByTimePeriod();
    
    // Calculate total revenue (net profit)
    const totalRevenue = periodOrders
      .filter(order => order.status !== 'cancelled')
      .reduce((sum, order) => sum + order.total, 0);
    
    // Calculate best seller
    const productSales: Record<string, { name: string; revenue: number; quantity: number }> = {};
    
    periodOrders
      .filter(order => order.status !== 'cancelled')
      .forEach(order => {
        order.items.forEach(item => {
          if (!productSales[item.id]) {
            productSales[item.id] = { name: item.nameAr, revenue: 0, quantity: 0 };
          }
          productSales[item.id].revenue += item.price * item.quantity;
          productSales[item.id].quantity += item.quantity;
        });
      });
    
    const bestSeller = Object.values(productSales).sort((a, b) => b.revenue - a.revenue)[0] || null;
    
    return {
      totalRevenue,
      totalOrders: periodOrders.filter(order => order.status !== 'cancelled').length,
      totalProducts: products.length,
      bestSeller,
    };
  };

  const stats = calculateStats();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (email === "admin@gmail.com" && password === "123456") {
      setIsAuthenticated(true);
      toast.success("تم تسجيل الدخول بنجاح!");
    } else {
      toast.error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setEmail("");
    setPassword("");
    toast.success("تم تسجيل الخروج");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto gradient-card p-8 rounded-2xl shadow-strong">
            <div className="text-center mb-8">
              <div className="w-16 h-16 gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                لوحة التحكم
              </h1>
              <p className="text-muted-foreground">
                تسجيل الدخول للوصول إلى الطلبات
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@gmail.com"
                    className="pr-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  كلمة المرور
                </label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••"
                    className="pr-10 pl-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button type="submit" variant="hero" size="lg" className="w-full">
                تسجيل الدخول
              </Button>
            </form>

            <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                البريد: admin@gmail.com
                <br />
                كلمة المرور: 123456
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              لوحة التحكم
            </h1>
            <p className="text-muted-foreground">
              إدارة ومتابعة جميع الطلبات والمنتجات
            </p>
          </div>
          <Button onClick={handleLogout} variant="destructive">
            تسجيل الخروج
          </Button>
        </div>

        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="orders">الطلبات</TabsTrigger>
            <TabsTrigger value="products">المنتجات</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            {/* Time Period Filter */}
            <div className="flex justify-end mb-6">
              <Select value={timePeriod} onValueChange={(value) => setTimePeriod(value as TimePeriod)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">شهر واحد</SelectItem>
                  <SelectItem value="3months">3 أشهر</SelectItem>
                  <SelectItem value="6months">6 أشهر</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="gradient-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">أفضل مبيعات</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {stats.bestSeller ? stats.bestSeller.name : 'لا يوجد'}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.bestSeller ? `${stats.bestSeller.revenue.toFixed(0)} ج.م` : '0 ج.م'}
                  </p>
                </CardContent>
              </Card>

              <Card className="gradient-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">صافي الربح</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {stats.totalRevenue.toFixed(0)} ج.م
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    إجمالي الإيرادات
                  </p>
                </CardContent>
              </Card>

              <Card className="gradient-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">إجمالي الطلبات</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {stats.totalOrders}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    طلبات مكتملة
                  </p>
                </CardContent>
              </Card>

              <Card className="gradient-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">إجمالي المنتجات</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {stats.totalProducts}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    منتجات متاحة
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Button
                variant={orderFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setOrderFilter('all')}
              >
                الكل ({orders.length})
              </Button>
              <Button
                variant={orderFilter === 'new' ? 'default' : 'outline'}
                onClick={() => setOrderFilter('new')}
              >
                جديد ({orders.filter(o => !o.seen).length})
              </Button>
              <Button
                variant={orderFilter === 'seen' ? 'default' : 'outline'}
                onClick={() => setOrderFilter('seen')}
              >
                تمت المشاهدة ({orders.filter(o => o.seen).length})
              </Button>
              <Button
                variant={orderFilter === 'cancelled' ? 'default' : 'outline'}
                onClick={() => setOrderFilter('cancelled')}
              >
                ملغي ({orders.filter(o => o.status === 'cancelled').length})
              </Button>
            </div>

        {filteredOrders.length === 0 ? (
          <div className="gradient-card p-12 rounded-xl shadow-soft text-center">
            <p className="text-xl text-muted-foreground">
              لا توجد طلبات في هذا الفلتر
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="gradient-card p-6 rounded-xl shadow-soft"
              >
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-4">
                      بيانات العميل
                    </h3>
                    <div className="space-y-2 text-muted-foreground">
                      <p>
                        <span className="font-semibold text-foreground">الاسم:</span>{" "}
                        {order.customer.fullName}
                      </p>
                      <p>
                        <span className="font-semibold text-foreground">البريد:</span>{" "}
                        {order.customer.email}
                      </p>
                      <p>
                        <span className="font-semibold text-foreground">الهاتف:</span>{" "}
                        {order.customer.phone}
                      </p>
                      <p>
                        <span className="font-semibold text-foreground">العنوان:</span>{" "}
                        {order.customer.address}
                      </p>
                      {order.customer.notes && (
                        <p>
                          <span className="font-semibold text-foreground">ملاحظات:</span>{" "}
                          {order.customer.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-4">
                      تفاصيل الطلب
                    </h3>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-center p-3 bg-secondary/30 rounded-lg"
                        >
                          <span className="font-semibold">{item.nameAr}</span>
                          <span className="text-muted-foreground">
                            {item.quantity} كجم × {item.price} ج.م
                          </span>
                          <span className="font-bold text-primary">
                            {item.quantity * item.price} ج.م
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-border space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="text-muted-foreground">
                      <span className="font-semibold">تاريخ الطلب:</span>{" "}
                      {new Date(order.date).toLocaleString("ar-EG")}
                    </div>
                    <div className="text-xl sm:text-2xl font-bold">
                      <span className="text-foreground">المجموع:</span>{" "}
                      <span className="text-primary">{order.total} ج.م</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 bg-secondary/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">حالة الطلب:</span>
                      {getStatusBadge(order.status)}
                      {!order.seen && (
                        <Badge variant="secondary" className="mr-2">جديد</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-1 sm:justify-end">
                      <span className="text-sm text-muted-foreground">تحديث الحالة:</span>
                      <Select
                        value={order.status}
                        onValueChange={(value) => {
                          updateOrderStatus(order.id, value as OrderStatus);
                          if (!order.seen) markOrderAsSeen(order.id);
                        }}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">قيد الانتظار</SelectItem>
                          <SelectItem value="confirmed">مؤكد</SelectItem>
                          <SelectItem value="preparing">قيد التحضير</SelectItem>
                          <SelectItem value="ready">جاهز</SelectItem>
                          <SelectItem value="completed">مكتمل</SelectItem>
                          <SelectItem value="cancelled">ملغي</SelectItem>
                        </SelectContent>
                      </Select>
                      {!order.seen && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markOrderAsSeen(order.id)}
                        >
                          تمت المشاهدة
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
          </TabsContent>

          <TabsContent value="products">
            <div className="mb-6 flex justify-end">
              <Dialog open={isProductDialogOpen} onOpenChange={(open) => {
                setIsProductDialogOpen(open);
                if (!open) resetProductForm();
              }}>
                <DialogTrigger asChild>
                  <Button variant="hero" size="lg">
                    <Plus className="ml-2 h-5 w-5" />
                    إضافة منتج جديد
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingProduct ? "تعديل المنتج" : "إضافة منتج جديد"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingProduct ? "قم بتعديل بيانات المنتج" : "أضف منتج جديد إلى المتجر"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">اسم المنتج (EN)</Label>
                        <Input
                          id="name"
                          value={productForm.name}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                          placeholder="Product Name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nameAr">اسم المنتج (AR)</Label>
                        <Input
                          id="nameAr"
                          value={productForm.nameAr}
                          onChange={(e) => setProductForm({ ...productForm, nameAr: e.target.value })}
                          placeholder="اسم المنتج"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">الوصف</Label>
                      <Textarea
                        id="description"
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        placeholder="وصف المنتج"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">السعر (ج.م/كجم)</Label>
                        <Input
                          id="price"
                          type="number"
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) })}
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">الفئة</Label>
                        <Select
                          value={productForm.category}
                          onValueChange={(value) => setProductForm({ ...productForm, category: value as "beef" | "lamb" | "chicken" })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beef">لحم بقري</SelectItem>
                            <SelectItem value="lamb">لحم غنم</SelectItem>
                            <SelectItem value="chicken">دجاج</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="image">رابط الصورة</Label>
                      <Input
                        id="image"
                        value={productForm.image}
                        onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Checkbox
                        id="available"
                        checked={productForm.available !== false}
                        onCheckedChange={(checked) => 
                          setProductForm({ ...productForm, available: checked as boolean })
                        }
                      />
                      <Label
                        htmlFor="available"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        المنتج متوفر للبيع
                      </Label>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsProductDialogOpen(false);
                        resetProductForm();
                      }}
                    >
                      إلغاء
                    </Button>
                    <Button variant="hero" onClick={handleProductSubmit}>
                      {editingProduct ? "حفظ التعديلات" : "إضافة المنتج"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {products.length === 0 ? (
              <div className="gradient-card p-12 rounded-xl shadow-soft text-center">
                <p className="text-xl text-muted-foreground">
                  لا توجد منتجات حالياً
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="gradient-card p-6 rounded-xl shadow-soft"
                  >
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.nameAr}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {product.nameAr}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-1">
                      {product.name}
                    </p>
                    <p className="text-muted-foreground mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="outline">
                        {product.category === "beef" && "لحم بقري"}
                        {product.category === "lamb" && "لحم غنم"}
                        {product.category === "chicken" && "دجاج"}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-primary">
                          {product.price} ج.م
                        </span>
                      </div>
                    </div>
                    <div className="mb-4">
                      <Badge 
                        variant={product.available !== false ? "outline" : "destructive"}
                        className={product.available !== false ? "bg-accent/10 text-accent border-accent" : ""}
                      >
                        {product.available !== false ? "متوفر" : "غير متوفر"}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Pencil className="ml-2 h-4 w-4" />
                        تعديل
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="ml-2 h-4 w-4" />
                        حذف
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
