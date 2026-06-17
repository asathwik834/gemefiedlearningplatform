import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MySQL configuration details
const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
};

let pool;

async function initializeDatabase() {
  try {
    // 1. First connect without specifying database to create it if it doesn't exist
    const connection = await mysql.createConnection(dbConfig);
    console.log('Successfully connected to MySQL server.');
    
    const dbName = process.env.DB_NAME || 'gemefied_learning';
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`Database '${dbName}' checked/created.`);
    await connection.end();

    // 2. Connect with database specified using connection pool
    pool = mysql.createPool({
      ...dbConfig,
      database: dbName,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    console.log('MySQL Connection Pool initialized.');

    // 3. Check and run migration if needed
    const conn = await pool.getConnection();
    let needsMigration = false;
    try {
      const [tables] = await conn.query("SHOW TABLES LIKE 'users'");
      if (tables.length > 0) {
        const [columns] = await conn.query("SHOW COLUMNS FROM users LIKE 'phone_number'");
        if (columns.length === 0) {
          needsMigration = true;
        }
      }
      if (needsMigration) {
        console.log("Old schema detected. Dropping old tables to recreate with phone_number & address...");
        await conn.query('SET FOREIGN_KEY_CHECKS = 0');
        await conn.query('DROP TABLE IF EXISTS student_progress');
        await conn.query('DROP TABLE IF EXISTS rewards');
        await conn.query('DROP TABLE IF EXISTS users');
        await conn.query('SET FOREIGN_KEY_CHECKS = 1');
      }
    } finally {
      conn.release();
    }

    // 4. Create tables
    await createTables();

    // 5. Seed default users
    await seedDatabase();

  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

async function createTables() {
  const conn = await pool.getConnection();
  try {
    // Users table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone_number VARCHAR(20) UNIQUE NOT NULL,
        address TEXT NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('student', 'teacher', 'admin') NOT NULL,
        grade INT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Verified 'users' table.");

    // Progress table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS student_progress (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        game_id VARCHAR(100) NOT NULL,
        score INT NOT NULL,
        difficulty VARCHAR(50) DEFAULT 'Beginner',
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log("Verified 'student_progress' table.");

    // Rewards table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS rewards (
        user_id VARCHAR(255) PRIMARY KEY,
        points INT DEFAULT 0,
        badges JSON DEFAULT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log("Verified 'rewards' table.");

  } catch (err) {
    console.error('Error creating tables:', err);
    throw err;
  } finally {
    conn.release();
  }
}

async function seedDatabase() {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query('SELECT id FROM users WHERE email = ?', ['student@example.com']);
    if (rows.length === 0) {
      console.log('Seeding default users...');
      const salt = await bcrypt.genSalt(10);
      const passHash = await bcrypt.hash('1234', salt);

      // Student
      await conn.query(
        'INSERT INTO users (id, name, email, phone_number, address, password_hash, role, grade) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        ['user-default-student', 'Default Student', 'student@example.com', '1234567890', '123 Main St, Education Hub', passHash, 'student', 8]
      );
      await conn.query(
        'INSERT INTO rewards (user_id, points, badges) VALUES (?, 0, ?)',
        ['user-default-student', JSON.stringify([])]
      );

      // Teacher
      await conn.query(
        'INSERT INTO users (id, name, email, phone_number, address, password_hash, role, grade) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        ['user-default-teacher', 'Default Teacher', 'teacher@example.com', '9876543210', '456 Knowledge Rd, Lesson City', passHash, 'teacher', null]
      );

      // Admin
      await conn.query(
        'INSERT INTO users (id, name, email, phone_number, address, password_hash, role, grade) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        ['user-default-admin', 'System Admin', 'admin@example.com', '5555555555', 'Admin HQ, Central Terminal', passHash, 'admin', null]
      );
      console.log('Successfully seeded database default users.');
    }
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    conn.release();
  }
}

// REST API routes

// Authentication: Signup
app.post('/api/auth/signup', async (req, res) => {
  const { id, name, email, phone_number, address, password, role, grade } = req.body;
  if (!name || !email || !phone_number || !address || !password || !role) {
    return res.status(400).json({ error: 'All fields (name, email, phone number, address, password, role) are required.' });
  }

  try {
    // Check if user already exists
    const [existing] = await pool.query('SELECT id, email, phone_number FROM users WHERE email = ? OR phone_number = ?', [email, phone_number]);
    if (existing.length > 0) {
      const matched = existing[0];
      if (matched.email === email) {
        return res.status(400).json({ error: 'A user with this email already exists.' });
      }
      if (matched.phone_number === phone_number) {
        return res.status(400).json({ error: 'A user with this phone number already exists.' });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const userId = id || `user-${Date.now()}`;

    // Insert user
    await pool.query(
      'INSERT INTO users (id, name, email, phone_number, address, password_hash, role, grade) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, name, email, phone_number, address, passwordHash, role, grade || null]
    );

    // Insert empty rewards configuration for this user
    if (role === 'student') {
      await pool.query(
        'INSERT INTO rewards (user_id, points, badges) VALUES (?, 0, ?)',
        [userId, JSON.stringify([])]
      );
    }

    res.status(201).json({
      message: 'Signup successful!',
      user: { id: userId, name, email, phone_number, address, role, grade }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Authentication: Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ error: 'Email, password and role are required.' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ? AND role = ?', [email, role]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email, role, or password.' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email, role, or password.' });
    }

    res.json({
      message: 'Login successful!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone_number: user.phone_number,
        address: user.address,
        role: user.role,
        grade: user.grade,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ==========================================================
// CRUD OPERATIONS FOR USERS (Admin Dashboard APIs)
// ==========================================================

// CRUD: Get all registered users directly from MySQL
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, phone_number, address, role, grade, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Fetch users list error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// CRUD: Create new user dynamically
app.post('/api/users', async (req, res) => {
  const { name, email, phone_number, address, password, role, grade } = req.body;
  if (!name || !email || !phone_number || !address || !password || !role) {
    return res.status(400).json({ error: 'All fields (name, email, phone number, address, password, role) are required.' });
  }

  try {
    // Validate unique email and phone
    const [existing] = await pool.query('SELECT id, email, phone_number FROM users WHERE email = ? OR phone_number = ?', [email, phone_number]);
    if (existing.length > 0) {
      const matched = existing[0];
      if (matched.email === email) {
        return res.status(400).json({ error: 'A user with this email already exists.' });
      }
      if (matched.phone_number === phone_number) {
        return res.status(400).json({ error: 'A user with this phone number already exists.' });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const userId = `user-${Date.now()}`;

    await pool.query(
      'INSERT INTO users (id, name, email, phone_number, address, password_hash, role, grade) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, name, email, phone_number, address, passwordHash, role, grade || null]
    );

    if (role === 'student') {
      await pool.query(
        'INSERT INTO rewards (user_id, points, badges) VALUES (?, 0, ?)',
        [userId, JSON.stringify([])]
      );
    }

    res.status(201).json({ message: 'User created successfully!' });
  } catch (error) {
    console.error('Create user from dashboard error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// CRUD: Update user details dynamically
app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, phone_number, address, password, role, grade } = req.body;

  if (!name || !email || !phone_number || !address || !role) {
    return res.status(400).json({ error: 'Name, email, phone number, address, and role are required.' });
  }

  try {
    // Validate uniqueness of email and phone (except current user)
    const [existing] = await pool.query(
      'SELECT id, email, phone_number FROM users WHERE (email = ? OR phone_number = ?) AND id != ?',
      [email, phone_number, id]
    );
    if (existing.length > 0) {
      const matched = existing[0];
      if (matched.email === email) {
        return res.status(400).json({ error: 'Email is already in use by another user.' });
      }
      if (matched.phone_number === phone_number) {
        return res.status(400).json({ error: 'Phone number is already in use by another user.' });
      }
    }

    if (password && password.trim() !== '') {
      // If updating password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      await pool.query(
        'UPDATE users SET name = ?, email = ?, phone_number = ?, address = ?, password_hash = ?, role = ?, grade = ? WHERE id = ?',
        [name, email, phone_number, address, passwordHash, role, grade || null, id]
      );
    } else {
      // Update without changing password
      await pool.query(
        'UPDATE users SET name = ?, email = ?, phone_number = ?, address = ?, role = ?, grade = ? WHERE id = ?',
        [name, email, phone_number, address, role, grade || null, id]
      );
    }

    res.json({ message: 'User updated successfully!' });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// CRUD: Delete user dynamically
app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'User deleted successfully!' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Progress: Get student progress
app.get('/api/progress/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const [rows] = await pool.query(
      'SELECT game_id, score, difficulty, completed_at FROM student_progress WHERE user_id = ? ORDER BY completed_at DESC',
      [userId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Fetch progress error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Progress: Save student progress
app.post('/api/progress', async (req, res) => {
  const { userId, gameId, score, difficulty } = req.body;
  if (!userId || !gameId || score === undefined) {
    return res.status(400).json({ error: 'userId, gameId and score are required.' });
  }

  try {
    await pool.query(
      'INSERT INTO student_progress (user_id, game_id, score, difficulty) VALUES (?, ?, ?, ?)',
      [userId, gameId, score, difficulty || 'Beginner']
    );
    res.status(201).json({ message: 'Progress saved successfully!' });
  } catch (error) {
    console.error('Save progress error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Rewards: Get user points & badges
app.get('/api/rewards/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const [rows] = await pool.query('SELECT points, badges FROM rewards WHERE user_id = ?', [userId]);
    if (rows.length === 0) {
      // Return default if not found
      return res.json({ points: 0, badges: [] });
    }
    const badges = typeof rows[0].badges === 'string' ? JSON.parse(rows[0].badges) : rows[0].badges;
    res.json({
      points: rows[0].points,
      badges: badges || []
    });
  } catch (error) {
    console.error('Fetch rewards error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Rewards: Update points & badges
app.post('/api/rewards', async (req, res) => {
  const { userId, points, badges } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'userId is required.' });
  }

  try {
    const badgesJson = JSON.stringify(badges || []);
    await pool.query(
      'INSERT INTO rewards (user_id, points, badges) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE points = ?, badges = ?',
      [userId, points || 0, badgesJson, points || 0, badgesJson]
    );
    res.json({ message: 'Rewards updated successfully!' });
  } catch (error) {
    console.error('Update rewards error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start application database and server
initializeDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Backend server is running on http://localhost:${port}`);
  });
});
