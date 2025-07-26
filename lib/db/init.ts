import mysql from 'mysql2/promise'
import fs from 'fs'
import path from 'path'

const dbConfig = {
  host: process.env.DB_HOST ,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT),
  charset: 'utf8mb4',
  timezone: '+00:00',
  supportBigNumbers: true,
  bigNumberStrings: true,
  multipleStatements: true,
}

export async function initializeDatabase() {
  let connection
  
  try {
    connection = await mysql.createConnection(dbConfig)
    
    const schemaPath = path.join(process.cwd(), 'db', 'schema.sql')
    const schemaSql = fs.readFileSync(schemaPath, 'utf8')
    
    const statements = schemaSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0)
    
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.execute(statement)
      }
    }
    
    console.log('Database schema initialized successfully')
    return true
    
  } catch (error) {
    console.error('Database initialization failed:', error)
    throw error
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

export async function testConnection() {
  let connection
  
  try {
    connection = await mysql.createConnection(dbConfig)
    await connection.ping()
    console.log('Database connection successful')
    return true
  } catch (error) {
    console.error('Database connection failed:', error)
    throw error
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}