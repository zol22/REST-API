'use strict';

const express = require('express');
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');
const { Course, User } = require('../models');

// Construct a router instance.
const router = express.Router();


/* /api/courses GET route that will return a list of all courses including the User that owns each course and a 200 HTTP status code. */
router.get('/courses',asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: {
        model: User,
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
      },
    });
    if (courses){
         res.status(200).json(courses);
    } else {
        res.status(400).json({message: "No courses were found!"})
    }
   
  })
);

/* A /api/courses/:id GET route that will return the corresponding course along with the User that owns that course and a 200 HTTP status code. */
router.get('/courses/:id',asyncHandler(async (req, res) => {
    const id = req.params.id;
    const course = await Course.findByPk(id, {
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: {
        model: User,
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
      },
    });

    if (course) {
      res.status(200).json(course);
    } else {
      res.status(404).json({ message: `Course ${req.params.id} not found.` });
    }
  })
);

/* A /api/courses POST route that will create a new course, set the Location header to the URI for the newly created course, and return a 201 HTTP status code and no content. */
router.post('/courses',authenticateUser,asyncHandler(async (req, res) => {
    try {
      const newCourse = await Course.create(req.body);
      res.location(`/api/courses/${newCourse.id}`).status(201).end();
    } catch (error) {
        /* If any of these required values are not properly submitted, the application should respond by 
        sending a 400 HTTP status code and validation errors.*/
        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map((err) => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
      }
    }
  })
);

/* A /api/courses/:id PUT route that will update the corresponding course and return a 204 HTTP status code and no content.*/
router.put('/courses/:id',authenticateUser, asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    console.log(course);
    if (!course) {
      res.status(404).json({ message: `Course ${req.params.id} not found.` });
    } else if (course.userId !== req.currentUser.id) {
        console.log("Course userId is: "+ course.userId+ "  req.currentUser.id is: "+ req.currentUser.id)
        res.status(403).json({
        message: `User ${req.currentUser.id} is not the owner of course ${course.id}`,
      });
    } else {
      try {
        await course.update(req.body);
        res.status(204).end();
      } catch (error) {
        /* If any of these required values are not properly submitted, the application should respond by 
        sending a 400 HTTP status code and validation errors.*/
        if (error.name === 'SequelizeValidationError') {
          const errors = error.errors.map((err) => err.message);
          res.status(400).json({ errors });
        } else {
          throw error;
        }
      }
    }
  })
);

/* A /api/courses/:id DELETE route that will delete the corresponding course and return a 204 HTTP status code and no content. */
router.delete('/courses/:id',authenticateUser,asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
      res.status(404).json({ message: `Course ${req.params.id} not found.` });
    } else if (course.userId !== req.currentUser.id) {
      res.status(403).json({
        message: `User ${req.currentUser.id} is not the owner of course ${course.id}`,
      });
    } else {
      await course.destroy();
      res.status(204).end();
    }
  })
);

module.exports = router;