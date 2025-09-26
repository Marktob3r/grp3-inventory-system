'use client';

import { useState, useEffect } from 'react';

export default function HomePage() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [currentItem, setCurrentItem] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      const res = await fetch('/api/items');
      const data = await res.json();
      setItems(data);
    };
    fetchItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentItem) {
      const res = await fetch(`/api/items/${currentItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, quantity }),
      });
      const updatedItem = await res.json();
      setItems(items.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
      setCurrentItem(null);
    } else {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, quantity }),
      });
      const newItem = await res.json();
      setItems([...items, newItem]);
    }
    
    setName('');
    setQuantity('');
  };

  const handleEdit = (item) => {
    setCurrentItem(item);
    setName(item.name);
    setQuantity(item.quantity);
  };

  const handleDelete = async (id) => {
    await fetch(`/api/items/${id}`, {
      method: 'DELETE',
    });
    setItems(items.filter((item) => item.id !== id));
  };
  
  return (

    <div className="main">

      <div className="container">

        <h1>Inventory System</h1>
        
        <div className="form-container">

          <h2>{currentItem ? 'Edit Item' : 'Add New Item'}</h2>

          <form onSubmit={handleSubmit}>

            <input type="text" placeholder="Item Name" value={name} onChange={(e) => setName(e.target.value)} required/>
            <input type="number" placeholder="Quantity" value={quantity} min={1} onChange={(e) => setQuantity(e.target.value)} required/>
            <button type="submit">{currentItem ? 'Update Item' : 'Add Item'}</button>

            {currentItem && (
              <button type="button" className="cancel-btn" onClick={() => { setCurrentItem(null); setName(''); setQuantity(''); }}>
                Cancel
              </button>
            )}

          </form>

        </div>

        <div className="table-container">

          <h2>Inventory List</h2>
          <table>

            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td className="actions">
                    <button className="edit-btn" onClick={() => handleEdit(item)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(item.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>

      </div>

    </div>

  );
}