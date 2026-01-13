import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

export const getUsers = async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT user_id, name, email, phone, role, avatar, is_active, created_at FROM users ORDER BY created_at DESC'
    );

    res.json(users);
  } catch (error) {
    console.error('Get Users error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT user_id, name, email, phone, role, avatar FROM users WHERE user_id = ?',
      [req.user.user_id]
    );
    res.json(users[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { name, email, phone, avatar, password } = req.body;

    const updateFields = [];
    const updateValues = [];

    if (name) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }
    if (email) {
      updateFields.push('email = ?');
      updateValues.push(email);
    }
    if (phone) {
      updateFields.push('phone = ?');
      updateValues.push(phone);
    }
    if (avatar) {
      updateFields.push('avatar = ?');
      updateValues.push(avatar);
    }
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateFields.push('password = ?');
      updateValues.push(hashedPassword);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    updateValues.push(req.user.user_id);

    await pool.query(
      `UPDATE users SET ${updateFields.join(', ')} WHERE user_id = ?`,
      updateValues
    );

    const [updatedUser] = await pool.query(
      'SELECT user_id, name, email, phone, role, avatar FROM users WHERE user_id = ?',
      [req.user.user_id]
    );

    res.json(updatedUser[0]);
  } catch (error) {
    console.error('Update User Profile error:', error);
    res.status(400).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM users WHERE user_id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User removed successfully' });
  } catch (error) {
    console.error('Delete User error:', error);
    res.status(500).json({ message: error.message });
  }
};
