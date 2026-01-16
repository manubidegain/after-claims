import { NextRequest, NextResponse } from 'next/server';
import {
  createRegistration,
  checkEmailExists,
  countRegistrationsByIP,
  isFormClosed,
} from '@/lib/database';
import { getPopupConfig } from '@/config/popups';

// Helper function to get client IP address
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  return 'unknown';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { popupId, name, surname, email, gender, ticketQuantity } = body;

    // Validate required fields
    if (!popupId || !name || !surname || !email || !gender || !ticketQuantity) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Validate popupId is a positive integer
    const parsedPopupId = parseInt(popupId);
    if (isNaN(parsedPopupId) || parsedPopupId <= 0) {
      return NextResponse.json(
        { error: 'ID de evento inválido' },
        { status: 400 }
      );
    }

    // Validate name and surname (max 100 chars, no special SQL chars)
    const nameStr = String(name).trim();
    const surnameStr = String(surname).trim();

    if (nameStr.length === 0 || nameStr.length > 100) {
      return NextResponse.json(
        { error: 'El nombre debe tener entre 1 y 100 caracteres' },
        { status: 400 }
      );
    }

    if (surnameStr.length === 0 || surnameStr.length > 100) {
      return NextResponse.json(
        { error: 'El apellido debe tener entre 1 y 100 caracteres' },
        { status: 400 }
      );
    }

    // Validate email format and length
    const emailStr = String(email).trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(emailStr) || emailStr.length > 255) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    // Validate gender is one of the allowed values
    const genderStr = String(gender).trim();
    const allowedGenders = ['Masculino', 'Femenino', 'Otro'];
    if (!allowedGenders.includes(genderStr)) {
      return NextResponse.json(
        { error: 'Género inválido' },
        { status: 400 }
      );
    }

    // Validate ticket quantity is exactly 1 or 2
    const parsedQuantity = parseInt(ticketQuantity);
    if (parsedQuantity !== 1 && parsedQuantity !== 2) {
      return NextResponse.json(
        { error: 'La cantidad de tickets debe ser 1 o 2' },
        { status: 400 }
      );
    }

    // Get popup configuration
    const popupConfig = getPopupConfig(parsedPopupId);
    if (!popupConfig) {
      return NextResponse.json(
        { error: 'Evento no encontrado' },
        { status: 404 }
      );
    }

    // Check if form is closed (300 tickets reached)
    const formClosed = await isFormClosed(parsedPopupId, popupConfig.maxTickets);
    if (formClosed) {
      return NextResponse.json(
        { error: 'Lo sentimos, se alcanzó el límite de inscripciones' },
        { status: 400 }
      );
    }

    // Check if email already registered
    const emailExists = await checkEmailExists(parsedPopupId, emailStr);
    if (emailExists) {
      return NextResponse.json(
        { error: 'Este email ya está registrado' },
        { status: 400 }
      );
    }

    // Get client IP and check IP limit
    const clientIP = getClientIP(request);
    const ipCount = await countRegistrationsByIP(parsedPopupId, clientIP);

    if (ipCount >= popupConfig.maxTicketsPerIP) {
      return NextResponse.json(
        { error: `Se alcanzó el límite de ${popupConfig.maxTicketsPerIP} inscripciones por dirección IP` },
        { status: 400 }
      );
    }

    // Create registration with validated and sanitized data
    const result = await createRegistration(
      parsedPopupId,
      nameStr,
      surnameStr,
      emailStr,
      genderStr as 'Masculino' | 'Femenino' | 'Otro',
      parsedQuantity,
      clientIP
    );

    if (!result.success) {
      if (result.error === 'EMAIL_EXISTS') {
        return NextResponse.json(
          { error: 'Este email ya está registrado' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: 'Error al procesar la inscripción' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '¡Inscripción exitosa!',
      data: {
        name: nameStr,
        surname: surnameStr,
        email: emailStr,
        gender: genderStr,
        ticketQuantity: parsedQuantity,
      },
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}
