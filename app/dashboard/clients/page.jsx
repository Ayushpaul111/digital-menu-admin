"use client";
import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { Search, Filter, Star, Loader2 } from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/config";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/sidebar";
import TopBar from "../../components/TopBar";

// Memoized Food Item Component to prevent unnecessary re-renders
const FoodItem = memo(({ item }) => {
  const handleImageError = useCallback((e) => {
    e.target.src =
      "https://images.unsplash.com/photo-1546554137-f86b9593a222?w=400&h=300&fit=crop";
  }, []);

  const handleEdit = useCallback(() => {
    // Add to cart logic here
    console.log("Edit:", item.title);
  }, [item.title]);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={handleImageError}
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{item.rating}</span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
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
          <button
            onClick={handleEdit}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
});

export default function Clients() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [userSession, setUserSession] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [foodItems, setFoodItems] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataFetched, setDataFetched] = useState(false);

  // Memoized fetch function to prevent recreation on every render
  const fetchData = useCallback(async () => {
    if (dataFetched) return; // Prevent refetching if data already loaded

    try {
      setLoading(true);
      setError(null);

      // Fetch food items and categories in parallel
      const [foodItemsResponse, categoriesResponse] = await Promise.all([
        fetch(process.env.NEXT_PUBLIC_GOOGLE_MENU_URL),
        fetch(process.env.NEXT_PUBLIC_GOOGLE_CATEGORIES_URL),
      ]);

      if (!foodItemsResponse.ok) {
        throw new Error(
          `HTTP error fetching food items! status: ${foodItemsResponse.status}`
        );
      }

      if (!categoriesResponse.ok) {
        throw new Error(
          `HTTP error fetching categories! status: ${categoriesResponse.status}`
        );
      }

      const [foodItemsData, categoriesData] = await Promise.all([
        foodItemsResponse.json(),
        categoriesResponse.json(),
      ]);

      setFoodItems(foodItemsData);

      // Add "All" category at the beginning
      const allCategories = ["All", ...categoriesData];
      if (allCategories === "Categories") {
        const categories = allCategories.slice;
      }
      setCategories(allCategories);
      setDataFetched(true);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load menu data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [dataFetched]);

  // Fetch data only once when component mounts
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserSession(sessionStorage.getItem("user"));
    }
  }, []);

  useEffect(() => {
    if (!user && !userSession) {
      router.push("/login");
    }
  }, [user, router, userSession]);

  // Memoized filtered items to prevent recalculation on every render
  const filteredItems = useMemo(() => {
    return foodItems.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [foodItems, searchTerm, selectedCategory]);

  // Memoized search handler to prevent recreation on every render
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  // Memoized category selection handler
  const handleCategorySelect = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  // Memoized sidebar toggle handler
  const handleSidebarToggle = useCallback(() => {
    setSidebarOpen(true);
  }, []);

  // Memoized retry handler
  const handleRetry = useCallback(() => {
    setDataFetched(false);
    setError(null);
    fetchData();
  }, [fetchData]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col">
          <TopBar title="Food Menu" onMenuClick={handleSidebarToggle} />
          <main className="flex-1 p-6 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading menu items...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col">
          <TopBar title="Food Menu" onMenuClick={handleSidebarToggle} />
          <main className="flex-1 p-6 flex items-center justify-center">
            <div className="text-center">
              <div className="text-red-500 mb-4">
                <Filter size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Error Loading Menu
              </h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={handleRetry}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col">
        <TopBar title="Food Menu" onMenuClick={handleSidebarToggle} />

        <main className="flex-1 p-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Our Menu</h2>
            <p className="text-gray-600">
              Discover delicious food items from our kitchen
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-8 space-y-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search food items..."
                className="w-full pl-10 pr-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-purple-600 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Food Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <FoodItem key={item.id} item={item} />
            ))}
          </div>

          {filteredItems.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Filter size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No items found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
