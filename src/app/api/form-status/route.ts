import { NextResponse } from 'next/server';
import { isFormClosed } from '@/lib/database';
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

    const closed = await isFormClosed(ACTIVE_POPUP_ID, popupConfig.maxTickets);

    return NextResponse.json({
      closed,
      maxTickets: popupConfig.maxTickets,
    });
  } catch (error) {
    console.error('Form status check error:', error);
    return NextResponse.json(
      { error: 'Error al verificar estado del formulario' },
      { status: 500 }
    );
  }
}
