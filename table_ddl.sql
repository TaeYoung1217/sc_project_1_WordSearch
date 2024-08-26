CREATE DATABASE word_search;

-- answers definition

CREATE TABLE answers(
                id INTEGER PRIMARY KEY,
                answer TEXT UNIQUE NOT NULL);


-- records definition

CREATE TABLE records(
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                time TEXT NOT NULL);


-- users definition

CREATE TABLE users(
                id TEXT PRIMARY KEY,
                password TEXT NOT NULL
                );