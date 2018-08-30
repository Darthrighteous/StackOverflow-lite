import pgp from 'pg-promise';
import path from 'path';

const { QueryFile } = pgp;

/**
*
*/
const sql = (file) => {
  const fullPath = path.join(__dirname, file);

  const qf = new QueryFile(fullPath, { minify: true });

  if (qf.error) {
    console.error(qf.error);
  }

  return qf;
};


export const questions = {
  create: sql('questions/create.sql'),
  seed: sql('questions/seed.sql'),
  drop: sql('questions/drop.sql'),
};

export const answers = {
  create: sql('answers/create.sql'),
  seed: sql('answers/seed.sql'),
  drop: sql('answers/drop.sql'),
};

export const users = {
  create: sql('users/create.sql'),
  seed: sql('users/seed.sql'),
  drop: sql('users/drop.sql'),
};
