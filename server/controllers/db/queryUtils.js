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
// const connectionString = 'postgres://mznpvudk:xrMV5SGVt4dwHQZ0OJbxKDAsfRLFyu8W@horton.elephantsql.com:5432/mznpvudk';
export const db = pgp(connectionString);
const pool = new Pool({
  // connectionString: process.env.DATABASE_URL,
  connectionString,
});

/**
*
*/
export const initTables = () => {
  let queryText;
  if (process.env.NODE_ENV === 'production') {
    queryText = `CREATE TABLE IF NOT EXISTS
    questions (
      id serial PRIMARY KEY,
      title VARCHAR NOT NULL,
      body VARCHAR,
      date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      username VARCHAR (30) NOT NULL,
      score INTEGER DEFAULT 0,
      answer_count INTEGER DEFAULT 0,
      accepted_answer INTEGER DEFAULT -1);

    INSERT INTO
    questions (title, body, username)
      VALUES
      ('question 1','body 1','user1'),
      ('question 2','body 2','user2'),
      ('question 3','body 3','user3'),
      ('question 4','body 4','user4'),
      ('question 5','body 5','user5'),
      ('question 6','body 6','user6');

    CREATE TABLE IF NOT EXISTS 
    answers (
      id serial PRIMARY KEY,
      body VARCHAR,
      date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      username VARCHAR (30) NOT NULL,
      accepted BOOLEAN DEFAULT FALSE,
      score INTEGER DEFAULT 0,
      question_id INTEGER DEFAULT -1);

    INSERT INTO
      answers (body, username, question_id)
      VALUES
      ('body 1','user1', 1),
      ('body 2','user2', 2),
      ('body 3','user3', 3),
      ('body 4','user4', 4),
      ('body 5','user5', 5),
      ('body 6','user6', 6);

    CREATE TABLE IF NOT EXISTS users (
      id serial PRIMARY KEY,
      firstname VARCHAR,
      lastname VARCHAR,
      email VARCHAR,
      username VARCHAR (30) NOT NULL,
      password VARCHAR (60) NOT NULL)`;
  } else {
    queryText = `
      DROP TABLE 
    IF EXISTS questions;

    CREATE TABLE questions (
      id serial PRIMARY KEY,
      title VARCHAR NOT NULL,
      body VARCHAR,
      date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      username VARCHAR (30) NOT NULL,
      score INTEGER DEFAULT 0,
      answer_count INTEGER DEFAULT 0,
      accepted_answer INTEGER DEFAULT -1);

    INSERT INTO
    questions (title, body, username)
    VALUES
    ('question 1','body 1','user1'),
    ('question 2','body 2','user2'),
    ('question 3','body 3','user3'),
    ('question 4','body 4','user4'),
    ('question 5','body 5','user5'),
    ('question 6','body 6','user6');

    DROP TABLE 
    IF EXISTS answers;

    CREATE TABLE answers (
      id serial PRIMARY KEY,
      body VARCHAR,
      date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      username VARCHAR (30) NOT NULL,
      accepted BOOLEAN DEFAULT FALSE,
      score INTEGER DEFAULT 0,
      question_id INTEGER DEFAULT -1);

    INSERT INTO
    answers (body, username, question_id)
    VALUES
    ('body 1','user1', 1),
    ('body 2','user2', 2),
    ('body 3','user3', 3),
    ('body 4','user4', 4),
    ('body 5','user5', 5),
    ('body 6','user6', 6);
    
    DROP TABLE 
    IF EXISTS users;

    CREATE TABLE users (
      id serial PRIMARY KEY,
      firstname VARCHAR,
      lastname VARCHAR,
      email VARCHAR,
      username VARCHAR (30) NOT NULL,
      password VARCHAR (60) NOT NULL)`;
  }

  pool.query(queryText)
    .then((res) => {
      // console.log(res);
      pool.end();
    })
    .catch((err) => {
      // console.log(err);
      pool.end();
    });
};

initTables();

/**
 * validates the body of a question(POST).
 * @param {object} post - The input body from a POST question route.
 * @returns {object} Joi.validate output
*/
export const validateQuestionBody = (post) => {
  if (typeof post.title === 'undefined') {
    return 'must provide title';
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
    return 'must provide body';
  }
  const validBody = typeof post.body === 'string' && post.body.trim() !== '';
  if (!validBody) {
    return 'Body must be a non-empty string';
  }
  return null;
};
