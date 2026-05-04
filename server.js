const express = require('express');
const path    = require('path');

const app  = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

let submissions = [];

app.get('/', (req, res) => {
  res.render('index', {
    title:       'User Registration',
    submissions: submissions,
    message:     null,
  });
});

app.post('/submit', (req, res) => {
  const { name, email, role, bio } = req.body;

  if (!name || !email) {
    return res.render('index', {
      title:       'User Registration',
      submissions: submissions,
      message:     { type: 'error', text: 'Name and Email are required.' },
    });
  }

  const newEntry = {
    id:        submissions.length + 1,
    name:      name.trim(),
    email:     email.trim().toLowerCase(),
    role:      role || 'Member',
    bio:       bio ? bio.trim() : 'No bio provided.',
    createdAt: new Date().toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }),
  };

  submissions.unshift(newEntry);

  res.render('index', {
    title:       'User Registration',
    submissions: submissions,
    message:     { type: 'success', text: `Welcome aboard, ${newEntry.name}!` },
  });
});

app.post('/clear', (req, res) => {
  submissions = [];
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server running at http://localhost:${PORT}\n`);
});