import { NextResponse } from 'next/server';
import connectDB from '@/app/utils/dbconnect';
import Practical from '@/app/models/practicals';

export async function GET() {
  try {
    // Connect to the database
    await connectDB();

    // Fetch all practicals from the database
    const practicals = await Practical.find();

    if(practicals.length === 0){
      return NextResponse.json({ error: 'No practicals found' }, { status: 404 });
    }   
    return NextResponse.json(practicals);
  } catch (error) {
    console.error('Error fetching practicals:', error);
    return NextResponse.json({ error: 'Failed to fetch practicals' }, { status: 500 });
  }
}