CREATE TABLE questionss
(
    id serial PRIMARY KEY,
    title VARCHAR NOT NULL,
    body VARCHAR,
    date TIMESTAMP,
    username VARCHAR (30) NOT NULL,
    score INTEGER DEFAULT 0,
    answer_count INTEGER DEFAULT 0,
    accepted_answer INTEGER DEFAULT -1,
);