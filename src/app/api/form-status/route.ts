import { NextResponse } from 'next/server';
import { getTotalTicketsRequested } from '@/lib/database';
import { ACTIVE_POPUP_ID, getPopupConfig } from '@/config/popups';

export async function GET() {
  try {
    const popupConfig = getPopupConfig(ACTIVE_POPUP_ID);

    if (!popupConfig) {
      return NextResponse.json(
        { error: 'Evento no encontrado' },
        { status: 404 }
      );
    }

    // Calculate total allowed tickets including female-only pool
    const totalAllowedTickets = popupConfig.maxTickets + (popupConfig.maxFemaleTickets || 0);
    const totalTickets = await getTotalTicketsRequested(ACTIVE_POPUP_ID);
    const closed = totalTickets >= totalAllowedTickets;

    return NextResponse.json({
      closed,
      maxTickets: totalAllowedTickets,
    });
  } catch (error) {
    console.error('Form status check error:', error);
    return NextResponse.json(
      { error: 'Error al verificar estado del formulario' },
      { status: 500 }
    );
  }
}
