'use strict';

const express = require('express');
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');
const { User } = require('../models');

// Construct a router instance.
const router = express.Router();


router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
    const user = req.currentUser;
    
    //The authenticateUser middleware function will set the currentUser property on the Request 
    //object if and only if the request is successfully authenticated. 
    //We can use the currentUser property with confidence because our inline route handler 
    //function will never be called if the request doesn't successfully authenticate.
     
    res.json({
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress
      });
      res.status(200);
      res.end();
  }));

  // Route that creates a new user.
router.post('/users', asyncHandler(async (req, res) => {
    console.log(req.body);
    try {
      await User.create(req.body);
      res.status(201).json({ "message": "Account successfully created!" });
    } catch (error) {
      /* If any of these required values are not properly submitted, the application should respond by 
        sending a 400 HTTP status code and validation errors.*/
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const errors = error.errors.map(err => err.message);
        res.status(400).json({ errors }); 
        console.log("404 ERROS FROM ROUTES.JS")  
      } else {
        throw error;
      }
    }
  }));

module.exports = router;