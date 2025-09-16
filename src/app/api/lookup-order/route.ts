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

    const validEtids = ['13854','13855','13856','13868','13869','13870','12368','12369','12370','12371','12399','12409','12410','12411','12412','12837','12945','13091'];
    
    // Filtrar solo los tickets válidos
    const validTickets = tickets.filter(ticket => 
      validEtids.includes(ticket.etid.toString())
    );

    if (validTickets.length === 0) {
      return NextResponse.json(
        { error: 'Esta orden no tiene tickets válidos para el after' },
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
        message: 'Esta orden ya fue registrada para el after',
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