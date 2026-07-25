import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import PDFDocument from 'pdfkit';
import fs from "fs";
import ConnectionRequest from "../models/connections.model.js";

const convertUserDataTOPDF = async (userData) => {
    const doc = new PDFDocument();

    const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
    if (!fs.existsSync("uploads")) {
        fs.mkdirSync("uploads");
    }
    const stream = fs.createWriteStream("uploads/" + outputPath);

    doc.pipe(stream);

    if (userData.userId?.profilePicture && fs.existsSync(`uploads/${userData.userId.profilePicture}`)) {
        try {
            doc.image(`uploads/${userData.userId.profilePicture}`, { align: "center", width: 100 });
        } catch (e) {
            console.log("Could not embed profile picture in PDF:", e.message);
        }
    }

    doc.fontSize(18).text(`Name: ${userData.userId?.name || ''}`);
    doc.fontSize(14).text(`Username: ${userData.userId?.username || ''}`);
    doc.fontSize(14).text(`Email: ${userData.userId?.email || ''}`);
    doc.fontSize(14).text(`Bio: ${userData.bio || 'N/A'}`);
    doc.fontSize(14).text(`Current Position: ${userData.currentPost || 'N/A'}\n\n`);

    doc.fontSize(16).text("Work Experience:\n");
    if (userData.pastWork && userData.pastWork.length > 0) {
        userData.pastWork.forEach((work, index) => {
            doc.fontSize(12).text(`Company: ${work.company}`);
            doc.fontSize(12).text(`Position: ${work.position}`);
            doc.fontSize(12).text(`Years: ${work.years}\n`);
        });
    } else {
        doc.fontSize(12).text("No work experience listed.\n");
    }

    doc.fontSize(16).text("Education:\n");
    if (userData.education && userData.education.length > 0) {
        userData.education.forEach((edu, index) => {
            doc.fontSize(12).text(`School: ${edu.school}`);
            doc.fontSize(12).text(`Degree: ${edu.degree}`);
            doc.fontSize(12).text(`Field of Study: ${edu.fieldOfStudy}\n`);
        });
    } else {
        doc.fontSize(12).text("No education listed.\n");
    }

    doc.end();

    return outputPath;
}

export const register = async (req, res) => {
    try{

        const { name, email, password, username} = req.body;

        if(!name || !email || !password || !username)  return res.status(400).json({message:"All fields required"})
        
        const user = await User.findOne({ email });

        if(user)  return res.status(400).json({message:"User already exists"})

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            username
        });

        await newUser.save();
        
        const profile = new Profile({  userId: newUser._id });
        
        await profile.save();
        return res.json({message:"user created"});
        
    }catch(err){
        return res.status(400).json({message:err.message})
    }

}

export const login = async (req, res) => {
    try{
        const { email, password } = req.body;


        if(!email || !password) return res.status(400).json({message:"All fields required"})

        const user = await User.findOne({ email });

        if(!user) return res.status(400).json({message:"Invalid credentials"})

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({message:"Invalid credentials"});

       const token = crypto.randomBytes(32).toString('hex'); 

       await User.updateOne({_id: user._id}, { token });
       
       return res.json({token});
       
    }catch(error){
         return res.status(400).json({message:error.message});
    }
}

export const uploadProfilePicture = async (req, res) => {
    const {token} = req.body;
    try{

        const user=await User.findOne({token:token});

        if(!user) {
            return res.status(400).json({message:" User not found"});
        }

        user.profilePicture = req.file ? req.file.filename : 'default.jpg';

        await user.save();

        return res.json({message:"Profile picture updated successfully", profilePicture: user.profilePicture});

    }catch(error){
        return res.status(400).json({message:error.message});
    }
}

export const updateUserProfile = async (req, res) => {

    try{

        const {token, ...newUserData} = req.body;

        const user = await User.findOne({ token : token});

        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        
        const {username,email} = newUserData;

        if(username || email) {
            const existingUser = await User.findOne({ 
                $and: [
                    { _id: { $ne: user._id } },
                    { $or: [{ username }, { email }] }
                ] 
            });

            if(existingUser){
                return res.status(400).json({message:"Username or email already taken"});
            }
        }

        Object.assign(user, newUserData);

        await user.save();

        return res.json({message:"User profile updated successfully"});
    }catch(error){
        return res.status(400).json({message:error.message});
    }
}

export const getUserAndProfile = async (req, res) => {
    
    try{
        const token = req.query.token || req.body.token;

        const user = await User.findOne({token: token});

        if(!user){
            return res.status(400).json({message:"User not found"});
        }

        let userProfile = await Profile.findOne({userId: user._id})
            .populate('userId', 'name username email profilePicture');

        if(!userProfile) {
            userProfile = new Profile({ userId: user._id });
            await userProfile.save();
            userProfile = await Profile.findOne({userId: user._id})
                .populate('userId', 'name username email profilePicture');
        }

        return res.json(userProfile);


    }catch(error){
        return res.status(400).json({message:error.message});
    }
}

export const updateProfileData = async (req,res) => {

    try {
        const {token,...newProfileData} = req.body;

        const userProfile = await User.findOne({token: token});

        if(!userProfile){
            return res.status(400).json({message:"User not found"});
        }

        let profile_to_update = await Profile.findOne({userId: userProfile._id});

        if(!profile_to_update) {
            profile_to_update = new Profile({ userId: userProfile._id });
        }

        Object.assign(profile_to_update,newProfileData);

        await profile_to_update.save();

        return res.json({message:"Profile updated successfully"});

    }catch(error){
        return res.status(400).json({message:error.message});
    }
}

export const getAllUserProfile = async (req,res) => {
    
    try{
        const profiles = await Profile.find().populate('userId','name username email profilePicture');

        return res.json({ profiles });

    }catch(error){
        return res.status(400).json({message:error.message});
    }
}

export const downloadProfile = async(req,res) =>{
    try {
        const user_id = req.query.id || req.body?.id;

        const userProfile = await Profile.findOne({userId : user_id})
        .populate('userId','name username email profilePicture');

        if(!userProfile) {
            return res.status(404).json({message: "Profile not found"});
        }

        let outputPath = await convertUserDataTOPDF(userProfile);

        return res.json({"message": outputPath });
    } catch(err) {
        return res.status(500).json({message: err.message});
    }
}

export const sendConnectionRequest = async (req,res) => {
    const {token , connectionId} = req.body;

    try{

        const user = await User.findOne({token});

        if(!user){
            return res.status(404).json({message :"User not found"})
        }

        const connectionUser = await User.findOne({_id:connectionId})

        if(!connectionUser){
            return res.status(404).json({message:"Connection user not found"})
        }

        const existingRequest = await ConnectionRequest.findOne({
            userId:user._id,
            connectionId:connectionUser._id
        });

        if(existingRequest){
            return res.status(400).json({message:"Request already sent"});
        }

        const request = new ConnectionRequest({
            userId:user._id,
            connectionId:connectionUser._id
        })

        await request.save();

        return res.json({message: "Request sent"});

    }catch(err){
        return res.status(500).json({message:err.message});
    }

}

export const getMyConnectionsRequests = async (req,res) =>{

    const token = req.query.token || req.body.token;
    try{

        const user = await User.findOne({ token })

        if(!user){
            return res.status(404).json({message:"User not found"})
        }

        const connections = await ConnectionRequest.find({ userId : user._id})
        .populate('connectionId','name username email profilePicture');
        
        return res.json({conections: connections})

    }catch(err){
        return res.status(500).json({message:err.message})
    }
}

export const whatAreMyConnections = async (req,res) =>{
    const token = req.query.token || req.body.token;
    
    try{
        const user = await User.findOne({token});
        
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        const connections = await ConnectionRequest.find({connectionId:user._id})
        .populate('userId','name username email profilePicture');

        return res.json(connections);


    }catch(err){
        return res.status(500).json({message:err.message})
    }
}

export const getUserProfileById = async (req, res) => {
    try {
        const userId = req.params.userId || req.query.userId;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const userProfile = await Profile.findOne({ userId })
            .populate('userId', 'name username email profilePicture');

        if (!userProfile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        return res.json(userProfile);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const acceptConnectionRequest = async(req,res) =>{
    const {token ,requestId,action_type} = req.body;
    try{
        const connection =await ConnectionRequest.findOne({_id:requestId});

        if(!connection){
            return res.status(404).json({message:"Connection not found"})
        }

        if(action_type ==="accept"){
            connection.status_accepted = true;
        }else{
            connection.status_accepted = false;
        }

        await connection.save();

        return  res.json({message: "Request Updated"});
    }catch(err){
        return res.status(500).json({message:err.message});
    }
}