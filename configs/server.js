'use strict';
import express from 'express'
import cors from 'cors'
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import limiter from '../src/middlewares/validate-cant-request.js';
import categoryRoutes from '../src/categories/category.routes.js'
import publicationRoutes from '../src/publications/publication.routes.js'
import commentRoutes from '../src/comments/comment.routes.js'
import { createCategory } from '../src/categories/category.controller.js';


const middlewares = (app) =>{
    app.use(express.urlencoded({extended: false}));
    app.use(express.json());

    app.use(helmet());
    app.use(cors({
        origin: 'http://localhost:5173', // Allow your Vite dev server
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }));
    app.use(morgan('dev'));
    app.use(limiter);
}

const routes = (app) =>{
    app.use('/reviewManager/v1/categories', categoryRoutes);
    app.use('/reviewManager/v1/publications', publicationRoutes);
    app.use('/reviewManager/v1/comments', commentRoutes);
}

const conectarDB = async() =>{
    
    try {
        await dbConnection();
        console.log('Successful connection to the database')
    } catch (error) {
        console.log('Failed to connect to database')
    }
}


export const initServer = async() =>{
    const app = express();
    const port = process.env.PORT || 3001;
    try {
     middlewares(app);
     conectarDB();
     await createCategory()
     routes(app);
     app.listen(port);
     console.log(`server running on port ${port}`)
    
 } catch (err) {
    console.log(`server init failed: ${err}`)
 }

}