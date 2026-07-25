import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import Post from "../models/posts.model.js";
import Comment from "../models/comments.model.js";
import ConnectionRequest from "../models/connections.model.js";
import Message from "../models/message.model.js";

import {
  SEED_PASSWORD,
  SEED_EMAIL_DOMAIN,
  users as seedUsers,
  posts as seedPosts,
  comments as seedComments,
  connections as seedConnections,
  messages as seedMessages,
} from "./seedData.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, "..", "uploads");
const isFresh = process.argv.includes("--fresh");

const daysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

const hoursAgo = (hours) => {
  const date = new Date();
  date.setHours(date.getHours() - hours);
  return date;
};

async function downloadAvatar(imgId, filename) {
  const filepath = path.join(uploadsDir, filename);
  if (fs.existsSync(filepath)) return filename;

  const url = `https://i.pravatar.cc/300?img=${imgId}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to download avatar ${imgId}`);

  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(filepath, buffer);
  return filename;
}

async function clearSeedData() {
  const seedUserDocs = await User.find({ email: { $regex: SEED_EMAIL_DOMAIN.replace(".", "\\.") + "$" } });
  const seedUserIds = seedUserDocs.map((u) => u._id);

  if (seedUserIds.length === 0) {
    console.log("No existing seed users to remove.");
    return;
  }

  const posts = await Post.find({ userId: { $in: seedUserIds } }).select("_id");
  const postIds = posts.map((p) => p._id);

  await Comment.deleteMany({ $or: [{ userId: { $in: seedUserIds } }, { postId: { $in: postIds } }] });
  await Post.deleteMany({ userId: { $in: seedUserIds } });
  await Message.deleteMany({
    $or: [{ senderId: { $in: seedUserIds } }, { receiverId: { $in: seedUserIds } }],
  });
  await ConnectionRequest.deleteMany({
    $or: [{ userId: { $in: seedUserIds } }, { connectionId: { $in: seedUserIds } }],
  });
  await Profile.deleteMany({ userId: { $in: seedUserIds } });
  await User.deleteMany({ _id: { $in: seedUserIds } });

  console.log(`Removed ${seedUserIds.length} seed users and related data.`);
}

async function seed() {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not set. Add it to backend/.env");
    process.exit(1);
  }

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB.");

  if (isFresh) {
    await clearSeedData();
  }

  const hashedPassword = await bcrypt.hash(SEED_PASSWORD, 10);
  const userMap = {};

  console.log("\nCreating users and profiles...");
  for (const seedUser of seedUsers) {
    let user = await User.findOne({ email: seedUser.email });

    if (user && !isFresh) {
      console.log(`  Skipping existing user: ${seedUser.username}`);
      userMap[seedUser.username] = user;
      continue;
    }

    const avatarFilename = `seed-${seedUser.username}.jpg`;
    await downloadAvatar(seedUser.avatarImg, avatarFilename);

    user = new User({
      name: seedUser.name,
      username: seedUser.username,
      email: seedUser.email,
      password: hashedPassword,
      profilePicture: avatarFilename,
    });
    await user.save();

    const profile = new Profile({
      userId: user._id,
      ...seedUser.profile,
    });
    await profile.save();

    userMap[seedUser.username] = user;
    console.log(`  Created: ${seedUser.name} (@${seedUser.username})`);
  }

  if (isFresh || (await Post.countDocuments()) === 0 || Object.keys(userMap).length === seedUsers.length) {
    console.log("\nCreating posts...");
    const postMap = {};

    for (const seedPost of seedPosts) {
      const author = userMap[seedPost.authorUsername];
      if (!author) continue;

      const existing = await Post.findOne({ userId: author._id, body: seedPost.body });
      if (existing && !isFresh) {
        postMap[`${seedPost.authorUsername}:${seedPost.body.slice(0, 40)}`] = existing;
        continue;
      }

      const post = new Post({
        userId: author._id,
        body: seedPost.body,
        likes: seedPost.likes,
        createdAt: daysAgo(seedPost.daysAgo),
        updatedAt: daysAgo(seedPost.daysAgo),
      });
      await post.save();
      postMap[`${seedPost.authorUsername}:${seedPost.body.slice(0, 40)}`] = post;
    }

    console.log("\nCreating comments...");
    for (const seedComment of seedComments) {
      const author = userMap[seedComment.authorUsername];
      const postAuthor = userMap[seedComment.postAuthorUsername];
      if (!author || !postAuthor) continue;

      const post = await Post.findOne({
        userId: postAuthor._id,
        body: { $regex: seedComment.postBodySnippet, $options: "i" },
      });
      if (!post) continue;

      const exists = await Comment.findOne({
        userId: author._id,
        postId: post._id,
        body: seedComment.body,
      });
      if (exists && !isFresh) continue;

      const comment = new Comment({
        userId: author._id,
        postId: post._id,
        body: seedComment.body,
      });
      await comment.save();
    }

    console.log("\nCreating connection requests...");
    for (const conn of seedConnections) {
      const fromUser = userMap[conn.fromUsername];
      const toUser = userMap[conn.toUsername];
      if (!fromUser || !toUser) continue;

      const exists = await ConnectionRequest.findOne({
        userId: fromUser._id,
        connectionId: toUser._id,
      });
      if (exists && !isFresh) continue;

      const statusMap = { accepted: true, pending: null, rejected: false };
      const request = new ConnectionRequest({
        userId: fromUser._id,
        connectionId: toUser._id,
        status_accepted: statusMap[conn.status],
      });
      await request.save();
    }

    console.log("\nCreating messages...");
    for (const msg of seedMessages) {
      const sender = userMap[msg.senderUsername];
      const receiver = userMap[msg.receiverUsername];
      if (!sender || !receiver) continue;

      const exists = await Message.findOne({
        senderId: sender._id,
        receiverId: receiver._id,
        message: msg.message,
      });
      if (exists && !isFresh) continue;

      const message = new Message({
        senderId: sender._id,
        receiverId: receiver._id,
        message: msg.message,
        createdAt: hoursAgo(msg.hoursAgo),
      });
      await message.save();
    }
  }

  console.log("\n✅ Seed complete!\n");
  console.log("Demo accounts (all use the same password):");
  console.log(`  Password: ${SEED_PASSWORD}\n`);
  seedUsers.slice(0, 5).forEach((u) => {
    console.log(`  • ${u.email}`);
  });
  console.log(`  ... and ${seedUsers.length - 5} more (@${SEED_EMAIL_DOMAIN.slice(1)})\n`);
  console.log("Re-run with --fresh to wipe and re-seed demo data only.");
  console.log("Your real accounts are never touched.\n");

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
