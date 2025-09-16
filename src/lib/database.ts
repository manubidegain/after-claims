import mysql from 'mysql2/promise';

interface DatabaseOrder {
  tckid: string;
  userid: string;
  date: string;
  etid: string;
  qty: number;
  eventid: string;
  subtotal: number;
  service: number;
  total: number;
  osubtotal: number;
  exchange: number;
  oexchange: number;
  currency: string;
  status: string;
}

interface DatabaseUser {
  userid: string;
  rol: string;
  status: string;
  pass: string;
  name: string;
  ci: string;
  email: string;
  signup: string;
  lastbuy: string | null;
  birth_date: string;
  avatar: string;
  phone: string;
  level: string;
  badage: string;
  zone: string | null;
  subscribe: string;
  country: string;
  city: string;
  banned: string | null;
  ip: string | null;
  referer: string;
  ref: string | null;
  mailchimp: string;
  mercadopago: string;
  sms: string;
  oauth: string;
  social: string | null;
  econfirm: string;
}

export interface OrderWithUser {
  orderId: string;
  qty: number;
  email: string;
  name: string;
  eventid: string;
  etid: string;
}

export interface TicketInfo {
  orderId: string;
  tckid: string;
  email: string;
  name: string;
  eventid: string;
  etid: string;
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

export const getOrderByTicketIdAndEmail = async (
  orderId: string, 
  email: string
): Promise<TicketInfo[]> => {
  let connection;
  
  try {
    connection = await createConnection();
    
    const [rows] = await connection.execute(`
      SELECT 
        tii.tivid as orderId,
        tii.tckid,
        u.email,
        u.name,
        ti.eventid,
        t.etid
      FROM tickets_invoice ti
      INNER JOIN tickets_invoice_lines tii ON ti.tivid = tii.tivid
      INNER JOIN tickets t ON tii.tckid = t.tckid
      INNER JOIN user u ON ti.userid = u.userid
      WHERE tii.tivid = ? AND u.email = ?
    `, [orderId, email]);

    console.log('Query result rows:', rows); // Debugging line
    console.log(email, orderId)
    const results = rows as TicketInfo[];
    return results;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Error connecting to database');
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

export const saveAfterOrder = async (
  orderId: string,
  email: string,
  quantity: number
): Promise<boolean> => {
  let connection;
  
  try {
    connection = await createConnection();
    
    // Create table if it doesn't exist - order_id as primary key
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS after_orders (
        order_id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        quantity INT NOT NULL
      )
    `);
    
    // Insert the after order
    await connection.execute(`
      INSERT INTO after_orders (order_id, email, quantity) 
      VALUES (?, ?, ?) 
    `, [orderId, email, quantity]);

    return true;
  } catch (error) {
    console.error('Database error:', error);
    return false;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

export const checkAfterOrderExists = async (
  orderId: string,
  email: string
): Promise<{ exists: boolean; quantity?: number; email?: string }> => {
  let connection;
  
  try {
    connection = await createConnection();
    
    const [rows] = await connection.execute(`
      SELECT quantity, email
      FROM after_orders 
      WHERE order_id = ?
    `, [orderId]);

    const results = rows as Array<{ quantity: number; email: string }>;
    
    if (results.length > 0) {
      return {
        exists: true,
        quantity: results[0].quantity,
        email: results[0].email
      };
    }
    
    return { exists: false };
  } catch (error) {
    console.error('Database error:', error);
    return { exists: false };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};