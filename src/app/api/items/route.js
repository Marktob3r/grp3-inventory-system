import { NextResponse } from 'next/server';
import { items } from '@/lib/data';

// GET: To fetch all items
export async function GET() {
  return NextResponse.json(items);
}

// POST: To add a new item
export async function POST(request) {
  const { name, quantity } = await request.json();
  if (!name || quantity === undefined) {
    return NextResponse.json({ message: 'Name and quantity are required' }, { status: 400 });
  }

  const newId = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
  const newItem = { id: newId, name, quantity: Number(quantity) };
  
  items.push(newItem);

  return NextResponse.json(newItem, { status: 201 });
}