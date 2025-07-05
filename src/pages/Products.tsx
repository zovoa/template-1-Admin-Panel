import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Edit, Archive } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from '../components/auth/AuthProvider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: number;
  urlKey: string;
  productName: string;
  category: string;
  gender: string;
  price: number;
  stockSize: number;
  imageUrl: string;
}

interface ProductFormData {
  urlKey: string;
  productName: string;
  category: string;
  gender: string;
  price: string;
  stockSize: string;
  imageUrl: string;
}

const API_BASE_URL = 'https://8ed7-106-208-116-1.ngrok-free.app';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    console.log('📦 Product Management Page Loaded!');
    if (user) {
      console.log('👤 Logged-in Admin Full Object:', user);
      console.log('✅ Email:', user.email);
      console.log('🆔 userId:', user.userId);
      console.log('🌐 Website URL:', user.websiteUrl);
      console.log('🔐 Admin Panel:', user.adminUrl);
      console.log('📢 Message:', user.message);
      console.log('🎯 Success:', user.success);
    } else {
      console.warn('⚠️ No user data found in context!');
    }

    fetchProducts();
  }, [user]);

  const fetchProducts = async () => {
    try {
      console.log('🔄 Fetching products from API...');
      setIsLoading(true);
      // Replace with your actual API endpoint for fetching products
      const response = await fetch(`${API_BASE_URL}/api/clothing/key/${user.websiteUrl}`, {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "true"
        }
      });


      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📦 Products fetched successfully:', data);
      setProducts(data);
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const categories = ['all', 'T-Shirts', 'Jackets', 'Shirts', 'Dresses', 'Pants', 'Sweaters'];
  const genderOptions = ['Male', 'Female', 'Unisex'];

  const addForm = useForm<ProductFormData>({
    defaultValues: {
      urlKey: user.websiteUrl,
      productName: '',
      category: 'T-Shirts',
      gender: 'Male',
      price: '',
      stockSize: '',
      imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop'
    }
  });

  const editForm = useForm<ProductFormData>({
    defaultValues: {
      urlKey: user.websiteUrl,
      productName: '',
      category: 'T-Shirts',
      gender: 'Male',
      price: '',
      stockSize: '',
      imageUrl: ''
    }
  });

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { text: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (stock < 20) return { text: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'In Stock', color: 'bg-green-100 text-green-800' };
  };

  const handleAddProduct = async (data: ProductFormData) => {
    try {
      console.log('➕ Adding product:', data);

      const productData = {
        urlKey: user.websiteUrl,
        productName: data.productName,
        category: data.category,
        gender: data.gender,
        price: parseFloat(data.price),
        imageUrl: data.imageUrl,
        stockSize: parseInt(data.stockSize)
      };

      console.log('📤 Sending product data to API:', productData);

      const response = await fetch(`${API_BASE_URL}/api/clothing/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Product added successfully:', result);

      toast({
        title: "Product Added",
        description: `${data.productName} has been added successfully.`,
      });

      setIsAddDialogOpen(false);
      addForm.reset();
      fetchProducts(); // Refresh the product list
    } catch (error) {
      console.error('❌ Error adding product:', error);
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      });
    }
  };

  const handleEditProduct = (product: Product) => {
    console.log('✏️ Editing product:', product);
    setEditingProduct(product);
    editForm.reset({
      urlKey: user.websiteUrl,
      productName: product.productName,
      category: product.category,
      gender: product.gender,
      price: product.price.toString(),
      stockSize: product.stockSize.toString(),
      imageUrl: product.imageUrl
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateProduct = async (data: ProductFormData) => {
    if (!editingProduct) return;

    try {
      console.log('🔄 Updating product:', data);

      const productData = {
        id: editingProduct.id,
        urlKey: user.websiteUrl,
        productName: data.productName,
        category: data.category,
        gender: data.gender,
        price: parseFloat(data.price),
        imageUrl: data.imageUrl,
        stockSize: parseInt(data.stockSize)
      };

      console.log('📤 Sending updated product data to API:', productData);

      // Replace with your actual API endpoint for updating products
      const response = await fetch(`${API_BASE_URL}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Product updated successfully:', result);

      toast({
        title: "Product Updated",
        description: `${data.productName} has been updated successfully.`,
      });

      setIsEditDialogOpen(false);
      setEditingProduct(null);
      editForm.reset();
      fetchProducts(); // Refresh the product list
    } catch (error) {
      console.error('❌ Error updating product:', error);
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    }
  };

  const handleArchiveProduct = async (productId: number) => {
    console.log('🗑️ Archiving product:', productId);
    if (window.confirm('Are you sure you want to archive this product?')) {
      try {
        // Replace with your actual API endpoint for deleting products
        const response = await fetch(`${API_BASE_URL}/delete/${productId}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('✅ Product archived successfully:', result);

        toast({
          title: "Product Archived",
          description: "Product has been archived successfully.",
        });

        fetchProducts(); // Refresh the product list
      } catch (error) {
        console.error('❌ Error archiving product:', error);
        toast({
          title: "Error",
          description: "Failed to archive product",
          variant: "destructive",
        });
      }
    }
  };

  const generateUrlKey = (name: string) => {
    return name.toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600">manage your clothing inventory</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={20} />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <Form {...addForm}>
              <form onSubmit={addForm.handleSubmit(handleAddProduct)} className="space-y-4">
                <FormField
                  control={addForm.control}
                  name="productName"
                  rules={{ required: "Product name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter product name"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            addForm.setValue('urlKey', generateUrlKey(e.target.value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addForm.control}
                  name="urlKey"
                  rules={{ required: "URL key is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL Key</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="User's website URL"
                          {...field}
                          value={user.websiteUrl} // ✅ Always bound to user
                          readOnly // 🔒 Optional: prevent user edits
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={addForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <select className="w-full p-2 border border-gray-300 rounded-md" {...field}>
                          {categories.filter(cat => cat !== 'all').map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addForm.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <select className="w-full p-2 border border-gray-300 rounded-md" {...field}>
                          {genderOptions.map(gender => (
                            <option key={gender} value={gender}>{gender}</option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addForm.control}
                  name="price"
                  rules={{
                    required: "Price is required",
                    pattern: {
                      value: /^\d+(\.\d{1,2})?$/,
                      message: "Please enter a valid price"
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addForm.control}
                  name="stockSize"
                  rules={{
                    required: "Stock quantity is required",
                    min: { value: 0, message: "Stock cannot be negative" }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addForm.control}
                  name="imageUrl"
                  rules={{ required: "Image URL is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Product</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <div className="relative">
              <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading products...</p>
        </div>
      )}

      {/* Products Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const stockStatus = getStockStatus(product.stockSize);
            return (
              <div key={product.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-square bg-gray-100">
                  <img
                    src={product.imageUrl}
                    alt={product.productName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm">{product.productName}</h3>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit Product"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleArchiveProduct(product.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Archive Product"
                      >
                        <Archive size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{product.category} • {product.gender}</p>
                  <p className="text-lg font-bold text-gray-900 mb-2">${product.price.toFixed(2)}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{product.stockSize} units</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${stockStatus.color}`}>
                      {stockStatus.text}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleUpdateProduct)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="productName"
                rules={{ required: "Product name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter product name"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          editForm.setValue('urlKey', generateUrlKey(e.target.value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="urlKey"
                rules={{ required: "URL key is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Key</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., mens-casual-shirt" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <select className="w-full p-2 border border-gray-300 rounded-md" {...field}>
                        {categories.filter(cat => cat !== 'all').map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <select className="w-full p-2 border border-gray-300 rounded-md" {...field}>
                        {genderOptions.map(gender => (
                          <option key={gender} value={gender}>{gender}</option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="price"
                rules={{
                  required: "Price is required",
                  pattern: {
                    value: /^\d+(\.\d{1,2})?$/,
                    message: "Please enter a valid price"
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="stockSize"
                rules={{
                  required: "Stock quantity is required",
                  min: { value: 0, message: "Stock cannot be negative" }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="imageUrl"
                rules={{ required: "Image URL is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Product</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {!isLoading && filteredProducts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
          <p className="text-gray-500">No products found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Products;