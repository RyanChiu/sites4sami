CREATE TABLE `news` (
  `id` int NOT NULL AUTO_INCREMENT,
  `content` text,
  `timeonair` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);
insert into news (content) value ("Design your news, please");
insert into news values (-1, "Design your alert, please", now());
