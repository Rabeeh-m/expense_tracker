import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import ExpenseList from '../components/ExpenseList';
import ExpenseChart from '../components/Chart';
import LoadingSpinner from '../components/Spinner';
import { AuthContext } from '../context/AuthContext';

const AdminPage = () => {
  const { user, loading } = useContext(AuthContext);
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState([]);
  const [filters, setFilters] = useState({ start_date: '', end_date: '', category: '', user: '' });
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams(filters).toString();
      const [expenseRes, summaryRes, userRes] = await Promise.all([
        axios.get(`http://localhost:8000/api/expenses/?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`http://localhost:8000/api/expenses/summary/?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('http://localhost:8000/api/auth/users/', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setExpenses(expenseRes.data);
      setSummary(summaryRes.data);
      setUsers(userRes.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.isStaff) {
      fetchData();
    }
  }, [user, filters]);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    await axios.delete(`http://localhost:8000/api/expenses/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchData();
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  if (loading) return <LoadingSpinner />;
  if (!user || !user.isStaff) return <Navigate to="/admin-login" />;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {isLoading && <LoadingSpinner />}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-bold mb-4">Filters</h3>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              name="start_date"
              value={filters.start_date}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              name="end_date"
              value={filters.end_date}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Category</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            >
              <option value="">All</option>
              <option value="food">Food</option>
              <option value="travel">Travel</option>
              <option value="utilities">Utilities</option>
              <option value="misc">Miscellaneous</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">User</label>
            <select
              name="user"
              value={filters.user}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            >
              <option value="">All</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.username}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <ExpenseChart summary={summary} />
      <ExpenseList expenses={expenses} onDelete={handleDelete} />
    </div>
  );
};

export default AdminPage;