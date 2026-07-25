import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const sendMessage = async (req, res) => {
    try {
        const { token, receiverId, message } = req.body;

        if (!token || !receiverId || !message) {
            return res.status(400).json({ message: "Token, receiverId, and message are required" });
        }

        const sender = await User.findOne({ token });
        if (!sender) {
            return res.status(404).json({ message: "Sender user not found" });
        }

        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return res.status(404).json({ message: "Receiver user not found" });
        }

        const newMessage = new Message({
            senderId: sender._id,
            receiverId: receiver._id,
            message: message.trim()
        });

        await newMessage.save();

        return res.status(201).json({ message: "Message sent successfully", data: newMessage });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const getConversation = async (req, res) => {
    try {
        const token = req.query.token || req.body.token;
        const receiverId = req.query.receiverId || req.body.receiverId;

        if (!token || !receiverId) {
            return res.status(400).json({ message: "Token and receiverId are required" });
        }

        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const messages = await Message.find({
            $or: [
                { senderId: user._id, receiverId: receiverId },
                { senderId: receiverId, receiverId: user._id }
            ]
        }).sort({ createdAt: 1 });

        return res.json({ messages });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const getChatUsers = async (req, res) => {
    try {
        const token = req.query.token || req.body.token;

        if (!token) {
            return res.status(400).json({ message: "Token is required" });
        }

        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Get all users with whom current user has sent or received messages
        const sentMessages = await Message.find({ senderId: user._id }).distinct('receiverId');
        const receivedMessages = await Message.find({ receiverId: user._id }).distinct('senderId');

        const allUserIds = Array.from(new Set([...sentMessages.map(id => id.toString()), ...receivedMessages.map(id => id.toString())]));

        const chatUsers = await User.find({ _id: { $in: allUserIds } }).select('name username email profilePicture');

        return res.json({ chatUsers });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
