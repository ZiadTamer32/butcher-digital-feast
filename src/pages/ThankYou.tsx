import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const ThankYou = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);

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

        <div className="bg-secondary/50 rounded-lg p-6 mb-8">
          <p className="text-lg text-foreground">
            سيتم تحويلك إلى صفحة المنتجات خلال{" "}
            <span className="text-3xl font-bold text-primary">{countdown}</span>{" "}
            ثواني
          </p>
        </div>

        <Button
          onClick={() => navigate("/products")}
          variant="hero"
          size="lg"
          className="mb-4"
        >
          العودة إلى المنتجات الآن
        </Button>

        <div className="mt-6">
          <Button
            onClick={() => navigate("/")}
            variant="outline"
          >
            العودة إلى الصفحة الرئيسية
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
