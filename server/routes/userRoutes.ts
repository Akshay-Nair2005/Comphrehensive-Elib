import express from "express";
import { 
  updateUserBooks, 
  getAllUsers, 
  getUserById, 
  createUser, 
  updateUserHbooks, 
  deleteUserBooks, 
  usernamedesc,
  // deleteuser
} from "../controller/userController";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.put("/:id", updateUserBooks);
router.put("/:hid/hostedbooks", updateUserHbooks);
router.delete("/:id", deleteUserBooks); // ✅ Use DELETE for deletion
router.put("/:id/user",usernamedesc ); // ✅ Use DELETE for deletion
// router.post('/delete-user', deleteuser);

export default router;
