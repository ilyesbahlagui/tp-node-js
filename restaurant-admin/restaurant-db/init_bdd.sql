create table dish (
  id int(11) not null primary key auto_increment,
  name varchar(100) not null unique,
  price int(7) not null
);
insert into dish (id, name, price) values (1, 'Magret de canard', 1300);
insert into dish (id, name, price) values (2, 'Moules-frites', 1300);
insert into dish (id, name, price) values (3, 'Couscous', 1600);
insert into dish (id, name, price) values (4, 'Blanquette de veau', 1500);
insert into dish (id, name, price) values (5, 'Côte de boeuf', 1100);
insert into dish (id, name, price) values (6, 'Gigot d''agneau', 2500);
