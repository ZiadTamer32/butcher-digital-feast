import { useState } from "react";
import { Product } from "@/data/products";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const isAvailable = product.available !== false;

  const handleAddToCart = () => {
    if (quantity > 0 && isAvailable) {
      addToCart(product, quantity);
      toast.success(`تم إضافة ${product.nameAr} إلى السلة`);
      setQuantity(1);
    }
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  return (
    <div className="gradient-card rounded-xl overflow-hidden shadow-soft hover:shadow-medium transition-smooth border border-border relative">
      {!isAvailable && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
          <Badge variant="destructive" className="text-lg px-6 py-2">
            غير متوفر حالياً
          </Badge>
        </div>
      )}
      <div className="aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.nameAr}
          className="w-full h-full object-cover hover:scale-105 transition-smooth"
        />
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold text-foreground">
            {product.nameAr}
          </h3>
          {isAvailable && (
            <Badge variant="outline" className="bg-accent/10 text-accent border-accent">
              متوفر
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground mb-4">{product.description}</p>
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-primary">
            {product.price} ج.م
          </span>
          <span className="text-sm text-muted-foreground">للكيلو</span>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center border border-border rounded-lg overflow-hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={decrementQuantity}
              disabled={!isAvailable || quantity <= 1}
              className="h-10 w-10 rounded-none"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="w-12 text-center font-semibold">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={incrementQuantity}
              disabled={!isAvailable}
              className="h-10 w-10 rounded-none"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <Button onClick={handleAddToCart} className="flex-1 gap-2" disabled={!isAvailable}>
            <ShoppingCart className="w-4 h-4" />
            أضف للسلة
          </Button>
        </div>
      </div>
    </div>
  );
};
