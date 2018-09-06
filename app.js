import express from 'express';
import cors from 'cors';
import routes from './server/routes';

const app = express();
app.use(express.json());

app.use(cors());

app.use(express.static('ui'));

app.use('/', routes);

// PORT declaration
const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
