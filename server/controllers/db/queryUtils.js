import promise from 'bluebird';
import { Pool } from 'pg';
import pgpmodule from 'pg-promise';
import dotenv from 'dotenv';

dotenv.config();
const options = {
  // Initialization Options
  promiseLib: promise,
};
const pgp = pgpmodule(options);

const connectionString = process.env.DATABASE_URL;
export const db = pgp(connectionString);

const pool = new Pool({
  connectionString,
});

/**
*
*/
export const initTables = () => {
  let queryText;
  // if (process.env.NODE_ENV === 'production') {
  queryText = `
    DROP TABLE IF EXISTS answers;
    DROP TABLE IF EXISTS questions;
    DROP TABLE IF EXISTS users;

    CREATE TABLE IF NOT EXISTS users (
      id serial PRIMARY KEY,
      firstname VARCHAR,
      lastname VARCHAR, 
      joined_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      email VARCHAR NOT NULL,
      username VARCHAR (30) UNIQUE NOT NULL,
      password VARCHAR (60) NOT NULL,
      question_count INTEGER DEFAULT 0,
      answer_count INTEGER DEFAULT 0,
      comment_count INTEGER DEFAULT 0);

    INSERT INTO users (firstname, lastname, email, username, password)
      VALUES
      ('sarah', 'kerrigan', 's.kerrigan@yahoo.com', 'skerrigan', 'fakehash'),
      ('damian', 'dark', 'dark.knight@gmail.com', 'dddark', 'fakehash'),
      ('julen', 'lopetegui', 'jlope@madrid.com', 'coachee', 'fakehash');

    CREATE TABLE IF NOT EXISTS questions (
      id serial PRIMARY KEY,
      title VARCHAR NOT NULL,
      body VARCHAR,
      username VARCHAR NOT NULL
        REFERENCES users(username)
          ON UPDATE CASCADE
          ON DELETE CASCADE,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      score INTEGER DEFAULT 0,
      answer_count INTEGER DEFAULT 0,
      accepted_answer INTEGER DEFAULT NULL);


    CREATE TABLE IF NOT EXISTS answers (
      id serial PRIMARY KEY,
      question_id INTEGER NOT NULL
        REFERENCES questions(id)
          ON UPDATE CASCADE
          ON DELETE CASCADE,
      body VARCHAR NOT NULL,
      username VARCHAR NOT NULL
        REFERENCES users(username)
          ON UPDATE CASCADE
          ON DELETE CASCADE,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      accepted BOOLEAN DEFAULT FALSE,
      score INTEGER DEFAULT 0);
    

      CREATE OR REPLACE FUNCTION update_answer_count()
        RETURNS trigger
        LANGUAGE plpgsql
      AS
      $BODY$
      BEGIN
        IF TG_OP = 'INSERT' THEN
          UPDATE questions SET answer_count = answer_count + 1 WHERE id = NEW.question_id;
          UPDATE users SET answer_count = answer_count + 1 WHERE username = NEW.username;
        ELSEIF TG_OP = 'DELETE' THEN
          UPDATE questions SET answer_count = answer_count - 1 WHERE id = OLD.question_id;
          UPDATE users SET answer_count = answer_count - 1 WHERE username = OLD.username;
        END IF;
        RETURN NEW;
      END;
      $BODY$;

      CREATE OR REPLACE FUNCTION update_question_count()
        RETURNS trigger
        LANGUAGE plpgsql
      AS
      $BODY$
      BEGIN
        IF TG_OP = 'INSERT' THEN
          UPDATE users SET question_count = question_count + 1 WHERE username = NEW.username;
        ELSEIF TG_OP = 'DELETE' THEN
          UPDATE users SET question_count = question_count - 1 WHERE username = OLD.username;
        END IF;
        RETURN NEW;
      END;
      $BODY$;

      CREATE TRIGGER question_added
        AFTER INSERT OR DELETE
        ON questions
        FOR EACH ROW
        EXECUTE PROCEDURE update_question_count();

      CREATE TRIGGER answer_added
        AFTER INSERT OR DELETE
        ON answers
        FOR EACH ROW
        EXECUTE PROCEDURE update_answer_count();

      INSERT INTO questions (title, body, username)
        VALUES
        ('Question 1','Question body one', 'skerrigan'),
        ('Question 2','Question body two', 'dddark'),
        ('Question 3','Question body three', 'coachee');

      INSERT INTO answers (body, username, question_id)
        VALUES
        ('Answer body one', 'coachee', 1),
        ('Answer body two', 'coachee', 2),
        ('Answer body three', 'coachee', 1);
      `;
  // } else {
  //   queryText = ``;
  // }

  pool.query(queryText)
    .then((res) => {
      // console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

initTables();

/**
 * validates the body of a question(POST).
 * @param {object} post - The input body from a POST question route.
 * @returns {string} error message
*/
export const validateQuestionBody = (post) => {
  if (typeof post.title === 'undefined') {
    return 'Must provide title';
  }
  const validTitle = typeof post.title === 'string' && post.title.trim() !== '';
  if (!validTitle) {
    return 'Title must be a non-empty string';
  }
  if (typeof post.body !== 'undefined') {
    const validBody = typeof post.body === 'string';
    if (!validBody) {
      return 'Body must be a string';
    }
    return null;
  }
  return null;
};

/**
 * validates the body of an answer(POST).
 * @param {object} post - The input body from a POST answer route.
 * @returns {object} Joi.validate output
*/
export const validateAnswerBody = (post) => {
  if (typeof post.body === 'undefined') {
    return 'Must provide body';
  }
  const validBody = typeof post.body === 'string' && post.body.trim() !== '';
  if (!validBody) {
    return 'Body must be a non-empty string';
  }
  return null;
};

/**
* Validates the answer PATCH request body
* @param {object} reqBody - the request body
* @returns {string} error message
*/
export const validatePatchAnswerReqBody = (reqBody) => {
  if (typeof reqBody.type === 'undefined') {
    return 'Must provide update type';
  }
  const validUpdateTypes = ['accept', 'edit', 'upvote', 'downvote'];
  const index = validUpdateTypes.indexOf(reqBody.type);
  if (index === -1) {
    return 'Update type must be accept, edit, upvote or downvote';
  }
  if (index === 1) {
    return validateAnswerBody(reqBody);
  }
  return null;
};
