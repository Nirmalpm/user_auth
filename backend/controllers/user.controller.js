import db from "../db/connectVYMySQLDB.js";

export const isUserPresent = async (req, res) => {
  const { userId } = req.body;
  const selectQuery = `SELECT id  FROM user WHERE  userId = ?`;
  const values = [userId];

  try {
    const [results] = await db.query(selectQuery, values);
    //console.log(results);
    if (results.length > 0) {
      return res.status(200).json({
        success: true,
        message:
          results[0].id !== null && results[0].id !== undefined
            ? "User profile present"
            : "User not found",
        id: results[0].id,
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "User not found",
        id: "",
      });
    }
  } catch (error) {
    console.error("Error while checking for user profile:", error);
    res.status(500).json({
      success: false,
      message: `Error while checking for user profile ${error.message}`,
    });
  }
};
export const addUser = async (req, res) => {
  const { email, name, userId, phoneNumber } = req.body;
  console.log(email, name, userId, phoneNumber);
  const insertQuery =
    "INSERT INTO user (name, email, userId,phoneNumber) VALUES (?, ?, ?, ?)";
  const values = [name, email, userId, phoneNumber];

  try {
    const [row] = await db.query(insertQuery, values);
    return res.status(200).json({
      sucess: true,
      message: "User profile successfully added",
      userProfile: { userId: row.insertId, name, email, phoneNumber },
    });
  } catch (error) {
    console.error("User profile table insertion failed:", error);
    return res.status(500).json({
      sucess: false,
      message: `Error while saving user profile ${error.message}`,
    });
  }
};

export const isUserProfileHomePresent = async (req, res) => {
  const { userId } = req.body;
  const selectQuery = `SELECT *  FROM user_home WHERE  userId = ?`;
  const values = [userId];

  try {
    const [results] = await db.query(selectQuery, values);
    console.log(results);
    if (results.length > 0) {
      return res.status(200).json({
        success: true,
        message: "User profile home found",
        user: { ...results[0] },
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "User profile home not found",
        user: { userId },
      });
    }
  } catch (error) {
    console.error("Error while checking for user home:", error);
    res.status(500).json({
      success: false,
      message: `Error while checking for user home ${error.message}`,
    });
  }
};
export const addUpdateUserHome = async (req, res) => {
  const { userId, profileUserId, fullName, userDesc, imagePath, isUpdate } =
    req.body;

  console.log(userId, profileUserId, fullName, userDesc, imagePath, isUpdate);

  // Check if user profile already exists
  const checkQuery = "SELECT * FROM user_home WHERE userId = ?";
  const insertQuery =
    "INSERT INTO user_home (userId, fullName, userDesc, imagePath) VALUES (?, ?, ?, ?)";
  const updateQuery =
    "UPDATE user_home SET fullName=?, userDesc =?, imagePath=?, updatedTime = NOW() where userId=?";
  const values = [profileUserId, fullName, userDesc, imagePath];
  const updateValues = [fullName, userDesc, imagePath, profileUserId];

  try {
    let row = null;
    const [checkResults] = await db.query(checkQuery, [profileUserId]);
    if (checkResults.length > 0) {
      [row] = await db.query(updateQuery, updateValues);
    } else {
      [row] = await db.query(insertQuery, values);
    }
    await loadUserProfile(req, res);
  } catch (error) {
    console.error("Error while adding record to user_home:", error);
    return res.status(500).json({
      success: false,
      message: `Error while saving User Home: ${error.message}`,
    });
  }
};

export const addUpdateUserAbout = async (req, res) => {
  const { userId, profileUserId, userDesc } = req.body;

  console.log("addUpdateUserAbout", userId, profileUserId, userDesc);

  // Check if user profile already exists
  const checkQuery = "SELECT * FROM user_about WHERE userId = ?";
  const insertQuery = "INSERT INTO user_about (userId, userDesc) VALUES (?, ?)";
  const updateQuery =
    "UPDATE user_about SET userDesc =?,updatedTime = NOW() where userId=?";
  const values = [profileUserId, userDesc];
  const updateValues = [userDesc, profileUserId];

  try {
    let row = null;
    const [checkResults] = await db.query(checkQuery, [profileUserId]);
    if (checkResults.length > 0) {
      [row] = await db.query(updateQuery, updateValues);
    } else {
      [row] = await db.query(insertQuery, values);
    }

    await loadUserProfile(req, res);
  } catch (error) {
    console.error("Error while adding record to user_home:", error);
    return res.status(500).json({
      success: false,
      message: `Error while saving User Home: ${error.message}`,
      userHome: {},
    });
  }
};

export const updateFrontendSkills = async (req, res) => {
  const { userId, profileUserId, skills } = req.body;
  console.log("updateFrontendSkills", userId, profileUserId, skills);
  if (!Array.isArray(skills)) {
    return res.status(400).json({ error: "Skills should be an array" });
  }
  try {
    const updateQuery =
      "update user_frontend_skills set skillName=?, skillDesc =?, updatedTime = NOW() where id=? and userId=?";
    const updateSKills = skills.filter((skill) => !!skill.id);
    const updatePromises = updateSKills.map((skill) =>
      db.execute(updateQuery, [
        skill.name,
        skill.desc || "",
        skill.id,
        profileUserId,
      ])
    );
    await Promise.all(updatePromises);

    await loadUserProfile(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Skills update error!${error.message}`,
    });
  }
};

export const updateBackendSkills = async (req, res) => {
  const { userId, profileUserId, skills } = req.body;
  console.log("updateBackendSkills", userId, profileUserId, skills);
  if (!Array.isArray(skills)) {
    return res.status(400).json({ error: "Backend Skills should be an array" });
  }
  try {
    const updateQuery =
      "update user_backend_skills set skillName=?, skillDesc =?, updatedTime = NOW() where id=? and userId=?";
    const updateSKills = skills.filter((skill) => !!skill.id);

    const updatePromises = updateSKills.map((skill) =>
      db.execute(updateQuery, [
        skill.name,
        skill.desc || "",
        skill.id,
        profileUserId,
      ])
    );
    await Promise.all(updatePromises);
    await loadUserProfile(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Backend Skills update error!${error.message}`,
    });
  }
};

export const updateOtherSkills = async (req, res) => {
  const { userId, profileUserId, skills } = req.body;
  console.log("updateOtherSkills", userId, profileUserId, skills);
  if (!Array.isArray(skills)) {
    return res.status(400).json({ error: "Other Skills should be an array" });
  }
  try {
    const updateQuery =
      "update user_other_skills set skillName=?, skillDesc =?, updatedTime = NOW() where id=? and userId=?";
    const updateSKills = skills.filter((skill) => !!skill.id);
    const updatePromises = updateSKills.map((skill) =>
      db.execute(updateQuery, [
        skill.name,
        skill.desc || "",
        skill.id,
        profileUserId,
      ])
    );
    await Promise.all(updatePromises);
    await loadUserProfile(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Other Skills update error!${error.message}`,
    });
  }
};

export const updateEducation = async (req, res) => {
  const { userId, profileUserId, education } = req.body;
  console.log("updateEduction:", userId, profileUserId, education);
  try {
    const updateQuery =
      "update user_education set name=?, university =?, YearOfPassing =?, updatedTime = NOW() where id=? and userId=?";
    const insertQuery =
      "INSERT INTO user_education (name, university, yearOfPassing, userId) VALUES (?, ?, ?, ?)";
    let rows = null;
    if (education.id === undefined || education.id === null) {
      rows = await db.query(insertQuery, [
        education.name,
        education.university,
        education.yearOfPassing,
        profileUserId,
      ]);
    } else {
      rows = await db.query(updateQuery, [
        education.name,
        education.university,
        education.yearOfPassing,
        education.id,
        profileUserId,
      ]);
    }

    await loadUserProfile(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Eduction update error!${error.message}`,
    });
  }
};

export const updateCertification = async (req, res) => {
  const { userId, profileUserId, certification } = req.body;
  console.log("updateCertification:", userId, profileUserId, certification);
  try {
    const updateQuery =
      "update user_certification set certName=?, certYear =?, updatedTime = NOW() where id=? and userId=?";
    const insertQuery =
      "insert into user_certification (certName, certYear, userId) values (?, ?, ?)";

    let rows = null;
    if (certification.id === undefined || certification.id === null) {
      rows = await db.query(insertQuery, [
        certification.certName,
        certification.certYear,
        profileUserId,
      ]);
    } else {
      rows = await db.query(updateQuery, [
        certification.certName,
        certification.certYear,
        certification.id,
        profileUserId,
      ]);
    }

    await loadUserProfile(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Certification update error!${error.message}`,
    });
  }
};

export const updateWorkExp = async (req, res) => {
  const { userId, profileUserId, workexp } = req.body;
  console.log("updateWorkExp:", userId, profileUserId, workexp);
  try {
    const updateQuery =
      "update user_work_exp set expName=?, expDesc =?, duration =?, lastDesignation =?, updatedTime = NOW() where id=? and userId=?";
    const insertQuery =
      "insert into user_work_exp (expName, expDesc, duration, lastDesignation, userId) values (?, ?, ?, ?, ?)";

    let rows = null;
    if (workexp.id === undefined || workexp.id === null) {
      rows = await db.query(insertQuery, [
        workexp.expName,
        workexp.expDesc,
        workexp.duration,
        workexp.lastDesignation,
        profileUserId,
      ]);
    } else {
      rows = await db.query(updateQuery, [
        workexp.expName,
        workexp.expDesc,
        workexp.duration,
        workexp.lastDesignation,
        workexp.id,
        profileUserId,
      ]);
    }
    await loadUserProfile(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `WorkExp update error!${error.message}`,
    });
  }
};
export const updateProject = async (req, res) => {
  const { userId, profileUserId, project } = req.body;
  console.log("updateProject:", userId, profileUserId, project);
  try {
    const updateQuery =
      "update user_projects set projectName=?, projectDesc =?, duration =?, techUsed =?, updatedTime = NOW() where id=? and userId=?";
    const insertQuery =
      "insert into user_projects (projectName, projectDesc, duration, techUsed, userId) values (?, ?, ?, ?, ?)";

    let rows = null;
    if (project.id === undefined || project.id === null) {
      rows = await db.query(insertQuery, [
        project.projectName,
        project.projectDesc,
        project.duration,
        project.techUsed,
        profileUserId,
      ]);
    } else {
      rows = await db.query(updateQuery, [
        project.projectName,
        project.projectDesc,
        project.duration,
        project.techUsed,
        project.id,
        profileUserId,
      ]);
    }
    await loadUserProfile(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `WorkExp update error!${error.message}`,
    });
  }
};

export const addFrontendSkills = async (req, res) => {
  const { userId, profileUserId, skills } = req.body;
  console.log("addFrontendSkills", userId, profileUserId, skills);
  if (!Array.isArray(skills)) {
    return res.status(400).json({ error: "Skills should be an array" });
  }
  try {
    const insertQuery =
      "insert into user_frontend_skills (userId, skillName, skillDesc) values (?, ?, ?)";
    const insertSKills = skills.filter((skill) => !skill.id);
    const insertPromises = insertSKills.map((skill) =>
      db.execute(insertQuery, [profileUserId, skill.name, skill.desc || ""])
    );
    await Promise.all(insertPromises);
    await updateFrontendSkills(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Skills insertion error!${error.message}`,
    });
  }
};

export const addBackendSkills = async (req, res) => {
  const { userId, profileUserId, skills } = req.body;
  if (!Array.isArray(skills)) {
    return res.status(400).json({ error: "Backend Skills should be an array" });
  }
  try {
    const insertQuery =
      "insert into user_backend_skills (userId, skillName, skillDesc) values (?, ?, ?)";
    const insertSKills = skills.filter((skill) => !skill.id);

    const insertPromises = insertSKills.map((skill) =>
      db.execute(insertQuery, [profileUserId, skill.name, skill.desc || ""])
    );
    await Promise.all(insertPromises);
    await updateBackendSkills(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Backend Skills insertion error!${error.message}`,
    });
  }
};

export const addOtherSkills = async (req, res) => {
  const { userId, profileUserId, skills } = req.body;
  if (!Array.isArray(skills)) {
    return res.status(400).json({ error: "Other Skills should be an array" });
  }
  try {
    const insertQuery =
      "insert into user_other_skills (userId, skillName, skillDesc) values (?, ?, ?)";
    const insertSKills = skills.filter((skill) => !skill.id);
    const insertPromises = insertSKills.map((skill) =>
      db.execute(insertQuery, [profileUserId, skill.name, skill.desc || ""])
    );
    await Promise.all(insertPromises);
    await updateOtherSkills(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Other Skills insertion error!${error.message}`,
    });
  }
};

export const addEducation = async (req, res) => {
  const { userId, profileUserId, educations } = req.body;
  if (!Array.isArray(educations)) {
    return res.status(400).json({ error: "Educations should be an array" });
  }
  try {
    const insertQuery =
      "insert into user_education (name, university, yearOfPassing, userId) values (?, ?, ?, ?)";
    const insertPromises = educations.map((education) =>
      db.execute(insertQuery, [
        education.name,
        education.university,
        education.yearOfPassing,
        profileUserId,
      ])
    );
    await Promise.all(insertPromises);
    // res
    //   .status(200)
    //   .json({ success: true, message: "Education inserted successfully!" });
    await loadUserProfile(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Education insertion error!${error.message}`,
    });
  }
};

export const addCertification = async (req, res) => {
  const { userId, profileUserId, certifications } = req.body;
  if (!Array.isArray(certifications)) {
    return res.status(400).json({ error: "Certifications should be an array" });
  }
  try {
    const insertQuery =
      "insert into user_certification (certName, certYear, userId) values (?, ?, ?)";
    const insertPromises = certifications.map((certification) =>
      db.execute(insertQuery, [
        certification.certName,
        certification.certYear,
        profileUserId,
      ])
    );
    await Promise.all(insertPromises);
    // res.status(200).json({
    //   success: true,
    //   message: "Certifications inserted successfully!",
    // });
    await loadUserProfile(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Certifications insertion error!${error.message}`,
    });
  }
};

export const addWorkExp = async (req, res) => {
  const { userId, profileUserId, workExps } = req.body;
  if (!Array.isArray(workExps)) {
    return res.status(400).json({ error: "Work exps should be an array" });
  }
  try {
    const insertQuery =
      "insert into user_work_exp (expName, expDesc, duration, lastDesignation, userId) values (?, ?, ?, ?, ?)";
    const insertPromises = workExps.map((workExp) =>
      db.execute(insertQuery, [
        workExp.expName,
        workExp.expDesc,
        workExp.duration,
        workExp.lastDesignation,
        profileUserId,
      ])
    );
    await Promise.all(insertPromises);
    // res.status(200).json({
    //   success: true,
    //   message: "Work exps inserted successfully!",
    // });
    await loadUserProfile(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Work exps insertion error!${error.message}`,
    });
  }
};

const getUserProfile = async (userId) => {
  try {
    const [
      homeInfo,
      aboutInfo,
      frontend,
      backend,
      other,
      education,
      certification,
      workexp,
      projects,
    ] = await Promise.all([
      getUserHome(userId),
      getUserAbout(userId),
      getUserFrontendSkills(userId),
      getUserBackendSkills(userId),
      getUserOtherSkills(userId),
      getUserEducation(userId),
      getUserCertification(userId),
      getUserWorkExp(userId),
      getUserProjects(userId),
    ]);
    return {
      homeInfo,
      aboutInfo,
      frontend,
      backend,
      other,
      education,
      certification,
      workexp,
      projects,
    };
  } catch (error) {
    console.log("Error while fetching user about", error);
    res.status(500).json({
      success: true,
      message: "Error while getting User About Info",
      user_about: {},
    });
  }
};

const getUserHome = async (userId) => {
  const selectQuery = `SELECT *  FROM user_home WHERE  userId = ?`;
  const values = [userId];
  try {
    const [results] = await db.query(selectQuery, values);
    return results[0] || null;
  } catch (error) {
    console.log("user_about table access error", error);
    throw error;
  }
};
const getUserAbout = async (userId) => {
  try {
    const aboutQuery = "select * from user_about where userId = ?";
    const values = [userId];
    const [results] = await db.query(aboutQuery, values);
    return results[0] || null;
  } catch (error) {
    console.log("user_about table access error", error);
    throw error;
  }
};
const getUserFrontendSkills = async (userId) => {
  try {
    const skillQuery = "select * from user_frontend_skills where userId = ?";
    const values = [userId];
    const [results] = await db.query(skillQuery, values);
    // console.log("Front end skills", results);
    return results;
  } catch (error) {
    console.log("Error while fetching Front end skills", error);
    throw error;
  }
};

const getUserBackendSkills = async (userId) => {
  try {
    const skillQuery = "select * from user_backend_skills where userId = ?";
    const values = [userId];
    const [results] = await db.query(skillQuery, values);
    //console.log("Back end skills", results);
    return results;
  } catch (error) {
    console.log("Error while fetching Back end skills", error);
    throw error;
  }
};

const getUserOtherSkills = async (userId) => {
  try {
    const skillQuery = "select * from user_other_skills where userId = ?";
    const values = [userId];
    const [results] = await db.query(skillQuery, values);
    // console.log("Other skills", results);
    return results;
  } catch (error) {
    console.log("Error while fetching Other skills", error);
    throw error;
  }
};

const getUserEducation = async (userId) => {
  try {
    const eduQuery = "select * from user_education where userId = ?";
    const values = [userId];
    const [results] = await db.query(eduQuery, values);
    //console.log("Education", results);
    return results;
  } catch (error) {
    console.log("Error while fetching Education", error);
    throw error;
  }
};

const getUserCertification = async (userId) => {
  try {
    const certQuery = "select * from user_certification where userId = ?";
    const values = [userId];
    const [results] = await db.query(certQuery, values);
    // console.log("Certification", results);
    return results;
  } catch (error) {
    console.log("Error while fetching Certification", error);
    throw error;
  }
};

const getUserWorkExp = async (userId) => {
  try {
    const expQuery = "select * from user_work_exp where userId = ?";
    const values = [userId];
    const [results] = await db.query(expQuery, values);
    // console.log("Work Experience", results);
    return results;
  } catch (error) {
    console.log("Error while fetching Work Experience", error);
    throw error;
  }
};

const getUserProjects = async (userId) => {
  try {
    const expQuery = "select * from user_projects where userId = ?";
    const values = [userId];
    const [results] = await db.query(expQuery, values);
    // console.log("Work Experience", results);
    return results;
  } catch (error) {
    console.log("Error while fetching user projectse", error);
    throw error;
  }
};

export const loadUserProfile = async (req, res) => {
  const { userId } = req.body;
  try {
    const [rows] = await db.query("select * from user where userId = ?", [
      userId,
    ]);
    const { id, name, email, phoneNumber } = rows[0];
    console.log(id, name, email);
    const data = await getUserProfile(id);
    //console.log({ userId: id, name, email, ...data });
    res
      .status(200)
      .json({ userId, profileUserId: id, name, email, phoneNumber, ...data });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const deleteSkill = async (req, res) => {
  const { userId, profileUserId, id, tableName } = req.body;
  console.log("deleteSkills", userId, profileUserId, id, tableName);
  try {
    const deleteQuery = `delete from ${tableName} where id = ${id}`;
    await db.execute(deleteQuery);
    await loadUserProfile(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Skills update error!${error.message}`,
    });
  }
};
