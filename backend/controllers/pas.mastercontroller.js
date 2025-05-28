import pool from "../db/connectMariaDB.js";

//MEDICAL TEST
export const addTest = async (req, res) => {
  const { test_name, test_type, test_price } = req.body;
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(
      "INSERT INTO TestMaster (test_name, test_type, test_price) VALUES (?,?,?)",
      [test_name, test_type, test_price]
    );
    res
      .status(200)
      .json({ success: true, message: "New Test added successfully" });
  } catch (error) {
    throw error;
  } finally {
    if (conn) {
      conn.release();
    }
  }
};
export const editTest = async (req, res) => {
  const { id, test_name, test_type, test_price } = req.body;
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(
      "UPDATE TestMaster SET test_name=?, test_type=?, test_price=? where id=?",
      [test_name, test_type, test_price, id]
    );
    res.status(200).json({
      success: true,
      message: `Test: ${test_name} updated successfully`,
    });
  } catch (error) {
    throw error;
  } finally {
    if (conn) {
      conn.release();
    }
  }
};
export const deleteTest = async (req, res) => {
  const { id } = req.body;
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query("DELETE FROM TestMaster where id=?", [id]);
    res
      .status(200)
      .json({ success: true, message: `Test: deleted successfully` });
  } catch (error) {
    throw error;
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

export const getTests = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(
      "SELECT * FROM TestMaster order by test_name"
    );
    res.status(200).json(result);
  } catch (error) {
    throw error;
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

export const searchTests = async (req, res) => {
  const { test_name } = req.body;
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(
      `SELECT * FROM TestMaster where lower(test_name) LIKE ? ORDER BY test_name`,
      [`%${test_name.toLowerCase()}%`]
    );
    res.status(200).json(result);
  } catch (error) {
    throw error;
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

//PHARMACY
export const addPharmacyItem = async (req, res) => {
  const { name, stock_quantity, price_per_unit, expiry_date } = req.body;
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(
      "INSERT INTO Pharmacy ( name, stock_quantity, price_per_unit, expiry_date) VALUES (?,?,?,?)",
      [name, stock_quantity, price_per_unit, expiry_date]
    );
    res.status(200).json({
      success: true,
      message: "New Item added to Pharmacy successfully",
    });
  } catch (error) {
    throw error;
  } finally {
    if (conn) {
      conn.release();
    }
  }
};
export const editPharmacyItem = async (req, res) => {
  const { id, name, stock_quantity, price_per_unit, expiry_date } = req.body;
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(
      "UPDATE Pharmacy SET name=?, stock_quantity=?, price_per_unit=?, expiry_date=? where id=?",
      [name, stock_quantity, price_per_unit, expiry_date, id]
    );
    res.status(200).json({
      success: true,
      message: `Item in pharmacy: ${name} updated successfully`,
    });
  } catch (error) {
    throw error;
  } finally {
    if (conn) {
      conn.release();
    }
  }
};
export const deletePharmacyItem = async (req, res) => {
  const { id } = req.body;
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query("DELETE FROM Pharmacy where id=?", [id]);
    res
      .status(200)
      .json({ success: true, message: `Pharmacy Item: deleted successfully` });
  } catch (error) {
    throw error;
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

export const getPharmacyItems = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(
      "SELECT * FROM Pharmacy where stock_quantity > 0 order by name"
    );
    res.status(200).json(result);
  } catch (error) {
    throw error;
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

export const searchPharmacyItems = async (req, res) => {
  const { name } = req.body;
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(
      `SELECT * FROM Pharmacy where lower(name) LIKE ? ORDER BY name`,
      [`%${name.toLowerCase()}%`]
    );
    res.status(200).json(result);
  } catch (error) {
    throw error;
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

//CANTEEN ITEM MASTER
export const addCanteenItem = async (req, res) => {
  const { item_name, item_price, quantity, expiry_date } = req.body;
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(
      "INSERT INTO CanteenItemMaster ( item_name, item_price, quantity,expiry_date) VALUES (?,?,?,?)",
      [item_name, item_price, quantity, expiry_date]
    );
    res.status(200).json({
      success: true,
      message: "New  Item added to Canteen successfully",
    });
  } catch (error) {
    throw error;
  } finally {
    if (conn) {
      conn.release();
    }
  }
};
export const editCanteenItem = async (req, res) => {
  const { id, item_name, item_price, quantity } = req.body;
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(
      "UPDATE CanteenItemMaster SET item_name=?, item_price=?, quantity=? where id=?",
      [item_name, item_price, quantity, id]
    );
    res.status(200).json({
      success: true,
      message: `Item in canteen: ${item_name} updated successfully`,
    });
  } catch (error) {
    throw error;
  } finally {
    if (conn) {
      conn.release();
    }
  }
};
export const deleteCanteenItem = async (req, res) => {
  const { id } = req.body;
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(
      "DELETE FROM CanteenItemMaster where id=?",
      [id]
    );
    res
      .status(200)
      .json({ success: true, message: `canteen Item: deleted successfully` });
  } catch (error) {
    throw error;
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

export const getCanteenItems = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(
      "SELECT * FROM CanteenItemMaster order by item_name"
    );
    res.status(200).json(result);
  } catch (error) {
    throw error;
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

export const searchCanteenItems = async (req, res) => {
  const { item_name } = req.body;
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(
      `SELECT * FROM CanteenItemMaster where lower(item_name) LIKE ? ORDER BY item_name`,
      [`%${item_name.toLowerCase()}%`]
    );
    res.status(200).json(result);
  } catch (error) {
    throw error;
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

//WARD MASTER
export const addWard = async (req, res) => {
  const { ward_name, total_beds, ward_type, per_day_rent } = req.body;
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(
      "INSERT INTO WardMaster ( ward_name, total_beds, ward_type,per_day_rent) VALUES (?,?,?,?)",
      [ward_name, total_beds, ward_type, per_day_rent]
    );
    res.status(200).json({
      success: true,
      message: "New  ward added successfully",
    });
  } catch (error) {
    throw error;
  } finally {
    if (conn) {
      conn.release();
    }
  }
};
export const editWard = async (req, res) => {
  const { id, ward_name, total_beds, ward_type, per_day_rent } = req.body;
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(
      "UPDATE WardMaster SET ward_name=?, total_beds=?, ward_type=?, per_day_rent=? where id=?",
      [ward_name, total_beds, ward_type, per_day_rent, id]
    );
    res.status(200).json({
      success: true,
      message: `Ward  updated successfully`,
    });
  } catch (error) {
    throw error;
  } finally {
    if (conn) {
      conn.release();
    }
  }
};
export const deleteWard = async (req, res) => {
  const { id } = req.body;
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query("DELETE FROM WardMaster where id=?", [id]);
    res
      .status(200)
      .json({ success: true, message: `Ward deleted successfully` });
  } catch (error) {
    throw error;
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

export const getWards = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(
      "SELECT * FROM WardMaster order by ward_name"
    );
    res.status(200).json(result);
  } catch (error) {
    throw error;
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

export const searchWards = async (req, res) => {
  const { ward_name } = req.body;
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(
      `SELECT * FROM WardMaster where lower(ward_name) LIKE ? ORDER BY ward_name`,
      [`%${ward_name.toLowerCase()}%`]
    );
    res.status(200).json(result);
  } catch (error) {
    throw error;
  } finally {
    if (conn) {
      conn.release();
    }
  }
};
