CREATE DATABASE qutmslogin;
use qutmslogin;

--created user login table
CREATE TABLE IF NOT EXISTS users (
  Userid INT(10) NOT NULL AUTO_INCREMENT,
  Username VARCHAR(20) NOT NULL,
  Pass VARCHAR(255) NOT NULL,
  CryptoSalt VARCHAR(24) NOT NULL, -- this will store the unique byte array called salt as we shouldn't transmit the plaintext pass over the network
  PRIMARY KEY(Userid),
  UNIQUE KEY(Username),
  UNIQUE KEY(Pass),
);


CREATE TABLE favorite_colors (
  name VARCHAR(20),
  color VARCHAR(10)
);

INSERT INTO favorite_colors
  (name, color)
VALUES
  ('Lancelot', 'blue'),
  ('Galahad', 'yellow');