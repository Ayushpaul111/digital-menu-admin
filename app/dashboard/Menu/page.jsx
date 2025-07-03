"use client";
import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { Search, Filter, Star, Loader2, X, Edit3, Plus } from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/config";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/sidebar";
import TopBar from "../../components/TopBar";

// Edit/Add Modal Component
const EditModal = memo(
  ({ item, isOpen, onClose, onSave, isAddMode = false, nextId }) => {
    const [formData, setFormData] = useState({
      Id: "",
      Name: "",
      Description: "",
      Price: "",
      Image: "",
      Rating: "",
      Category: "",
      isVeg: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // Pre-fill form when item changes or in add mode
    useEffect(() => {
      if (isAddMode) {
        setFormData({
          Id: nextId.toString(),
          Name: "",
          Description: "",
          Price: "",
          Image: "",
          Rating: "",
          Category: "",
          isVeg: false,
        });
      } else if (item) {
        setFormData({
          Id: item.id || "",
          Name: item.title || "",
          Description: item.description || "",
          Price: item.price || "",
          Image: item.image || "",
          Rating: item.rating || "",
          Category: item.category || "",
          isVeg: item.isVeg || false,
        });
      }
    }, [item, isAddMode, nextId]);

    const handleInputChange = useCallback((e) => {
      const { name, value, type, checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }, []);

    const handleSubmit = useCallback(
      async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);
        setSubmitSuccess(false);

        try {
          // Construct the webhook URL with parameters
          const baseUrl = process.env.NEXT_PUBLIC_WEBHOOK;
          const params = new URLSearchParams();

          // Add all form data as URL parameters
          params.append("Id", formData.Id);
          params.append("Name", formData.Name);
          params.append("Description", formData.Description);
          params.append("Price", formData.Price);
          params.append("Image", formData.Image);
          params.append("Rating", formData.Rating);
          params.append("Category", formData.Category);
          params.append("isVeg", formData.isVeg.toString());

          const fullUrl = `${baseUrl}?${params.toString()}`;

          console.log("Webhook URL:", fullUrl); // Debug log

          // Make the GET request
          const response = await fetch(fullUrl, {
            method: "GET",
            redirect: "follow",
          });

          // Check if response is ok
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
              `HTTP error! status: ${response.status}, message: ${errorText}`
            );
          }

          // Try to parse response as JSON, fallback to text
          let responseData;
          try {
            responseData = await response.json();
          } catch {
            responseData = await response.text();
          }

          console.log("Webhook response:", responseData); // Debug log

          setSubmitSuccess(true);

          // Call the onSave callback to update the parent component
          if (onSave) {
            onSave(formData, isAddMode);
          }

          // Auto-close after 2 seconds on success
          setTimeout(() => {
            onClose();
            setSubmitSuccess(false);
          }, 2000);
        } catch (error) {
          console.error(
            `Error ${isAddMode ? "creating" : "updating"} item:`,
            error
          );
          setSubmitError(
            `Failed to ${isAddMode ? "create" : "update"} item: ${
              error.message
            }`
          );
        } finally {
          setIsSubmitting(false);
        }
      },
      [formData, onSave, onClose, isAddMode]
    );

    const handleClose = useCallback(() => {
      setSubmitError(null);
      setSubmitSuccess(false);
      onClose();
    }, [onClose]);

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {isAddMode ? "Add New Food Item" : "Edit Food Item"}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Success Message */}
            {submitSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Star className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      Item {isAddMode ? "created" : "updated"} successfully!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <X className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">
                      {submitError}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ID Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID
                </label>
                <input
                  type="text"
                  name="Id"
                  value={formData.Id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
                  required
                  readOnly={isAddMode}
                />
                {isAddMode && (
                  <p className="text-xs text-gray-500 mt-1">
                    Auto-generated ID (next available: {nextId})
                  </p>
                )}
              </div>

              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="Name"
                  value={formData.Name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Price Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹)
                </label>
                <input
                  type="number"
                  name="Price"
                  value={formData.Price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                  min="0"
                />
              </div>

              {/* Rating Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <input
                  type="number"
                  name="Rating"
                  value={formData.Rating}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                  min="0"
                  max="5"
                  step="0.1"
                />
              </div>

              {/* Category Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  name="Category"
                  value={formData.Category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Vegetarian Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isVeg"
                  checked={formData.isVeg}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Vegetarian
                </label>
              </div>
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="Description"
                value={formData.Description}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            {/* Image URL Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="url"
                name="Image"
                value={formData.Image}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {isAddMode ? "Creating..." : "Updating..."}
                  </>
                ) : isAddMode ? (
                  "Create Item"
                ) : (
                  "Update Item"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
);

// Memoized Food Item Component to prevent unnecessary re-renders
const FoodItem = memo(({ item, onEdit }) => {
  const handleImageError = useCallback((e) => {
    e.target.src =
      "https://images.unsplash.com/photo-1546554137-f86b9593a222?w=400&h=300&fit=crop";
  }, []);

  const handleEditClick = useCallback(() => {
    onEdit(item);
  }, [item, onEdit]);

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
            onClick={handleEditClick}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Edit3 className="w-4 h-4" />
            Edit
          </button>
        </div>
      </div>
    </div>
  );
});

export default function Menu() {
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

  // Edit/Add modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);

  // Calculate next ID
  const nextId = useMemo(() => {
    if (foodItems.length === 0) return 1;
    const maxId = Math.max(...foodItems.map((item) => parseInt(item.id) || 0));
    return maxId + 1;
  }, [foodItems]);

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

  // Edit handlers
  const handleEditItem = useCallback((item) => {
    setEditingItem(item);
    setIsAddMode(false);
    setModalOpen(true);
  }, []);

  // Add handlers
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
    (updatedData, isAdd) => {
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
        setFoodItems((prevItems) => [...prevItems, newItem]);

        // Update categories if new category is added
        if (
          !categories.includes(updatedData.Category) &&
          updatedData.Category !== "All"
        ) {
          setCategories((prevCategories) => [
            ...prevCategories,
            updatedData.Category,
          ]);
        }
      } else {
        // Update existing item in the state
        setFoodItems((prevItems) =>
          prevItems.map((item) =>
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
    [categories]
  );

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
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Our Menu
              </h2>
              <p className="text-gray-600">
                Discover delicious food items from our kitchen
              </p>
            </div>
            <button
              onClick={handleAddItem}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add New Item
            </button>
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
              <FoodItem key={item.id} item={item} onEdit={handleEditItem} />
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

      {/* Edit/Add Modal */}
      <EditModal
        item={editingItem}
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        isAddMode={isAddMode}
        nextId={nextId}
      />
    </div>
  );
}
