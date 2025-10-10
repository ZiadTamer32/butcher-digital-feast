import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import heroImage from "@/assets/hero-butcher.jpg";
import { ShoppingBag, Award, Clock, Beef } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="جزارة أولاد حسن سيد الحداد"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 to-background/60" />
        </div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              جزارة أولاد حسن <br />
              <span className="text-primary">سيد الحداد</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              أفضل أنواع اللحوم الطازجة والمضمونة. جودة عالية وخدمة ممتازة منذ سنوات
            </p>
            <Link to="/products">
              <Button variant="hero" size="lg" className="gap-3">
                <ShoppingBag className="w-5 h-5" />
                تصفح المنتجات
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-foreground mb-6">من نحن</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              جزارة أولاد حسن سيد الحداد هي واحدة من أعرق الجزارات في المنطقة. نفخر بتقديم
              أفضل أنواع اللحوم الطازجة والمضمونة لعملائنا الكرام. نحن نؤمن بأن الجودة
              ليست خياراً بل هي التزام، ولذلك نختار بعناية فائقة كل قطعة لحم نقدمها لكم.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              مع سنوات من الخبرة في مجال اللحوم، نحن نعرف ما يبحث عنه عملاؤنا ونسعى دائماً
              لتجاوز توقعاتهم. فريقنا المحترف مستعد دائماً لتقديم المشورة ومساعدتكم في
              اختيار الأنسب لاحتياجاتكم.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 gradient-card rounded-xl shadow-soft">
              <div className="w-16 h-16 gradient-hero rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                جودة عالية
              </h3>
              <p className="text-muted-foreground">
                نختار بعناية أفضل أنواع اللحوم لضمان رضا عملائنا
              </p>
            </div>

            <div className="text-center p-8 gradient-card rounded-xl shadow-soft">
              <div className="w-16 h-16 gradient-hero rounded-full flex items-center justify-center mx-auto mb-6">
                <Beef className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                لحوم طازجة
              </h3>
              <p className="text-muted-foreground">
                لحوم طازجة يومياً لضمان أفضل مذاق وجودة
              </p>
            </div>

            <div className="text-center p-8 gradient-card rounded-xl shadow-soft">
              <div className="w-16 h-16 gradient-hero rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                خدمة سريعة
              </h3>
              <p className="text-muted-foreground">
                نوصل طلباتكم بسرعة وكفاءة عالية
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-primary-foreground mb-6">
            جاهز للطلب؟
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            تصفح منتجاتنا الآن واطلب ما يناسبك
          </p>
          <Link to="/products">
            <Button
              variant="outline"
              size="lg"
              className="bg-background hover:bg-background/90 text-foreground border-2 border-background"
            >
              استكشف المنتجات
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary/50 py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2025 جزارة أولاد حسن سيد الحداد. جميع الحقوق محفوظة.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
