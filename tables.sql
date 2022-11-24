create table treatment(
    id serial primary key not null,
    type text not null,
    code text not null,
    price decimal not null
);
create table stylist(
    id serial primary key not null,
    first_name text not null,
    last_name text not null,
    phone_number text not null,
    commission_percentage numeric(3,2) not null
);
create table booking(
    id serial primary key not null,
    booking_date date not null,
    booking_time time not null,
    client_id int not null,
    treatment_id int not null,
    stylist_id int not null,
    foreign key (client_id) references client(id), 
    foreign key (treatment_id) references treatment(id), 
    foreign key (stylist_id) references stylist(id) 
)

insert into client(first_name,last_name,phone_number) values('Tintswalo','Ngobeni','0792516711');
insert into client(first_name,last_name,phone_number) values('Thanyani','Mudau','0726541234');
insert into client(first_name,last_name,phone_number) values('Nhluvuko','Gaza','0812761212');
insert into client(first_name,last_name,phone_number) values('Lucy','Ndou','0691905454');
insert into client(first_name,last_name,phone_number) values('Dzunisani','Ngove','0820701111');
insert into client(first_name,last_name,phone_number) values('Khathu','Manaka','0817876432');
insert into client(first_name,last_name,phone_number) values('Rhandzu','Mabasa','0710991234');

insert into treatment(type,code,price) values('Pedicure','P01',175.00);
insert into treatment(type,code,price) values('Manicure','M02',215.00);
insert into treatment(type,code,price) values('Make up','M03',185.00);
insert into treatment(type,code,price) values('Brows & Lashes','B04',240.00);

insert into stylist(first_name,last_name,phone_number,commission_percentage) values('Lefa','Muapi','0791110911',0.11);
insert into stylist(first_name,last_name,phone_number,commission_percentage) values('Buhle','Zulu','0671231342',0.15);
insert into stylist(first_name,last_name,phone_number,commission_percentage) values('Nthabi','Lekota','0817878111',0.17);
insert into stylist(first_name,last_name,phone_number,commission_percentage) values('Hlulani','Khoza','0720701211',0.20);
