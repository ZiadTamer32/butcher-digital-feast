import { useState, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/products";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || product.category === categoryFilter;
      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [searchTerm, categoryFilter, priceRange]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-3">
            منتجاتنا
          </h1>
          <p className="text-lg text-muted-foreground">
            اختر من مجموعة متنوعة من اللحوم الطازجة عالية الجودة
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 gradient-card p-4 md:p-6 rounded-xl shadow-soft">
          <div className="flex items-center gap-2 mb-4 md:mb-6">
            <Filter className="w-5 h-5 text-primary" />
            <h2 className="text-lg md:text-xl font-bold text-foreground">فلترة المنتجات</h2>
          </div>

          <div className="flex flex-col gap-4 md:gap-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                بحث
              </label>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="ابحث عن المنتج..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                الفئة
              </label>
              <div className="grid grid-cols-2 md:flex gap-2">
                <Button
                  variant={categoryFilter === "all" ? "default" : "outline"}
                  onClick={() => setCategoryFilter("all")}
                  className="flex-1"
                >
                  الكل
                </Button>
                <Button
                  variant={categoryFilter === "beef" ? "default" : "outline"}
                  onClick={() => setCategoryFilter("beef")}
                  className="flex-1"
                >
                  بقري
                </Button>
                <Button
                  variant={categoryFilter === "lamb" ? "default" : "outline"}
                  onClick={() => setCategoryFilter("lamb")}
                  className="flex-1"
                >
                  غنم
                </Button>
                <Button
                  variant={categoryFilter === "chicken" ? "default" : "outline"}
                  onClick={() => setCategoryFilter("chicken")}
                  className="flex-1"
                >
                  دجاج
                </Button>
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                السعر (ج.م)
              </label>
              <div className="flex gap-3 items-center">
                <Input
                  type="number"
                  placeholder="من"
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])
                  }
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="number"
                  placeholder="إلى"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], parseInt(e.target.value) || 1000])
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-2xl font-semibold text-muted-foreground">
              لا توجد منتجات تطابق البحث
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
