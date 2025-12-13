import express from 'express';
import session from 'express-session';
import authRouter from '../routes/authRouter';
import userRouter from '../routes/userRouter';
import movieRouter from '../routes/movieRouter';
import reviewRouter from '../routes/reviewRouter';
import listRouter from '../routes/listRouter';

const app = express();
app.use(express.json());
app.use(
    session({
        secret: 'testsecret',
        resave: false,
        saveUninitialized: false,
    }),
);

app.use('/auth', authRouter);
app.use('/lists', listRouter);
app.use('/movies', movieRouter);
app.use('/reviews', reviewRouter);
app.use('/users', userRouter);

export default app;
