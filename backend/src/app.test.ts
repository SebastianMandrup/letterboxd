import express from 'express';
import init from './startup/init.test';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

init(app);

export default app;
