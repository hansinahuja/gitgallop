# GitGallop

A practice full-stack MERN project. Add friends on Github and view their activity, repositories, user stats, etc.

To set up and run the backend, first set the configurations in `server/config.json`. You would need to set up a Github OAuth app to serve >100 requests an hour and get the client ID and secret. Set the callback URL to `${apiURL}/auth/callback`. Then from the home directory, run:

```
cd server
npm install
node index.js
```

To set up and run the frontend, set up the configurations in `client/src/config.json` and then from the home directory, run:
```
cd client
npm install
npm start
```

You can find a short demo video [here.](https://drive.google.com/file/d/1fSYrIw6GnuX9fRxonYJViBmLtXTaxi4k/view?usp=sharing)

Let me know if you find any bugs!
