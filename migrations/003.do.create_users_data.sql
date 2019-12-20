DROP TABLE IF EXISTS users_data;

CREATE TABLE users_data(
 id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
 first_name TEXT NOT NULL,
 last_name TEXT NOT NULL,
 dob DATE NOT NULL,
 relationship TEXT NOT NULL,
 profession TEXT,
 hobbies TEXT,
 cuisine TEXT,
 dessert TEXT,
 nonalc_beverage TEXT,
 alc_beverage TEXT,
 color TEXT,
 flowers TEXT,
 movies TEXT,
 books TEXT,
 tv_shows TEXT,
 music TEXT,
 sportgames TEXT,
 brands TEXT,
 humour TEXT,
 dreams TEXT,
 fears TEXT,
 chat_topics TEXT,
 no_topics TEXT,
 inspirations TEXT,
 other TEXT,
 userid INTEGER REFERENCES users(id) ON DELETE CASCADE
)