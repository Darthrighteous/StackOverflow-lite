import dotenv from 'dotenv';

dotenv.config();

let queryText = '';
if (process.env.NODE_ENV !== 'production') {
  queryText += `
    DROP TABLE IF EXISTS comments;
    DROP TABLE IF EXISTS answers;
    DROP TABLE IF EXISTS questions;
    DROP TABLE IF EXISTS users;
  `;
}

queryText += `
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
    comment_count INTEGER DEFAULT 0,
    upvoted_answers INTEGER[] DEFAULT array[]::INTEGER[],
    downvoted_answers INTEGER[] DEFAULT array[]::INTEGER[],
    upvoted_questions INTEGER[] DEFAULT array[]::INTEGER[],
    downvoted_questions INTEGER[] DEFAULT array[]::INTEGER[]);

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
    comment_count INTEGER DEFAULT 0,
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
    score INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    accepted BOOLEAN DEFAULT FALSE);

  CREATE TABLE IF NOT EXISTS comments (
    id serial PRIMARY KEY,
    question_id INTEGER DEFAULT NULL
      REFERENCES questions(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    answer_id INTEGER DEFAULT NULL
      REFERENCES answers(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    body VARCHAR NOT NULL,
    username VARCHAR NOT NULL
      REFERENCES users(username)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP);

    CREATE OR REPLACE FUNCTION update_comment_count()
      RETURNS trigger
      LANGUAGE plpgsql
    AS
    $BODY$
    BEGIN
      IF TG_OP = 'INSERT' THEN
        UPDATE questions SET comment_count = comment_count + 1 WHERE id = NEW.question_id;
        UPDATE answers SET comment_count = comment_count + 1 WHERE id = NEW.answer_id;
        UPDATE users SET comment_count = comment_count + 1 WHERE username = NEW.username;
      ELSEIF TG_OP = 'DELETE' THEN
        UPDATE questions SET comment_count = comment_count - 1 WHERE id = OLD.question_id;
        UPDATE answers SET comment_count = comment_count - 1 WHERE id = OLD.answer_id;
        UPDATE users SET comment_count = comment_count - 1 WHERE username = OLD.username;
      END IF;
      RETURN NEW;
    END;
    $BODY$;

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

    CREATE TRIGGER answer_added
      AFTER INSERT OR DELETE
      ON comments
      FOR EACH ROW
      EXECUTE PROCEDURE update_comment_count();

    INSERT INTO questions (title, body, username)
      VALUES
      ('Question 1','Question body one', 'skerrigan'),
      ('Question 2','Question body two', 'dddark'),
      ('Question 3','Question body three', 'coachee');

    INSERT INTO answers (body, username, question_id, accepted, score)
      VALUES
      ('Answer body one', 'coachee', 1, false, 3),
      ('Answer body two', 'coachee', 2, false, 2),
      ('Answer body three', 'coachee', 1, true, 1),
      ('Answer body four', 'coachee', 1, false, 2);

    INSERT INTO comments (body, question_id, answer_id, username)
      VALUES
      ('this is a question comment body to question 1', '1', NULL, 'coachee'),
      ('this is an answer comment body to answer 1', NULL, '1', 'coachee');
    `;

const initQuery = queryText;
export default initQuery;
