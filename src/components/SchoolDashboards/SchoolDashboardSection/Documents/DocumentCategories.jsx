import React, { useState, useEffect } from "react";
import { FiFolderPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useApi } from "../../../../hooks/useApi";
import "../Documents/documents.css";

const DocumentCategories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const api = useApi();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/documents/categories/");
      setCategories(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch categories");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      const response = await api.post("/documents/categories/", {
        name: newCategory,
        is_custom: true,
      });
      setCategories([...categories, response.data]);
      setNewCategory("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add category");
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await api.delete(`/documents/categories/${id}/`);
      setCategories(categories.filter((cat) => cat.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete category");
    }
  };

  return (
    <div className="document-categories">
      <div className="categories-header">
        <h2>Document Categories</h2>
        <form onSubmit={handleAddCategory} className="add-category-form">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category name"
            required
          />
          <button type="submit" className="btn-primary">
            <FiFolderPlus /> Add Category
          </button>
        </form>
      </div>

      {error && <div className="error-message">{error}</div>}

      {isLoading ? (
        <div className="loading">Loading categories...</div>
      ) : (
        <div className="categories-list">
          {categories.map((category) => (
            <div key={category.id} className="category-item">
              <span>{category.name}</span>
              <div className="category-actions">
                <button className="icon-button">
                  <FiEdit2 />
                </button>
                {category.is_custom && (
                  <button
                    className="icon-button danger"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    <FiTrash2 />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentCategories;
