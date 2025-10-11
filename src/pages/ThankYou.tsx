import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

const ThankYou = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/products");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full gradient-card p-12 rounded-2xl shadow-strong text-center">
        <div className="w-24 h-24 gradient-hero rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="w-16 h-16 text-primary-foreground" />
        </div>

        <h1 className="text-4xl font-bold text-foreground mb-4">
          شكراً لطلبك!
        </h1>

        <p className="text-xl text-muted-foreground mb-6">
          تم استلام طلبك بنجاح وسنتواصل معك قريباً
        </p>

        {orderId && (
          <div className="bg-secondary/50 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Package className="w-5 h-5 text-primary" />
              <p className="font-semibold text-foreground">رقم الطلب</p>
            </div>
            <p className="text-3xl font-bold text-primary mb-4">#{orderId}</p>
            <Button
              onClick={() => navigate(`/order/${orderId}`)}
              variant="outline"
              size="lg"
              className="w-full"
            >
              تتبع طلبك
            </Button>
          </div>
        )}

        <div className="bg-secondary/30 rounded-lg p-4 mb-8">
          <p className="text-sm text-muted-foreground">
            سيتم تحويلك إلى صفحة المنتجات خلال{" "}
            <span className="text-2xl font-bold text-primary">{countdown}</span>{" "}
            ثواني
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => navigate("/products")}
            variant="hero"
            size="lg"
          >
            تصفح المنتجات
          </Button>

          <Button
            onClick={() => navigate("/")}
            variant="outline"
            size="lg"
          >
            الصفحة الرئيسية
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
