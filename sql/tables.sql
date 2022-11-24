-- Table create scripts here
create table client(
    id serial primary key not null,
    first_name text not null,
    last_name text not null,
    phone_number text not null
);
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
    foreign key (client_id) references client(id) on delete cascade,
    foreign key (treatment_id) references treatment(id) on delete cascade,
    foreign key (stylist_id) references stylist(id) on delete cascade
)