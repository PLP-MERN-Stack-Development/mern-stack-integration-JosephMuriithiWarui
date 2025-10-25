import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import useApi from '../hooks/useApi';

const CategoryContext = createContext();

export const useCategories = () => useContext(CategoryContext);

export const CategoryProvider = ({ children }) => {
  const { data: categories, error, loading, request } = useApi('/categories');
  const [categoryList, setCategoryList] = useState([]);

  // Function to fetch categories
  const fetchCategories = useCallback(() => {
    request('get', '/categories');
  }, [request]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Update local state when API data changes
  useEffect(() => {
    if (categories) {
      setCategoryList(categories);
    }
  }, [categories]);
  
  // We'll add logic to create/add new categories to this context later

  const value = {
    categories: categoryList,
    loadingCategories: loading,
    categoryError: error,
    refetchCategories: fetchCategories
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};