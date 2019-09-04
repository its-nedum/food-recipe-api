const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Recipe = require('./models/recipe');

const app = express();

//MongDB
mongoose.connect('mongodb+srv://admin:admin@cluster0-gp2tx.mongodb.net/test?retryWrites=true&w=majority',{ useNewUrlParser: true })
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB Atlas!');
    console.error(error);
  });

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-Width, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//body parser middleware
app.use(bodyParser.json());


//Adds a new recipe to the database
app.post('/api/recipes', (req,res,next) => {
    const recipe = new Recipe({
      title: req.body.title,
      ingredients: req.body.ingredients,
      instructions: req.body.instructions,
      difficulty: req.body.difficulty,
      time: req.body.time,
    });
    recipe.save().then(
      () => {
        res.status(201).json({
          message: 'Recipe saved successfully!'
        });
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    )
});

//Returns the recipe with the provided ID from the database
app.get('/api/recipes/:id', (req, res, next) => {
  Recipe.findOne({
    _id: req.params.id
  }).then(
    (recipe) => {
      res.status(200).json(recipe);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
});

//Modifies the recipe with the provided ID
app.put('/api/recipes/:id', (req, res, next) => {
  const recipe = new Recipe({
    _id: req.params.id,
    title: req.body.title,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    difficulty: req.body.difficulty,
    time: req.body.time
  });
  Recipe.updateOne({_id: req.params.id}, recipe).then(
    () => {
      res.status(201).json({
        message: 'Recipe updated successfully!'
      })
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
});

//Deletes the recipe with the provided ID
app.delete('/api/recipes/:id', (req, res, next) => {
  Recipe.deleteOne({_id: req.params.id}).then(
    () => {
      res.status(200).json({
        message: 'Deleted!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
});

//Return all the recipe from database
app.use('/api/recipes', (req,res,next) => {
  Recipe.find().then(
    (recipe) => {
      res.status(200).json(recipe);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  )
});


module.exports = app;