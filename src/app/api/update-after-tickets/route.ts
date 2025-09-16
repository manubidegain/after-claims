import { NextRequest, NextResponse } from 'next/server';

import { saveAfterOrder } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { orderId, email, quantity } = await request.json();

    if (!orderId || !email || quantity === undefined || quantity === null) {
      return NextResponse.json(
        { error: 'Order ID, email y cantidad de tickets son requeridos' },
        { status: 400 }
      );
    }

    if (quantity < 0) {
      return NextResponse.json(
        { error: 'La cantidad de tickets no puede ser negativa' },
        { status: 400 }
      );
    }

    if (quantity === 0) {
      return NextResponse.json(
        { error: 'Debes seleccionar al menos un ticket' },
        { status: 400 }
      );
    }

    const success = await saveAfterOrder(orderId, email, quantity);

    if (!success) {
      return NextResponse.json(
        { error: 'Error al guardar la información del closing party' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Tu ticket fue registrado con éxito',
      orderId,
      email,
      quantity,
    });
  } catch (error) {
    console.error('Error in update-after-tickets API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}