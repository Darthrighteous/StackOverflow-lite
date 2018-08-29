import express from 'express';
import routes from './routes';

const app = express();
app.use(express.json());

app.use('/', routes);

// PORT declaration
const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});