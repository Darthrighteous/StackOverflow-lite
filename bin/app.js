import express from 'express';
import path from 'path';
import cors from 'cors';
import routes from '../server/routes';

const app = express();
app.use(express.json());

app.use(cors());

app.use(express.static(path.join(__dirname, '../client')));

app.use('/api/v1', routes);

app.use('/pages', express.static(path.join(__dirname, '../../ui')));

// PORT declaration
const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is listening on ${PORT}`);
});
