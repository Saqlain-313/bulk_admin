import ImportUser from "../models/ImportUser.js";
import mongoose from "mongoose";

export const getImportUsersAnalysis = async (req, res) => {
  try {
    // ✅ 1. Fetch users with uploadedBy populated
    const users = await ImportUser.find()
      .populate("uploadedBy", "name") // 👈 direct name aa jayega
      .lean();

    // ✅ 2. Attach uploadedByName safely
    const usersWithName = users.map((u) => ({
      ...u,
      uploadedByName: u.uploadedBy?.name || "Unknown",
    }));

    // 🔍 3. Duplicate Logic (same as before)
    const mobileMap = {};
    const duplicates = [];
    const unique = [];

    usersWithName.forEach((user) => {
      if (mobileMap[user.mobile]) {
        mobileMap[user.mobile].push(user);
      } else {
        mobileMap[user.mobile] = [user];
      }
    });

    Object.values(mobileMap).forEach((group) => {
      if (group.length > 1) {
        duplicates.push(...group);
      } else {
        unique.push(group[0]);
      }
    });

    // ✅ 4. Final Response
    res.json({
      total: users.length,
      uniqueCount: unique.length,
      duplicateCount: duplicates.length,
      unique,
      duplicates,
      all: usersWithName,
    });
  } catch (error) {
    console.error("Error in getImportUsersAnalysis:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateImportUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, errorMessage } = req.body;

    const user = await ImportUser.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = status || user.status;
    user.errorMessage = errorMessage || null;

    if (status === "sent") {
      user.sentAt = new Date();
    }

    await user.save();

    res.json({ message: "Status updated", user });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const bulkUpdateStatus = async (req, res) => {
  try {
    const { ids, status } = req.body;

    // ✅ filter valid ObjectIds
    const validIds = ids.filter((id) =>
      mongoose.Types.ObjectId.isValid(id)
    );

    if (validIds.length === 0) {
      return res.status(400).json({ message: "No valid IDs provided" });
    }

    await ImportUser.updateMany(
      { _id: { $in: validIds } },
      {
        status,
        ...(status === "sent" && { sentAt: new Date() }),
      }
    );

    res.json({ message: "Bulk update successful" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};