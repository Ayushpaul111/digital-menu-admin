"use client";
import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { Search, Filter, Star, Plus, Edit3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { PageHeader } from "../../components/ui/PageHeader";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { EditModal } from "../../components/ui/EditModal";

// Custom hooks for data fetching
const useMenuData = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataFetched, setDataFetched] = useState(false);

  const fetchData = useCallback(async () => {
    if (dataFetched) return;

    try {
      setLoading(true);
      setError(null);

      const [foodItemsResponse, categoriesResponse] = await Promise.all([
        fetch(process.env.NEXT_PUBLIC_GOOGLE_MENU_URL || ""),
        fetch(process.env.NEXT_PUBLIC_GOOGLE_CATEGORIES_URL || ""),
      ]);

      if (!foodItemsResponse.ok || !categoriesResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const [foodItemsData, categoriesData] = await Promise.all([
        foodItemsResponse.json(),
        categoriesResponse.json(),
      ]);

      setFoodItems(foodItemsData);
      setCategories(["All", ...categoriesData]);
      setDataFetched(true);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError("Failed to load menu data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [dataFetched]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    foodItems,
    setFoodItems,
    categories,
    setCategories,
    loading,
    error,
    refetch: () => {
      setDataFetched(false);
      fetchData();
    },
  };
};

const useMenuFilters = (items: any[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [items, searchTerm, selectedCategory]);

  return {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    filteredItems,
  };
};

// Components
const SearchAndFilters = memo(
  ({
    searchTerm,
    onSearchChange,
    categories,
    selectedCategory,
    onCategorySelect,
  }: {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    categories: string[];
    selectedCategory: string;
    onCategorySelect: (category: string) => void;
  }) => (
    <motion.div
      className="mb-8 space-y-4"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <motion.input
          type="text"
          placeholder="Search food items..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-700"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          whileFocus={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category, index) => (
          <motion.button
            key={category}
            onClick={() => onCategorySelect(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? "bg-purple-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category}
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
);

SearchAndFilters.displayName = "SearchAndFilters";

const FoodItem = memo(
  ({
    item,
    index,
    onEdit,
  }: {
    item: any;
    index: number;
    onEdit: (item: any) => void;
  }) => {
    const handleImageError = useCallback((e: any) => {
      e.target.src =
        "https://images.unsplash.com/photo-1546554137-f86b9593a222?w=400&h=300&fit=crop";
    }, []);

    return (
      <motion.div
        className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.4,
          delay: index * 0.1,
          ease: "easeOut",
        }}
        whileHover={{
          y: -4,
          transition: { duration: 0.2 },
        }}
      >
        <div className="relative h-48 overflow-hidden">
          <motion.img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
            onError={handleImageError}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{item.rating}</span>
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold text-gray-900">
              {item.title}
            </h3>
            <span className="text-2xl font-bold text-purple-600">
              ₹{item.price}
            </span>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {item.description}
          </p>

          <div className="flex items-center justify-between">
            <span className="inline-block bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full font-medium">
              {item.category}
            </span>
            <motion.button
              onClick={() => onEdit(item)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Edit3 className="w-4 h-4" />
              Edit
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }
);

FoodItem.displayName = "FoodItem";

const EmptyState = memo(
  ({ message, icon: Icon }: { message: string; icon: any }) => (
    <motion.div
      className="text-center py-12"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-gray-400 mb-4">
        <Icon size={48} className="mx-auto" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No items found
      </h3>
      <p className="text-gray-600">{message}</p>
    </motion.div>
  )
);

EmptyState.displayName = "EmptyState";

const LoadingState = memo(() => (
  <div className="flex items-center justify-center py-12">
    <LoadingSpinner size="lg" />
    <span className="ml-3 text-gray-600">Loading menu items...</span>
  </div>
));

LoadingState.displayName = "LoadingState";

const ErrorState = memo(
  ({ error, onRetry }: { error: string; onRetry: () => void }) => (
    <motion.div
      className="text-center py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-red-500 mb-4">
        <Filter size={48} className="mx-auto" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Error Loading Menu
      </h3>
      <p className="text-gray-600 mb-4">{error}</p>
      <motion.button
        onClick={onRetry}
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Try Again
      </motion.button>
    </motion.div>
  )
);

ErrorState.displayName = "ErrorState";

export default function Menu() {
  const {
    foodItems,
    setFoodItems,
    categories,
    setCategories,
    loading,
    error,
    refetch,
  } = useMenuData();

  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    filteredItems,
  } = useMenuFilters(foodItems);

  // Edit/Add modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);

  // Calculate next ID
  const nextId = useMemo(() => {
    if (foodItems.length === 0) return 1;
    const maxId = Math.max(
      ...foodItems.map((item: any) => parseInt(item.id) || 0)
    );
    return maxId + 1;
  }, [foodItems]);

  const handleEditItem = useCallback((item: any) => {
    setEditingItem(item);
    setIsAddMode(false);
    setModalOpen(true);
  }, []);

  const handleAddItem = useCallback(() => {
    setEditingItem(null);
    setIsAddMode(true);
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setEditingItem(null);
    setIsAddMode(false);
  }, []);

  const handleSave = useCallback(
    (updatedData: any, isAdd: boolean) => {
      if (isAdd) {
        // Add new item to the state
        const newItem = {
          id: updatedData.Id,
          title: updatedData.Name,
          description: updatedData.Description,
          price: updatedData.Price,
          image: updatedData.Image,
          rating: updatedData.Rating,
          category: updatedData.Category,
          isVeg: updatedData.isVeg,
        };
        setFoodItems((prevItems: any[]) => [...prevItems, newItem]);

        // Update categories if new category is added
        if (
          !categories.includes(updatedData.Category) &&
          updatedData.Category !== "All"
        ) {
          setCategories((prevCategories: string[]) => [
            ...prevCategories,
            updatedData.Category,
          ]);
        }
      } else {
        // Update existing item in the state
        setFoodItems((prevItems: any) =>
          prevItems.map((item: any) =>
            item.id === updatedData.Id
              ? {
                  ...item,
                  title: updatedData.Name,
                  description: updatedData.Description,
                  price: updatedData.Price,
                  image: updatedData.Image,
                  rating: updatedData.Rating,
                  category: updatedData.Category,
                  isVeg: updatedData.isVeg,
                }
              : item
          )
        );
      }
    },
    [categories, setFoodItems, setCategories]
  );

  if (loading) {
    return (
      <DashboardLayout title="Food Menu">
        <LoadingState />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Food Menu">
        <ErrorState error={error} onRetry={refetch} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Food Menu">
      <PageHeader
        title="Our Menu"
        subtitle="Discover delicious food items from our kitchen"
        actions={
          <motion.button
            onClick={handleAddItem}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Plus className="w-5 h-5" />
            Add New Item
          </motion.button>
        }
      />

      <SearchAndFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />

      <AnimatePresence mode="wait">
        {filteredItems.length === 0 ? (
          <EmptyState
            message="Try adjusting your search or filter criteria"
            icon={Filter}
          />
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {filteredItems.map((item: any, index: number) => (
              <FoodItem
                key={item.id}
                item={item}
                index={index}
                onEdit={handleEditItem}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit/Add Modal */}
      <EditModal
        item={editingItem}
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        isAddMode={isAddMode}
        nextId={nextId}
      />
    </DashboardLayout>
  );
}
