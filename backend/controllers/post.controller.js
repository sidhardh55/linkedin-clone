import User from "../models/user.model.js";
import Post from "../models/posts.model.js";
import Comment from "../models/comments.model.js";

export const activeCheck = async (req, res) => {
    return res.status(200).json({ message: "RUNNING" });
};

export const createPost = async (req, res) => {

    const token = req.body?.token || req.headers?.authorization || "";
    const bodyText = req.body?.body || req.body?.text || req.body?.message || req.body?.content || "";

    try {
        if (!token) {
            return res.status(400).json({ message: "Token is required" });
        }

        const user = await User.findOne({ token });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const post = new Post({
            userId: user._id,
            body: bodyText || "test-post",
            media: req.file ? req.file.filename : "",
            fileType: req.file ? req.file.mimetype.split("/")[1] : ""
        });

        await post.save(); 

        return res.status(200).json({ message: "Post created" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const getAllPosts = async (req,res) =>{
    try {

        const posts =await Post.find().sort({ createdAt: -1 }).populate('userId','name username email profilePicture')
        return res.json({ posts })

    }catch(err){
        return res.status(500).json({messege:err.messege})
    }
}


export const deletePost = async (req,res) =>{

    const {token,post_id} = req.body;

    try{
        const user = await User.findOne({token}).select("_id");

        if(!user){
            return res.status(404).json({messege:"User not found"});
        }

        const post = await Post.findOne({_id:post_id});

        if(!post){
            return res.status(404).json({messege:"Post not found"});
        }

        if(post.userId.toString() !== user._id.toString()){
            return res.status(401).json({messege : "Unauthorized"})
        }

        await Post.deleteOne({_id: post_id});
        
        return res.json({messege:"Post Deleted"})


    }catch(err){
        res.status(500).json({messege:err.message});
    }
}

export const commentPost = async (req,res) =>{
    
    const {token,post_id,commentBody} = req.body;

    try{
        const user = await User.findOne({token}).select("_id");

        if(!user){
            return res.status(404).json({messege: "User not found "});
        }

        const post =await Post.findOne({
            _id:post_id
        })

        if(!post){
            return res.status(404).json({messege: "Post not found "});
        }

        const comment = new Comment({
            userId : user._id,
            postId:post_id,
            body:commentBody
        });

        await comment.save();
        
        return res.status(200).json({messege:"Comment Added"});

    }catch(err){
        res.status(500).json({messege:err.message});
    }
}


export const get_comments_by_post = async(req,res) =>{
    const post_id = req.query.post_id || req.body?.post_id;

    try{
        const post = await Post.findOne({_id:post_id});

        if(!post){
            return res.status(404).json({messege: "Post not found "});
        }

        const comments = await Comment.find({ postId: post_id }).populate('userId', 'name username profilePicture');

        return res.json({comments})

    }catch(err){
        
        return res.status(500).json({messege:err.message});

    }
}

export const delete_comment_of_user = async(req,res)=>{
    const {token,comment_id} = req.body;

    try{
        const user = await User.findOne({token}).select("_id");

        if(!user){
            return res.status(404).json({messege: "User not found "});
        }

        const comment =  await Comment.findOne({_id:comment_id})

        if(!comment){
            return res.status(404).json({messege :"Comment not found "});
        }

        if(comment.userId.toString() !== user._id.toString()){
            return res.status(401).json({messege:"Unauthorized"});
        }
    
        await Comment.deleteOne({"_id":comment_id});

        return res.json({messege:"Comment Deleted"});

    }catch(err){
        return res.status(500).json({messege:err.message});
    }
}

export const increment_likes = async(req,res)=>{

    const {post_id} = req.body;

    try{
        
        const post =await Post.findOne({_id:post_id});
       
        if(!post){
            return res.status(404).json({messege: "Post not found "});
        }

        post.likes = post.likes + 1 ;        

        await post.save();

        return res.json({messege:"Likes Incremented"});

    }catch(err){
        res.status(500).json({messege:err.message});
    }
}