import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

interface OrderForm {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
}

const ConfirmOrder = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } =
    useCart();

  const [formData, setFormData] = useState<OrderForm>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
      toast.error("الرجاء ملء جميع الحقول المطلوبة");
      return;
    }

    if (cart.length === 0) {
      toast.error("السلة فارغة! أضف منتجات أولاً");
      return;
    }

    // Save order to localStorage (in real app, send to backend)
    const order = {
      id: Date.now().toString(),
      customer: formData,
      items: cart,
      total: getTotalPrice(),
      date: new Date().toISOString(),
      status: 'pending' as const,
    };

    const existingOrders = JSON.parse(
      localStorage.getItem("orders") || "[]"
    );
    localStorage.setItem("orders", JSON.stringify([...existingOrders, order]));

    clearCart();
    toast.success("تم تأكيد الطلب بنجاح!");
    navigate(`/thank-you?orderId=${order.id}`);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            السلة فارغة!
          </h2>
          <p className="text-muted-foreground mb-8">
            أضف بعض المنتجات إلى سلتك أولاً
          </p>
          <Button onClick={() => navigate("/products")} variant="hero">
            تصفح المنتجات
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-8">
          تأكيد الطلب
        </h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="gradient-card p-4 md:p-6 rounded-xl shadow-soft h-fit">
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4 md:mb-6">
              ملخص الطلب
            </h2>
            <div className="space-y-3 md:space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 md:p-4 bg-secondary/30 rounded-lg"
                >
                  <img
                    src={item.image}
                    alt={item.nameAr}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground text-sm md:text-base">{item.nameAr}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {item.price} ج.م × {item.quantity} كجم
                    </p>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-2">
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.id, parseInt(e.target.value) || 1)
                        }
                        className="w-16 sm:w-20 text-center text-sm"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => removeFromCart(item.id)}
                        className="h-9 w-9"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="font-bold text-primary text-sm md:text-base whitespace-nowrap">
                      {item.price * item.quantity} ج.م
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-border">
              <div className="flex justify-between items-center text-lg md:text-2xl font-bold">
                <span className="text-foreground">المجموع:</span>
                <span className="text-primary">{getTotalPrice()} ج.م</span>
              </div>
            </div>
          </div>

          {/* Customer Form */}
          <div className="gradient-card p-4 md:p-6 rounded-xl shadow-soft">
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4 md:mb-6">
              بيانات العميل
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  الاسم الكامل *
                </label>
                <Input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="أدخل اسمك الكامل"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  البريد الإلكتروني *
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="example@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  رقم الهاتف *
                </label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="01xxxxxxxxx"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  العنوان *
                </label>
                <Textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="أدخل عنوانك بالتفصيل"
                  required
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  ملاحظات إضافية
                </label>
                <Textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="أي ملاحظات خاصة بالطلب (اختياري)"
                  rows={3}
                />
              </div>

              <Button type="submit" variant="hero" size="lg" className="w-full">
                تأكيد الطلب
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmOrder;
