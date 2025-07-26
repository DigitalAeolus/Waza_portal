const mysql = require('mysql2/promise')
require('dotenv').config({ path: '.env.local' })

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '3306'),
  charset: 'utf8mb4',
  timezone: '+00:00',
  supportBigNumbers: true,
  bigNumberStrings: true,
  connectTimeout: 10000,
  acquireTimeout: 10000,
  timeout: 10000,
}

async function testConnection() {
  let connection
  
  try {
    console.log('Testing database connection...')
    console.log('Host:', dbConfig.host)
    console.log('Database:', dbConfig.database)
    console.log('User:', dbConfig.user)
    
    connection = await mysql.createConnection(dbConfig)
    await connection.ping()
    
    console.log('✅ Database connection successful!')
    
    // Test basic query
    const [rows] = await connection.execute('SELECT 1 as test')
    console.log('✅ Query test successful:', rows)
    
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    return false
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

testConnection()