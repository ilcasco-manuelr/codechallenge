// server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Middleware load users
const loadUsers = (req, res, next) => {
  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error Reading File:', err);
      return res.status(500).json({ error: 'Error getting user data' });
    }

    req.users = JSON.parse(data);
    next();
  });
};

// Find user by username
const findUserByUsername = (username, users) => {
  return users.find((u) => u.user.toLowerCase() === username.toLowerCase());
};

// Get client information
app.get('/api/client', loadUsers, (req, res) => {
  const username = req.ip;
  const user = findUserByUsername(username, req.users);

  if (!user) {
    const newUser = { user: username, Favorites: [] };
    req.users.push(newUser);

    fs.writeFile('data.json', JSON.stringify(req.users), 'utf8', (err) => {
      if (err) {
        console.error('Error Writing File:', err);
        return res.status(500).json({ error: 'Error updating user data' });
      }
      res.json(newUser);
    });
  } else {
    res.json(user);
  }
});


app.get('/api/users/:username', loadUsers, (req, res) => {
  const { username } = req.params;
  const user = findUserByUsername(username, req.users);

  if (!user) {
    return res.status(404).json({ error: 'User Not Found' });
  }

  res.json(user);
});

app.put('/api/users/:username', loadUsers, (req, res) => {
  const { username } = req.params;
  const newFavorites = req.body.Favorites;

  const user = findUserByUsername(username, req.users);

  if (!user) {
    return res.status(404).json({ error: 'User Not Found' });
  }

  user.Favorites = newFavorites;

  fs.writeFile('data.json', JSON.stringify(req.users), 'utf8', (err) => {
    if (err) {
      console.error('Error Writing File:', err);
      return res.status(500).json({ error: 'Error updating user data' });
    }
    res.json({ message: 'User data updated successfully', user });
  });
});

app.listen(PORT, () => {
  console.log(`Listen Server on port ${PORT}`);
});
