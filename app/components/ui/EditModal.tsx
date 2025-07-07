// Updated EditModal.tsx - Using the new toast system
import { memo, useState, useEffect, useCallback } from "react";
import { X, Loader2, Edit3, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../contexts/ToastContext";

interface EditModalProps {
  item?: any;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: any, isAddMode: boolean) => void;
  isAddMode?: boolean;
  nextId?: number;
}

export const EditModal = memo(
  ({
    item,
    isOpen,
    onClose,
    onSave,
    isAddMode = false,
    nextId = 1,
  }: EditModalProps) => {
    const { showSuccess, showError } = useToast();

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

    const handleInputChange = useCallback(
      (
        e: React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      ) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData((prev) => ({
          ...prev,
          [name]: type === "checkbox" ? checked : value,
        }));
      },
      []
    );

    const handleSubmit = useCallback(
      async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
          // Construct the webhook URL with parameters
          const baseUrl = process.env.NEXT_PUBLIC_WEBHOOK;

          if (!baseUrl) {
            throw new Error("Webhook URL not configured");
          }

          const params = new URLSearchParams();
          Object.entries(formData).forEach(([key, value]) => {
            params.append(key, value.toString());
          });

          const fullUrl = `${baseUrl}?${params.toString()}`;
          console.log("Webhook URL:", fullUrl);

          // Make the GET request to webhook
          const response = await fetch(fullUrl, {
            method: "GET",
            redirect: "follow",
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
              `HTTP error! status: ${response.status}, message: ${errorText}`
            );
          }

          // Success!
          showSuccess(
            `${isAddMode ? "Item Created!" : "Item Updated!"}`,
            `${formData.Name} has been ${
              isAddMode ? "added to" : "updated in"
            } the menu successfully.`
          );

          // Call the onSave callback to update the parent component
          if (onSave) {
            onSave(formData, isAddMode);
          }

          // Close modal after short delay
          setTimeout(() => {
            onClose();
          }, 1000);
        } catch (error: any) {
          console.error(
            `Error ${isAddMode ? "creating" : "updating"} item:`,
            error
          );

          showError(
            "Operation Failed",
            `Failed to ${isAddMode ? "create" : "update"} ${
              formData.Name
            }. Please try again.`
          );
        } finally {
          setIsSubmitting(false);
        }
      },
      [formData, onSave, onClose, isAddMode, showSuccess, showError]
    );

    const handleClose = useCallback(() => {
      onClose();
    }, [onClose]);

    if (!isOpen) return null;

    return (
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-xl">
              <h2 className="text-2xl font-bold text-gray-900">
                {isAddMode ? "Add New Food Item" : "Edit Food Item"}
              </h2>
              <motion.button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
                  rows={3}
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
                <motion.button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {isAddMode ? "Creating..." : "Updating..."}
                    </>
                  ) : (
                    <>
                      {isAddMode ? (
                        <Plus className="w-4 h-4" />
                      ) : (
                        <Edit3 className="w-4 h-4" />
                      )}
                      {isAddMode ? "Create Item" : "Update Item"}
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }
);

EditModal.displayName = "EditModal";
