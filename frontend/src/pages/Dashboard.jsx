import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import ExpenseChart from '../components/Chart';
import LoadingSpinner from '../components/Spinner';
import Swal from 'sweetalert2';

const Dashboard = () => {
  const { user, loading } = useContext(AuthContext);
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState([]);
  const [filters, setFilters] = useState({ startDate: '', endDate: '', category: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [filterError, setFilterError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const showSuccessAlert = (message) => {
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: message,
      timer: 2000,
      showConfirmButton: false,
      background: '#f8f9fa',
      backdrop: `
        rgba(0,0,0,0.4)
      `
    });
  };

  const showErrorAlert = (message) => {
    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: message,
      background: '#f8f9fa',
      confirmButtonColor: '#1a365d',
    });
  };

  const showConfirmDialog = async () => {
    return await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1a365d',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      background: '#f8f9fa'
    });
  };

  const fetchExpenses = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = {};

      if (filters.startDate) params.start_date = filters.startDate;
      if (filters.endDate) params.end_date = filters.endDate;
      if (filters.category) params.category = filters.category;

      const res = await axios.get('http://localhost:8000/api/expenses/', {
        headers: { Authorization: `Bearer ${token}` },
        params: params
      });

      const summaryRes = await axios.get('http://localhost:8000/api/expenses/summary/', {
        headers: { Authorization: `Bearer ${token}` },
        params: params
      });

      setExpenses(res.data);
      setSummary(summaryRes.data);
      setError('');
      setFilterError('');
    } catch (err) {
      setError('Failed to fetch expenses');
      showErrorAlert('Failed to fetch expenses. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchExpenses();
    }
  }, [user]);

  const handleCreate = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8000/api/expenses/', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowForm(false);
      showSuccessAlert('Expense added successfully!');
      fetchExpenses();
    } catch (err) {
      showErrorAlert('Failed to add expense. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    const result = await showConfirmDialog();
    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8000/api/expenses/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showSuccessAlert('Expense deleted successfully!');
        fetchExpenses();
      } catch (err) {
        showErrorAlert('Failed to delete expense. Please try again.');
      }
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    if (filters.startDate && filters.endDate && filters.startDate > filters.endDate) {
      setFilterError('Start date cannot be after end date');
      showErrorAlert('Start date cannot be after end date');
      return;
    }

    if (filters.startDate && filters.startDate > today) {
      setFilterError('Start date cannot be in the future');
      showErrorAlert('Start date cannot be in the future');
      return;
    }

    if (filters.endDate && filters.endDate > today) {
      setFilterError('End date cannot be in the future');
      showErrorAlert('End date cannot be in the future');
      return;
    }

    setFilterError('');
    fetchExpenses();
    showSuccessAlert('Filters applied successfully!');
  };

  const resetFilters = () => {
    setFilters({ startDate: '', endDate: '', category: '' });
    setFilterError('');
    fetchExpenses();
    showSuccessAlert('Filters reset successfully!');
  };

  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen mx-auto p-6 bg-gradient-to-b from-gray-50 to-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded transition-colors duration-200"
        >
          Add Expense
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {isLoading && <LoadingSpinner />}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1">
          {showForm ? (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Add New Expense</h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  ✕
                </button>
              </div>
              <ExpenseForm onSubmit={handleCreate} />
            </div>
          ) : showChart ? (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Expense Analysis</h3>
                <button
                  onClick={() => setShowChart(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  ✕
                </button>
              </div>
              <ExpenseChart summary={summary} />
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Your Expenses</h3>
                <button
                  onClick={() => setShowChart(true)}
                  className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded transition-colors duration-200"
                >
                  View Analysis
                </button>
              </div>
              <ExpenseList expenses={expenses} onDelete={handleDelete} />
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="w-full md:w-64 bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-fit">
          <h3 className="text-xl font-bold mb-4">Filters</h3>
          {filterError && <p className="text-red-500 text-sm mb-4">{filterError}</p>}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              max={today}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              max={today}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Category</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              <option value="food">Food</option>
              <option value="travel">Travel</option>
              <option value="utilities">Utilities</option>
              <option value="misc">Miscellaneous</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={applyFilters}
              className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded flex-1 transition-colors duration-200"
            >
              Apply
            </button>
            <button
              onClick={resetFilters}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded flex-1 transition-colors duration-200"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;