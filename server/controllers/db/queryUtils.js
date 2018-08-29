import promise from 'bluebird';
import pgpmodule from 'pg-promise';

const options = {
  // Initialization Options
  promiseLib: promise,
};
const pgp = pgpmodule(options);

const connectionString = 'postgres://Admin:a@localhost:5432/Stackoverflow-lite';
export const db = pgp(connectionString);
