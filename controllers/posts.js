const PostMessage = require('../models/postMessage.js');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;

exports.getPosts = async(req, res) => {

    const {page} = req.query;


  
  

    try{

        const LIMIT = 9;
        const startIndex = (Number(page) - 1) * LIMIT;

        const total = await PostMessage.countDocuments({});

        const posts = await PostMessage.find().sort({_id:-1}).limit(LIMIT).skip(startIndex);

        res.status(200).json({data:posts,currentPage:Number(page),numberOfPages:Math.ceil(total/LIMIT)});

    }
    catch(error){
        res.status(404).json({message:error.message});
    }

}

exports.getPost = async(req, res) => {
    const {id} = req.params;
    try{



        const post = await PostMessage.findById(id);

        // post not found with that id
        if(!post) return res.status(404).json({message:'No post with that id'});


        res.status(200).json(post);

    }
    catch(error){
        res.status(404).json({message:error.message});
    }

}



exports.getPostBySearch = async(req, res) => {
    const {searchQuery,tags} = req.query;
    try{
        const title = new RegExp(searchQuery,'i');
        const posts = await PostMessage.find({$or:[{title},{tags:{$in:tags.split(',')}}]});
        res.json({data:posts});
    }
    catch(error){
        res.status(404).json({message:error.message});
    }
}



exports.createPost = async(req, res) => {


   
   const {title,message,creator,tags} = req.body;
 
   




    try{
          const myCloud  = await cloudinary.uploader.upload(req.body.selectedFile,{folder:"memories"});

  
    console.log(myCloud);


        const newPost = new PostMessage({title,message, selectedFile:myCloud.secure_url,creator,tags});
        await newPost.save();

        res.status(201).json(newPost);
        
    }
    catch(error){
        res.status(409).json({message:error.message});
    }

    }


    // updatePost

    exports.updatePost = async(req, res) => {
        const {id:_id} = req.params;
        const post = req.body;
        if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id');
        const updatedPost = await PostMessage.findByIdAndUpdate(_id, {...post,_id},{new:true});
        res.json(updatedPost);
    }

    // deletePost

    exports.deletePost = async(req, res) => {
        const {id} = req.params;
        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id');
        await PostMessage.findByIdAndRemove(id);
        res.json({message:'Post deleted successfully'});
    }


    // likePost

    exports.likePost = async(req, res) => {
        const {id} = req.params;

        if(!req.userId) return res.json({message:'Unauthenticated'});


        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id');
        const post = await PostMessage.findById(id);


        const index = post.likes.findIndex((id) => id === String(req.userId));

        if(index === -1){
            // like the post
            post.likes.push(req.userId);
        }
        else{
            // dislike the post
            post.likes = post.likes.filter((id) => id !== String(req.userId));
        }



        const updatedPost = await PostMessage.findByIdAndUpdate(id, post,{new:true});
        res.json(updatedPost);
    }




