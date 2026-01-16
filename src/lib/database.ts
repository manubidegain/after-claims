import mysql from 'mysql2/promise';

export interface PopupRegistration {
  id: number;
  popup_id: number;
  name: string;
  surname: string;
  email: string;
  gender: 'Masculino' | 'Femenino' | 'Otro';
  ticket_quantity: number;
  ip_address: string;
  created_at: Date;
}

const createConnection = async () => {
  return mysql.createConnection({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
};

export const createRegistration = async (
  popupId: number,
  name: string,
  surname: string,
  email: string,
  gender: 'Masculino' | 'Femenino' | 'Otro',
  ticketQuantity: number,
  ipAddress: string
): Promise<{ success: boolean; error?: string }> => {
  let connection;

  try {
    connection = await createConnection();

    await connection.execute(`
      INSERT INTO popup_registrations (popup_id, name, surname, email, gender, ticket_quantity, ip_address)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [popupId, name, surname, email, gender, ticketQuantity, ipAddress]);

    return { success: true };
  } catch (error: unknown) {
    console.error('Database error:', error);

    // Check for duplicate email error
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ER_DUP_ENTRY') {
      return { success: false, error: 'EMAIL_EXISTS' };
    }

    return { success: false, error: 'DATABASE_ERROR' };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

export const checkEmailExists = async (
  popupId: number,
  email: string
): Promise<boolean> => {
  let connection;

  try {
    connection = await createConnection();

    const [rows] = await connection.execute(`
      SELECT id
      FROM popup_registrations
      WHERE popup_id = ? AND email = ?
    `, [popupId, email]);

    const results = rows as Array<{ id: number }>;
    return results.length > 0;
  } catch (error) {
    console.error('Database error:', error);
    return false;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

export const countRegistrationsByIP = async (
  popupId: number,
  ipAddress: string
): Promise<number> => {
  let connection;

  try {
    connection = await createConnection();

    const [rows] = await connection.execute(`
      SELECT COUNT(*) as count
      FROM popup_registrations
      WHERE popup_id = ? AND ip_address = ?
    `, [popupId, ipAddress]);

    const results = rows as Array<{ count: number }>;
    return results[0]?.count || 0;
  } catch (error) {
    console.error('Database error:', error);
    return 0;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

export const getTotalTicketsRequested = async (
  popupId: number
): Promise<number> => {
  let connection;

  try {
    connection = await createConnection();

    const [rows] = await connection.execute(`
      SELECT COALESCE(SUM(ticket_quantity), 0) as total
      FROM popup_registrations
      WHERE popup_id = ?
    `, [popupId]);

    const results = rows as Array<{ total: number }>;
    return results[0]?.total || 0;
  } catch (error) {
    console.error('Database error:', error);
    return 0;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

export const getTotalTicketsByGender = async (
  popupId: number,
  gender: 'Masculino' | 'Femenino' | 'Otro'
): Promise<number> => {
  let connection;

  try {
    connection = await createConnection();

    const [rows] = await connection.execute(`
      SELECT COALESCE(SUM(ticket_quantity), 0) as total
      FROM popup_registrations
      WHERE popup_id = ? AND gender = ?
    `, [popupId, gender]);

    const results = rows as Array<{ total: number }>;
    return results[0]?.total || 0;
  } catch (error) {
    console.error('Database error:', error);
    return 0;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

export const isFormClosed = async (
  popupId: number,
  maxTickets: number
): Promise<boolean> => {
  const totalTickets = await getTotalTicketsRequested(popupId);
  return totalTickets >= maxTickets;
};
