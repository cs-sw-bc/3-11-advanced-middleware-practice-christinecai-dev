import {Router} from 'express';
import mongoose from 'mongoose';

import Enrollment from '../models/enrollments.js';

const router = Router();

//GET /enrollments- fetch all records

router.get('/', async (req, res, next)=>{
    try{
        const enrollments = await Enrollment.find();
        res.json(enrollments);
    }catch(err){
        next(err);
    }
});

router.get('/:id', async(req, res, next)=>{
    try{
        if (!mongoose.Types.ObjectId.isValid(req.params.id)){
            return res.status(400).json({error: 'Invalid enrollment ID format'});
        }//Invalid enrollment ID format
        const enrollment = await Enrollment.findById(req.params.id);
        if (!enrollment) return res.status(404).json({error: 'Enrollment not found'}); //database lookup didn't find an enrollment (it returned null)
        //Requesting an enrollment ID that does not exist
        res.json(enrollment);
    }catch(err){
        next(err);
    }
});

export default router;