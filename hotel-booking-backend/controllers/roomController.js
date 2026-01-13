import pool from '../config/db.js';

const safeJSONParse = (str, defaultValue = []) => {
  if (!str) return defaultValue;
  if (typeof str === 'object') return str; 
  
  try {
    return JSON.parse(str);
  } catch (e) {
    try {
      const cleaned = str.replace(/^"|"$/g, '').replace(/\\/g, '');
      return JSON.parse(cleaned);
    } catch (e2) {
      console.error('JSON parse error:', str);
      return defaultValue;
    }
  }
};

export const getRooms = async (req, res) => {
  try {
    const [rooms] = await pool.query('SELECT * FROM rooms ORDER BY featured DESC, created_at DESC');
    
    const formattedRooms = rooms.map(room => ({
      ...room,
      id: room.room_id,
      amenities: safeJSONParse(room.amenities, ['WiFi', 'TV', 'AC']),
      images: safeJSONParse(room.images, ['https://via.placeholder.com/400x300'])
    }));

    res.json(formattedRooms);
  } catch (error) {
    console.error('Get Rooms error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getRoomById = async (req, res) => {
  try {
    const [rooms] = await pool.query('SELECT * FROM rooms WHERE room_id = ?', [req.params.id]);

    if (rooms.length === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const room = {
      ...rooms[0],
      id: rooms[0].room_id,
      amenities: safeJSONParse(rooms[0].amenities, ['WiFi', 'TV', 'AC']),
      images: safeJSONParse(rooms[0].images, ['https://via.placeholder.com/400x300'])
    };

    res.json(room);
  } catch (error) {
    console.error('Get Room by ID error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const createRoom = async (req, res) => {
  try {
    const { name, type, description, price, capacity, size, amenities, images, available, rating, featured } = req.body;

    const [result] = await pool.query(
      `INSERT INTO rooms (name, type, description, price, capacity, size, amenities, images, available, rating, featured) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        type,
        description || 'Comfortable and spacious room',
        price,
        capacity,
        size || 25,
        JSON.stringify(amenities || ['WiFi', 'TV', 'AC']),
        JSON.stringify(images || ['https://via.placeholder.com/400x300']),
        available !== undefined ? available : true,
        rating || 4.5,
        featured || false
      ]
    );

    const roomId = result.insertId;
    const [newRoom] = await pool.query('SELECT * FROM rooms WHERE room_id = ?', [roomId]);

    res.status(201).json({
      ...newRoom[0],
      id: newRoom[0].room_id,
      amenities: safeJSONParse(newRoom[0].amenities, ['WiFi', 'TV', 'AC']),
      images: safeJSONParse(newRoom[0].images, ['https://via.placeholder.com/400x300'])
    });
  } catch (error) {
    console.error('Create Room error:', error);
    res.status(400).json({ message: error.message });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const { name, type, description, price, capacity, size, amenities, images, available, rating, featured } = req.body;

    const updateFields = [];
    const updateValues = [];

    if (name) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }
    if (type) {
      updateFields.push('type = ?');
      updateValues.push(type);
    }
    if (description) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }
    if (price !== undefined) {
      updateFields.push('price = ?');
      updateValues.push(price);
    }
    if (capacity) {
      updateFields.push('capacity = ?');
      updateValues.push(capacity);
    }
    if (size) {
      updateFields.push('size = ?');
      updateValues.push(size);
    }
    if (amenities) {
      updateFields.push('amenities = ?');
      updateValues.push(JSON.stringify(amenities));
    }
    if (images) {
      updateFields.push('images = ?');
      updateValues.push(JSON.stringify(images));
    }
    if (available !== undefined) {
      updateFields.push('available = ?');
      updateValues.push(available);
    }
    if (rating !== undefined) {
      updateFields.push('rating = ?');
      updateValues.push(rating);
    }
    if (featured !== undefined) {
      updateFields.push('featured = ?');
      updateValues.push(featured);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    updateValues.push(req.params.id);

    await pool.query(
      `UPDATE rooms SET ${updateFields.join(', ')} WHERE room_id = ?`,
      updateValues
    );

    const [updatedRoom] = await pool.query('SELECT * FROM rooms WHERE room_id = ?', [req.params.id]);

    if (updatedRoom.length === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json({
      ...updatedRoom[0],
      id: updatedRoom[0].room_id,
      amenities: safeJSONParse(updatedRoom[0].amenities, ['WiFi', 'TV', 'AC']),
      images: safeJSONParse(updatedRoom[0].images, ['https://via.placeholder.com/400x300'])
    });
  } catch (error) {
    console.error('Update Room error:', error);
    res.status(400).json({ message: error.message });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM rooms WHERE room_id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json({ message: 'Room removed successfully' });
  } catch (error) {
    console.error('Delete Room error:', error);
    res.status(500).json({ message: error.message });
  }
};