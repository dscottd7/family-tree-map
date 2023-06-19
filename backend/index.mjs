import * as people from './model.mjs';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const corsOptions = {
    origin: "http://localhost:3000" // frontend URI (ReactJS)
};
app.use(cors(corsOptions));

const app = express();
const port = process.env.PORT || 8080;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.join(__dirname, '/dist');
const HTML_FILE = path.join(DIST_DIR, 'index.html'); 

app.use(express.static(DIST_DIR));
app.use(express.json());

// return index.html for request at root
app.get('/', (req, res) => {
    res.sendFile(HTML_FILE);
});

// Convert database object to tree object with microservice
app.post('/convert', (req, res) => {
    const requestBody = req.body;
    people.convertPeople(requestBody)
        .then(convertedJSON => {
            res.status(200).json(convertedJSON);
        })
        .catch(error => {
            console.error(error);
            res.status(400).json({ Error: 'Request failed' })
            }
        );
});

// Read people from database using GET
app.get('/people', (req, res) => {
  people.findPeople()
        .then(person => {
            res.status(200).json(person);
        })
        .catch(error => {
            console.error(error);
            res.status(400).json({ Error: 'Request failed' });
        });
});

// Add person to database using POST
app.post('/person', (req, res) => {
  people.createPerson(
    req.body.name, 
    req.body.birthYear, 
    req.body.birthCity, 
    req.body.birthCountry,
    req.body.deathYear, 
    req.body.deathCity, 
    req.body.deathCountry, 
    req.body.fatherID, 
    req.body.motherID, 
    req.body.partnerID
    )
    .then(person => {
        res.status(201).json(person);
    })
    .catch(error => {
        console.error(error);
        res.status(400).json({ Error: 'Request failed' });
    });
});

/* Get using GET /person/:_id */
app.get('/person/:_id', (req, res) => {
  people.findPersonById(req.params._id)
      .then(person => { 
          if (person !== null) {
              res.json(person);
          } else {
              res.status(404).json({ Error: 'Not found' });
          }         
       })
      .catch(error => {
          res.status(400).json({ Error: 'Request failed' });
      });

});

/* Update person using PUT /person/:_id */
app.put('/person/:_id', (req, res) => {
  people.updatePerson(
      req.params._id,
      req.body.name, 
      req.body.birthYear, 
      req.body.birthCity, 
      req.body.birthCountry,
      req.body.deathYear,
      req.body.deathCity,
      req.body.deathCountry,
      req.body.fatherID,
      req.body.motherID,
      req.body.partnerID
      )
      .then(numUpdated => {
          if (numUpdated === 1) {
              res.json({ 
                  _id: req.params._id, 
                  name: req.body.name, 
                  birthYear: req.body.birthYear, 
                  birthCity: req.body.birthCity, 
                  birthCountry: req.body.birthCountry,
                  deathYear: req.body.deathYear,
                  deathCity: req.body.deathCity,
                  deathCountry: req.body.deathCountry,
                  fatherID: req.body.fatherID,
                  motherID: req.body.motherID,
                  partnerID: req.body.partnerID
              });
          } else {
              res.status(404).json({ Error: 'Not found' });
          }
      })
      .catch(error => {
          console.error(error);
          res.status(400).json({ Error: 'Request failed' });
      });
});

/* Delete using DELETE /person/:_id */
app.delete('/person/:_id', (req, res) => {
  people.deletePersonById(req.params._id)
      .then(deletedCount => {
          if (deletedCount === 1) {
              res.status(204).send();
          } else {
              res.status(404).json({ Error: 'Resource not found' });
          }
      })
      .catch(error => {
          console.error(error);
          res.status(400).json({ Error: 'Request failed' });
      });
});


app.listen(port, function () {
 console.log('App listening on port: ' + port);
});