CREATE DATABASE qutmslogin;
use qutmslogin;

"CREATE TABLE IF NOT EXISTS Users (ID INT NOT NULL AUTO_INCREMENT, " +
                "Username VARCHAR(20) NOT NULL, Hash CHAR(128) NOT NULL, Salt CHAR(18) NOT NULL," +
                "Permissions TINYINT NOT NULL, PRIMARY KEY (ID),UNIQUE (Username))"

-- https://roytuts.com/docker-compose-dockerizing-flask-mysql-app/
-- CREATE TABLE `user` (
--   `id` int unsigned NOT NULL AUTO_INCREMENT,
--   `name` varchar(50) NOT NULL,
--   `email` varchar(100) NOT NULL,
--   `phone` int unsigned NOT NULL,
--   `address` varchar(250) NOT NULL,
--   PRIMARY KEY (`id`)
-- ) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;