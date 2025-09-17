import { NextRequest, NextResponse } from 'next/server';
import { checkAfterOrderExists, getOrderByTicketIdAndEmail } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { tckid, email } = await request.json();

    if (!tckid || !email) {
      return NextResponse.json(
        { error: 'Número de orden y email son requeridos' },
        { status: 400 }
      );
    }

    const tickets = await getOrderByTicketIdAndEmail(tckid, email);

    if (!tickets || tickets.length === 0) {
      return NextResponse.json(
        { error: 'No se encontró una orden con ese número y email' },
        { status: 404 }
      );
    }

    const validEtids = ['14152','13868','13869','13870','12368','12369','12370','12371','12399','12409','12410','12411','12412','12837','12945','13091','13854','13855','13856','14151','12372','12373','12374','12375','12398','12838','13147','13273','13857','13858','13859','12376','12377','12378','12379','12380','12381','12382','12383','12384','12385','12386','12387','12388','12389','12390','12391','14172','14173','14177','14179','14180','14181','14182','14174','14175','14176','14178'];
    
    
    // Filtrar solo los tickets válidos
    const validTickets = tickets.filter(ticket => 
      validEtids.includes(ticket.etid.toString())
    );

    if (validTickets.length === 0) {
      return NextResponse.json(
        { error: 'Esta orden no tiene tickets válidos para el closing party' },
        { status: 400 }
      );
    }

    // Check if order already exists in after_orders
    const existingOrder = await checkAfterOrderExists(validTickets[0].orderId, email);
    console.log('Checking existing order:', {orderId: validTickets[0].orderId, email, existingOrder}); // Debug log
    
    if (existingOrder.exists) {
      console.log('Order already registered, returning registered info'); // Debug log
      return NextResponse.json({
        alreadyRegistered: true,
        message: 'Esta orden ya fue registrada para el closing party',
        registeredQuantity: existingOrder.quantity,
      });
    }

    return NextResponse.json({
      tickets: validTickets,
      totalTickets: validTickets.length,
      alreadyRegistered: false
    });
  } catch (error) {
    console.error('Error in lookup-order API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}