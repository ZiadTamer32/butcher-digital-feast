import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Clock, MapPin, Phone, Mail, User, Calendar } from "lucide-react";

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

const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const foundOrder = savedOrders.find((o: Order) => o.id === orderId);
    setOrder(foundOrder || null);
  }, [orderId]);

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
        description: "جاري مراجعة الطلب"
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

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <Package className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-foreground mb-4">
            الطلب غير موجود
          </h2>
          <p className="text-muted-foreground mb-8">
            لم نتمكن من العثور على الطلب برقم: {orderId}
          </p>
          <Button onClick={() => navigate("/products")} variant="hero">
            تصفح المنتجات
          </Button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);
  const progress = getProgressPercentage(order.status);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="gradient-card p-6 md:p-8 rounded-xl shadow-soft mb-6">
            {order.status === 'cancelled' && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                    <Package className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <h3 className="font-bold text-destructive mb-1">تم إلغاء الطلب</h3>
                    <p className="text-sm text-muted-foreground">
                      نعتذر، تم إلغاء هذا الطلب. للمزيد من المعلومات يرجى التواصل معنا.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  تتبع الطلب
                </h1>
                <p className="text-muted-foreground">
                  رقم الطلب: <span className="font-semibold text-foreground">#{order.id}</span>
                </p>
              </div>
              <Badge variant={statusInfo.variant} className="text-lg px-4 py-2 self-start md:self-center">
                {statusInfo.label}
              </Badge>
            </div>

            {/* Progress Bar */}
            {order.status !== 'cancelled' && (
              <div className="mb-6">
                <div className="h-3 bg-secondary/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-primary-glow transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Estimated Time */}
            <div className="flex items-center gap-3 p-4 bg-secondary/20 rounded-lg mb-4">
              <Clock className="w-6 h-6 text-primary" />
              <div>
                <p className="font-semibold text-foreground">الوقت المقدر للتسليم</p>
                <p className="text-muted-foreground">{statusInfo.estimatedTime}</p>
              </div>
            </div>

            <p className="text-muted-foreground">{statusInfo.description}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Customer Info */}
            <div className="gradient-card p-6 rounded-xl shadow-soft">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                معلومات العميل
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">الاسم</p>
                    <p className="font-semibold text-foreground">{order.customer.fullName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">رقم الهاتف</p>
                    <p className="font-semibold text-foreground" dir="ltr">{order.customer.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">البريد الإلكتروني</p>
                    <p className="font-semibold text-foreground break-all">{order.customer.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">العنوان</p>
                    <p className="font-semibold text-foreground">{order.customer.address}</p>
                  </div>
                </div>
                {order.customer.notes && (
                  <div className="flex items-start gap-3 pt-3 border-t border-border">
                    <div>
                      <p className="text-sm text-muted-foreground">ملاحظات</p>
                      <p className="font-semibold text-foreground">{order.customer.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Details */}
            <div className="gradient-card p-6 rounded-xl shadow-soft">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                تفاصيل الطلب
              </h2>
              <div className="space-y-3 mb-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-start p-3 bg-secondary/30 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{item.nameAr}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} كجم × {item.price} ج.م
                      </p>
                    </div>
                    <p className="font-bold text-primary whitespace-nowrap mr-2">
                      {item.quantity * item.price} ج.م
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t border-border space-y-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <p className="text-sm">
                    {new Date(order.date).toLocaleString("ar-EG")}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-foreground">المجموع الكلي:</span>
                  <span className="text-2xl font-bold text-primary">{order.total} ج.م</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => navigate("/products")} variant="hero" size="lg">
              تصفح المزيد من المنتجات
            </Button>
            <Button onClick={() => navigate("/")} variant="outline" size="lg">
              العودة إلى الصفحة الرئيسية
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
