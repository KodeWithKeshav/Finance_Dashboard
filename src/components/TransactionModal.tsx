'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Transaction, Category, TransactionType } from '@/types';
import { XMarkIcon } from '@heroicons/react/24/outline';

const categories: Category[] = [
  'Salary', 'Freelance', 'Investment', 'Food & Dining', 'Shopping',
  'Transportation', 'Entertainment', 'Healthcare', 'Education', 'Utilities',
  'Rent', 'Travel', 'Subscriptions', 'Gifts', 'Other',
];

export default function TransactionModal() {
  const { modalOpen, editingTransaction, closeModal, addTransaction, editTransaction } = useStore();

  const [formData, setFormData] = useState<Partial<Transaction>>({
    description: '',
    amount: '' as any,
    date: new Date().toISOString().split('T')[0],
    category: 'Food & Dining',
    type: 'expense',
    merchant: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingTransaction) {
      setFormData({ ...editingTransaction });
    } else {
      setFormData({
        description: '',
        amount: '' as any,
        date: new Date().toISOString().split('T')[0],
        category: 'Food & Dining',
        type: 'expense',
        merchant: '',
      });
    }
    setErrors({});
  }, [editingTransaction, modalOpen]);

  if (!modalOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.description?.trim()) newErrors.description = 'Required';
    if (!formData.amount || formData.amount <= 0) newErrors.amount = 'Must be > 0';
    if (!formData.merchant?.trim()) newErrors.merchant = 'Required';
    if (!formData.date) newErrors.date = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (editingTransaction) {
      editTransaction(editingTransaction.id, formData as Transaction);
    } else {
      addTransaction(formData as Omit<Transaction, 'id'>);
    }
    closeModal();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeModal}
      >
        <motion.div
          className="modal-content"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>
              {editingTransaction ? 'Edit Record' : 'New Record'}
            </h2>
            <button className="btn-icon" onClick={closeModal}>
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</label>
                <div style={{ display: 'flex', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: 4 }}>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'expense' })}
                    style={{
                      flex: 1, padding: '8px 0', border: 'none', borderRadius: 'calc(var(--radius-md) - 2px)',
                      background: formData.type === 'expense' ? 'var(--bg-primary)' : 'transparent',
                      color: formData.type === 'expense' ? 'var(--accent-danger)' : 'var(--text-secondary)',
                      boxShadow: formData.type === 'expense' ? 'var(--shadow-sm)' : 'none',
                      fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.15s'
                    }}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'income' })}
                    style={{
                      flex: 1, padding: '8px 0', border: 'none', borderRadius: 'calc(var(--radius-md) - 2px)',
                      background: formData.type === 'income' ? 'var(--bg-primary)' : 'transparent',
                      color: formData.type === 'income' ? 'var(--accent-success)' : 'var(--text-secondary)',
                      boxShadow: formData.type === 'income' ? 'var(--shadow-sm)' : 'none',
                      fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.15s'
                    }}
                  >
                    Income
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 12, top: 9, color: 'var(--text-tertiary)' }}>$</span>
                  <input
                    type="number"
                    step="0.01"
                    className="input-field mono"
                    style={{ paddingLeft: 24, fontSize: '1rem' }}
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                    placeholder="0.00"
                  />
                </div>
                {errors.amount && <span style={{ color: 'var(--accent-danger)', fontSize: '0.75rem', marginTop: 4, display: 'block' }}>{errors.amount}</span>}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</label>
              <input
                type="text"
                className="input-field"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g. Monthly Salary or Grocery Shopping"
              />
              {errors.description && <span style={{ color: 'var(--accent-danger)', fontSize: '0.75rem', marginTop: 4, display: 'block' }}>{errors.description}</span>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Merchant</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.merchant}
                  onChange={(e) => setFormData({ ...formData, merchant: e.target.value })}
                  placeholder="e.g. Apple or Trader Joe's"
                />
                {errors.merchant && <span style={{ color: 'var(--accent-danger)', fontSize: '0.75rem', marginTop: 4, display: 'block' }}>{errors.merchant}</span>}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</label>
                <select
                  className="select-field"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                  style={{ width: '100%' }}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</label>
              <input
                type="date"
                className="input-field"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
              {errors.date && <span style={{ color: 'var(--accent-danger)', fontSize: '0.75rem', marginTop: 4, display: 'block' }}>{errors.date}</span>}
            </div>

            <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
              <button type="button" className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={closeModal}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                {editingTransaction ? 'Save Changes' : 'Add Record'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
