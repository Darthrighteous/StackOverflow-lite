import express from 'express';
import path from 'path';
import cors from 'cors';
import routes from '../server/routes';

const app = express();
app.use(express.json());

app.use(cors());

// api
app.use('/api/v1', routes);

// vanilla js pages
app.use('/pages', express.static(path.join(__dirname, '../../ui')));

// webpack compiled static files
app.use(express.static(path.join(__dirname, '../client')));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client', 'index.html'));
});

// PORT declaration
const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is listening on ${PORT}`);
});
