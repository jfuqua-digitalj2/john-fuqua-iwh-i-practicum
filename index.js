const express = require('express');
require('dotenv').config();
const axios = require('axios');

const app = express();
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));

const OBJECT = process.env.CUSTOM_OBJECT_TYPE;
const headers = {
  Authorization: `Bearer ${process.env.PRIVATE_APP_TOKEN}`,
  'Content-Type': 'application/json'
};

app.get('/', async (req, res) => {
  try {
    const url = `https://api.hubapi.com/crm/v3/objects/${OBJECT}?properties=name,species,bio`;
    const resp = await axios.get(url, { headers });
    res.render('homepage', {
      title: 'Homepage | Integrating With HubSpot I Practicum',
      records: resp.data.results
    });
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).send('Error fetching records');
  }
});

app.get('/update-cobj', (req, res) => {
  res.render('updates', {
    title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
  });
});

app.post('/update-cobj', async (req, res) => {
  try {
    const url = `https://api.hubapi.com/crm/v3/objects/${OBJECT}`;
    const body = { properties: {
      name: req.body.name,
      species: req.body.species,
      bio: req.body.bio
    }};
    await axios.post(url, body, { headers });
    res.redirect('/');
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).send('Error creating record');
  }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
