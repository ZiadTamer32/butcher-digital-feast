import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  const { getTotalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    </nav>
  );
};
