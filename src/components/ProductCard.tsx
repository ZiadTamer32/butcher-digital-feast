import { useState } from "react";
import { Product } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (quantity > 0) {
      addToCart(product, quantity);
      toast.success(`تم إضافة ${product.nameAr} إلى السلة`);
      setQuantity(1);
    }
  };

  return (
    <div className="gradient-card rounded-xl overflow-hidden shadow-soft hover:shadow-medium transition-smooth border border-border">
      <div className="aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.nameAr}
          className="w-full h-full object-cover hover:scale-105 transition-smooth"
        />
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-foreground mb-2">
          {product.nameAr}
        </h3>
        <p className="text-muted-foreground mb-4">{product.description}</p>
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-primary">
            {product.price} ج.م
          </span>
          <span className="text-sm text-muted-foreground">للكيلو</span>
        </div>
        <div className="flex gap-3">
          <Input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            className="w-24 text-center"
          />
          <Button onClick={handleAddToCart} className="flex-1 gap-2">
            <ShoppingCart className="w-4 h-4" />
            أضف للسلة
          </Button>
        </div>
      </div>
    </div>
  );
};
