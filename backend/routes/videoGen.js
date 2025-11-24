const express=require("express");
const router=express.Router();
const mongoose=require("mongoose");




router.post('/', async(req,res)=>{
    const {title, content, description}=req.body;
    
})