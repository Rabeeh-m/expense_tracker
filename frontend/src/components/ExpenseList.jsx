import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const ExpenseList = ({ expenses, onDelete }) => {
  // Safely format amount with error handling
  const formatAmount = (amount) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return !isNaN(num) ? num.toFixed(2) : '0.00';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">Expenses</h3>
      
      {expenses.length === 0 ? (
        <p className="text-gray-500 italic">No expenses recorded yet</p>
      ) : (
        <div className="space-y-4">
          {expenses.map((expense) => (
            <div 
              key={expense.id} 
              className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div className="space-y-2">
                  <h4 className="text-lg font-medium text-gray-900">{expense.title}</h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-2">Amount:</span>
                      <span className="font-medium">₹{formatAmount(expense.amount)}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-2">Category:</span>
                      <span className="capitalize">{expense.category}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-2">Date:</span>
                      <span>{new Date(expense.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 sm:space-x-4">
                  <Link 
                    to={`/expense/${expense.id}`} 
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                    aria-label="Edit expense"
                  >
                    <FontAwesomeIcon icon={faEdit} className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={() => onDelete(expense.id)}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                    aria-label="Delete expense"
                  >
                    <FontAwesomeIcon icon={faTrash} className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpenseList;