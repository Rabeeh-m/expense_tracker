import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ExpenseForm from '../components/ExpenseForm';
import Spinner from '../components/Spinner';

const ExpenseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:8000/api/expenses/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExpense(res.data);
      } catch (err) {
        setError('Failed to fetch expense details');
      } finally {
        setLoading(false);
      }
    };
    fetchExpense();
  }, [id]);

  const handleUpdate = async (formData) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8000/api/expenses/${id}/`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to update expense');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;

    try {
      setIsDeleting(true);
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/api/expenses/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to delete expense');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className=" min-h-screen mx-auto p-6 bg-gradient-to-b from-gray-50 to-gray-200 flex items-center justify-center">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900">Expense Details</h2>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded text-center">
            {error}
          </div>
        )}

        {/* Expense Form or Fallback */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
          
            <>
              <ExpenseForm
                initialData={expense}
                onSubmit={handleUpdate}
                submitText="Update Expense"
                disabled={loading}
              />
            </>
        </div>
      </div>
    </div>
  );
};

export default ExpenseDetail;
