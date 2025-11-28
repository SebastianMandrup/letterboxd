import express from 'express';
import authRouter from '../routes/authRouter';
import movieRouter from '../routes/movieRouter';
import reviewRouter from '../routes/reviewRouter';
import userRouter from '../routes/userRouter';
import viewRouter from '../routes/viewRouter';
import listRouter from '../routes/listRouter';

const setupRouters = (app: express.Application) => {
  app.use('/movies', movieRouter);
  app.use('/reviews', reviewRouter);
  app.use('/users', userRouter);
  app.use('/views', viewRouter);
  app.use('/auth', authRouter);
  app.use('/lists', listRouter);
};

export default setupRouters;
