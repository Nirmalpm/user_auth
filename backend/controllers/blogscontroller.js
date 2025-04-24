import db from "../db/connectVYMySQLDB.js";

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special chars
    .trim()
    .replace(/\s+/g, "-"); // Replace spaces with dashes
};

export const saveBlog = async (req, res) => {
  const { id, title, content, userId } = req.body;
  console.log("line 13", title, content, userId);
  const insertScript = `
        INSERT INTO blogs (title, content, authorId, slug)
        VALUES (?, ?, ?, ?)
        RETURNING *;
    `;

  const updateScript = `
        UPDATE blogs
        SET title = ?, content = ?, authorId = ?
        WHERE id = ?
        RETURNING *;
    `;

  try {
    const userProfile = await db.query("select id from user where userId= ?", [
      userId,
    ]);
    const results = await db.query("select * from blogs where slug= ?", [
      generateSlug(title),
    ]);
    console.log(results[0]);
    if (results[0].length > 0) {
      return res.status(400).json({
        success: false,
        message: "Try another blog title. This title aready present",
      });
    }
    const userRow = userProfile[0];
    const authorId = userRow[0].id;
    let row;
    if (id) {
      // Update existing blog
      row = await db.query(updateScript, [title, content, authorId, id]);
    } else {
      const slug = generateSlug(title);
      // Insert new blog
      row = await db.query(insertScript, [title, content, authorId, slug]);
    }

    //res.status(200).json({ success: true, data: row[0] });
    await getBlogs(req, res);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal error: " + error });
  }
};

export const getBlogs = async (req, res) => {
  const { id, query } = req.query;
  const selectAllQuery = "select * from blogs order by createdTime desc";
  const selectIdQuery = "select * from blogs where id = ?";
  const selectSearchQuery =
    "select * from blogs where lower(title) like lower(?)";

  let results = null;
  try {
    if (id) {
      console.log(selectIdQuery);
      results = await db.execute(selectIdQuery, [id]);
    } else if (query) {
      console.log(selectSearchQuery);
      results = await db.execute(selectSearchQuery, [`%${query}%`]);
    } else {
      console.log(selectAllQuery);
      results = await db.execute(selectAllQuery);
    }
    res.status(200).json({ success: true, blogs: results[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllDisplayBlogs = async (req, res) => {
  const query =
    "select id, title, authorId from blogs order by createdTime desc";
  try {
    const results = await db.execute(query);
    console.log({ success: true, blogs: results[0] });
    res.status(200).json({ success: true, blogs: results[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBlog = async (req, res) => {
  const { id, user, authorId } = req.body;
  const delQuery = "delete from blogs where id = ? and authorId = ?";
  try {
    const userProfile = await db.query("select id from user where userId= ?", [
      user._id,
    ]);
    const userRow = userProfile[0];
    const profileUserId = userRow[0].id;

    if (user.roles.includes("admin") || authorId === profileUserId) {
      const result = await db.execute(delQuery, [id, authorId]);
      delete req.body.id;
    } else {
      console.log(113, user, authorId, profileUserId);
      const err = new Error("Forbidden");
      err.status = 403;
      throw err;
    }

    getBlogs(req, res);
  } catch (error) {
    throw error;
  }
};

export const saveBlogComment = async (req, res) => {
  const { id, parentId, userId, blogId, comment } = req.body;
  console.log("line 117", id, parentId, userId, blogId, comment);
  const insertScript = parentId
    ? `
        INSERT INTO blog_discussion (parentId, userId,blogId, comment)
        VALUES (?, ?, ?, ?)
        RETURNING *;
    `
    : `
        INSERT INTO blog_discussion (userId,blogId, comment)
        VALUES (?, ?, ?)
        RETURNING *;
    `;
  const updateScript = `
        UPDATE blog_discussion
        SET comment = ?
        WHERE id = ?
        RETURNING *;
    `;
  try {
    const userProfile = await db.query("select id from user where userId= ?", [
      userId,
    ]);
    const userRow = userProfile[0];
    const uId = userRow[0].id;
    let row;
    if (id) {
      // Update existing blog
      row = await db.query(updateScript, [comment, id]);
    } else {
      row = await db.query(
        insertScript,
        parentId ? [parentId, uId, blogId, comment] : [uId, blogId, comment]
      );
    }

    //res.status(200).json({ success: true, data: row[0] });
    await getComments(req, res);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal error: " + error });
  }
};

export const getComments = async (req, res) => {
  console.log(req.body?.blogId, req.query?.blogId);
  const blogId = req.body?.blogId ?? req.query?.blogId;

  const selectIdQuery = `
  WITH RECURSIVE comment_tree AS (
    SELECT 
      b.id, 
      b.userId, 
      b.blogId, 
      b.parentId, 
      b.comment, 
      b.createdTime, 
      u.name, 
      0 AS level,
      CAST(b.id AS CHAR(200)) AS path
    FROM blog_discussion b
    INNER JOIN user u ON b.userId = u.id
    WHERE b.blogId = ? AND b.parentId IS NULL

    UNION ALL

    SELECT 
      c.id, 
      c.userId, 
      c.blogId, 
      c.parentId, 
      c.comment, 
      c.createdTime, 
      u.name, 
      ct.level + 1,
      CONCAT(ct.path, '-', c.id)
    FROM blog_discussion c
    INNER JOIN user u ON c.userId = u.id
    INNER JOIN comment_tree ct ON c.parentId = ct.id
  )
  SELECT * FROM comment_tree ORDER BY path;
`;

  let results = null;
  try {
    results = await db.execute(selectIdQuery, [blogId]);
    res.status(200).json({ success: true, discussion: results[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  const { id, blogId, user, commentUserId } = req.body;
  const deleteQuery =
    "delete from blog_discussion where id = ? and blogId= ? and userId= ?";
  let results = null;
  try {
    const userProfile = await db.query("select id from user where userId= ?", [
      user._id,
    ]);
    const userRow = userProfile[0];
    const userProfileId = userRow[0].id;
    console.log(user.roles, commentUserId, userProfileId);

    if (user.roles.includes("admin") || commentUserId === userProfileId) {
      results = await db.execute(deleteQuery, [id, blogId, commentUserId]);
    } else {
      const err = new Error("Forbidden");
      err.status = 403;
      throw err;
    }

    getComments(req, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
