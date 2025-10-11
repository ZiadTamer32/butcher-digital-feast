import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';

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
}

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    }
  }, [isAuthenticated]);

  const loadOrders = () => {
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(savedOrders.reverse()); // Show newest first
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
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

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
              إدارة ومتابعة جميع الطلبات
            </p>
          </div>
          <Button onClick={handleLogout} variant="destructive">
            تسجيل الخروج
          </Button>
        </div>

        {orders.length === 0 ? (
          <div className="gradient-card p-12 rounded-xl shadow-soft text-center">
            <p className="text-xl text-muted-foreground">
              لا توجد طلبات حالياً
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
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
                    </div>
                    <div className="flex items-center gap-2 flex-1 sm:justify-end">
                      <span className="text-sm text-muted-foreground">تحديث الحالة:</span>
                      <Select
                        value={order.status}
                        onValueChange={(value) => updateOrderStatus(order.id, value as OrderStatus)}
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
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
