import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X, Package, Clock, CheckCircle, ArrowRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";

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

export const Navbar = () => {
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);

  useEffect(() => {
    const loadLatestOrder = () => {
      const orders = JSON.parse(localStorage.getItem("orders") || "[]");
      if (orders.length > 0) {
        setLatestOrder(orders[orders.length - 1]);
      }
    };

    loadLatestOrder();
    
    // Listen for storage changes to update when new orders are placed
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "orders") {
        loadLatestOrder();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Also listen for custom event when order is placed in same tab
    const handleOrderPlaced = () => loadLatestOrder();
    window.addEventListener("orderPlaced", handleOrderPlaced);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("orderPlaced", handleOrderPlaced);
    };
  }, []);

  const getStatusInfo = (status: OrderStatus) => {
    const statusConfig: Record<OrderStatus, { 
      label: string; 
      variant: "default" | "secondary" | "destructive" | "outline";
      estimatedTime: string;
      description: string;
    }> = {
      pending: { 
        label: "قيد الانتظار", 
        variant: "secondary",
        estimatedTime: "15-30 دقيقة",
        description: "جاري مراجعة الطلب وسيتم تأكيده قريباً"
      },
      confirmed: { 
        label: "مؤكد", 
        variant: "default",
        estimatedTime: "30-45 دقيقة",
        description: "تم تأكيد طلبك وجاري التحضير"
      },
      preparing: { 
        label: "قيد التحضير", 
        variant: "default",
        estimatedTime: "20-30 دقيقة",
        description: "جاري تحضير طلبك بعناية"
      },
      ready: { 
        label: "جاهز للاستلام", 
        variant: "default",
        estimatedTime: "متاح الآن",
        description: "طلبك جاهز! يمكنك الاستلام الآن"
      },
      completed: { 
        label: "مكتمل", 
        variant: "outline",
        estimatedTime: "تم التسليم",
        description: "تم إكمال الطلب بنجاح"
      },
      cancelled: { 
        label: "ملغي", 
        variant: "destructive",
        estimatedTime: "ملغي",
        description: "تم إلغاء هذا الطلب"
      },
    };
    return statusConfig[status];
  };

  const getProgressPercentage = (status: OrderStatus): number => {
    const statusProgress: Record<OrderStatus, number> = {
      pending: 20,
      confirmed: 40,
      preparing: 60,
      ready: 80,
      completed: 100,
      cancelled: 0,
    };
    return statusProgress[status];
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-soft">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl md:text-2xl font-bold text-primary hover:text-accent transition-smooth">
            جزارة أولاد حسن سيد الحداد
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-foreground hover:text-primary transition-smooth font-semibold">
              الرئيسية
            </Link>
            <Link to="/products" className="text-foreground hover:text-primary transition-smooth font-semibold">
              المنتجات
            </Link>
            <Link to="/dashboard" className="text-foreground hover:text-primary transition-smooth font-semibold">
              لوحة التحكم
            </Link>
            {latestOrder && (
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setDrawerOpen(true)}
                className="relative"
              >
                <Package className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></span>
              </Button>
            )}
            <Link to="/confirm">
              <Button variant="outline" className="relative gap-2">
                <ShoppingCart className="w-5 h-5" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                    {getTotalItems()}
                  </span>
                )}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            {latestOrder && (
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setDrawerOpen(true)}
                className="relative"
              >
                <Package className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></span>
              </Button>
            )}
            <Link to="/confirm">
              <Button variant="outline" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    {getTotalItems()}
                  </span>
                )}
              </Button>
            </Link>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 flex flex-col gap-3">
            <Link
              to="/"
              className="text-foreground hover:text-primary transition-smooth font-semibold py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              الرئيسية
            </Link>
            <Link
              to="/products"
              className="text-foreground hover:text-primary transition-smooth font-semibold py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              المنتجات
            </Link>
            <Link
              to="/dashboard"
              className="text-foreground hover:text-primary transition-smooth font-semibold py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              لوحة التحكم
            </Link>
          </div>
        )}
      </div>

      {/* Order Tracking Drawer */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Package className="w-10 h-10 text-primary" />
              </div>
            </div>
            <DrawerTitle className="text-2xl">تتبع طلبك</DrawerTitle>
            <DrawerDescription className="text-base">
              رقم الطلب: <span className="font-bold text-foreground">#{latestOrder?.id}</span>
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 pb-4 overflow-y-auto">
            {latestOrder && (
              <div className="space-y-4">
                {/* Status Badge */}
                <div className="flex justify-center">
                  <Badge variant={getStatusInfo(latestOrder.status).variant} className="text-lg px-4 py-2">
                    {getStatusInfo(latestOrder.status).label}
                  </Badge>
                </div>

                {/* Progress Bar */}
                {latestOrder.status !== 'cancelled' && (
                  <div className="px-4">
                    <div className="h-2 bg-secondary/30 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-primary-glow transition-all duration-500"
                        style={{ width: `${getProgressPercentage(latestOrder.status)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Estimated Time */}
                <div className="gradient-card p-4 rounded-lg mx-4">
                  <div className="flex items-center gap-3">
                    <Clock className="w-6 h-6 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground">الوقت المقدر للتسليم</p>
                      <p className="text-muted-foreground">{getStatusInfo(latestOrder.status).estimatedTime}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">
                    {getStatusInfo(latestOrder.status).description}
                  </p>
                </div>

                {/* Order Items Summary */}
                <div className="gradient-card p-4 rounded-lg mx-4">
                  <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    ملخص الطلب
                  </h3>
                  <div className="space-y-2">
                    {latestOrder.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center p-2 bg-secondary/30 rounded-lg"
                      >
                        <div>
                          <p className="font-semibold text-foreground text-sm">{item.nameAr}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.quantity} كجم × {item.price} ج.م
                          </p>
                        </div>
                        <p className="font-bold text-primary">
                          {item.quantity * item.price} ج.م
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-border flex justify-between items-center">
                    <span className="font-bold text-foreground">المجموع الكلي:</span>
                    <span className="text-xl font-bold text-primary">{latestOrder.total} ج.م</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DrawerFooter className="flex-row gap-2 px-4 pb-6">
            <Button 
              onClick={() => {
                setDrawerOpen(false);
                navigate(`/order/${latestOrder?.id}`);
              }}
              variant="hero"
              className="flex-1"
            >
              عرض التفاصيل الكاملة
              <ArrowRight className="mr-2 h-4 w-4" />
            </Button>
            <Button 
              onClick={() => setDrawerOpen(false)}
              variant="outline"
              className="flex-1"
            >
              إغلاق
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </nav>
  );
};
