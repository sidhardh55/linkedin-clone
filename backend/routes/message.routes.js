import { Router } from "express";
import { sendMessage, getConversation, getChatUsers } from "../controllers/message.controller.js";

const router = Router();

router.route("/user/send_message").post(sendMessage);
router.route("/user/get_messages").get(getConversation);
router.route("/user/get_chat_users").get(getChatUsers);

export default router;
