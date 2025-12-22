import express from 'express'; //loads the express framework so i can build an HTTP server
import mongoose from 'mongoose';
import enrollmentsRouter from './routes/enrollments.js';

try {
    await mongoose.connect(process.env.MONGDB_URI || 'mongodb://localhost:27017/schoolDB');
    console.log('Mongo connected');
} catch (error) {
    console.error('Mongo connection error:', error);
    process.exit(1);
}
//Database or connection errors




const app = express();
app.use(express.json()); //reads the JSON request body and turns it into a JavaScript object

//logger middleware
app.use((req, res, next)=>{
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});

app.get('/health', (req, res)=>
    res.json({status:'ok'})
);

app.use('/enrollments', enrollmentsRouter);//mounting the router at /enrollments-- prefixes all its routes

app.use((err, req, res, next)=>{
    console.error(err);
    res.status(500).json({error: 'Server error'});
});

const PORT = process.env.PORT || 3000; //picking the port number the server listens on

app.listen(PORT, ()=> 
    console.log(`Server running on http://localhost: ${PORT}`)
);