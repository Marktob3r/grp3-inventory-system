import { NextResponse } from 'next/server';
import { items } from '@/lib/data';

// PUT: To update an existing item
export async function PUT(request, { params }) {
  const { id } = params;
  const { name, quantity } = await request.json();
  
  const itemIndex = items.findIndex(item => item.id === parseInt(id));

  if (itemIndex === -1) {
    return NextResponse.json({ message: 'Item not found' }, { status: 404 });
  }

  // Update item details
  items[itemIndex] = { ...items[itemIndex], name, quantity: Number(quantity) };

  return NextResponse.json(items[itemIndex]);
}

// DELETE: To remove an item
export async function DELETE(request, { params }) {
  const { id } = params;
  const initialLength = items.length;
  
  // Filter out the item to be deleted
  const newItems = items.filter(item => item.id !== parseInt(id));

  if (newItems.length === initialLength) {
    return NextResponse.json({ message: 'Item not found' }, { status: 404 });
  }
  
  // Replace the original array
  items.length = 0;
  items.push(...newItems);

  return NextResponse.json({ message: `Item with ID ${id} deleted` }, { status: 200 });
}