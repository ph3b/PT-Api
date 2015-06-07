create table Trainer(
	trainer_id int NOT NULL AUTO_INCREMENT,
	firstname varchar(50) NOT NULL,
	lastname varchar(50) NOT NULL,
	email varchar(100) NOT NULL,
	password varchar(100) NOT NULL,
	Primary key(trainer_id),
	unique (trainer_id, email)
);

create table Customer(
	customer_id int NOT NULL AUTO_INCREMENT,
	firstname varchar(50) NOT NULL,
	lastname varchar(50) NOT NULL,
	email varchar(90),
	street_address varchar(100),
	postal_code int,
	city varchar(50),
	Primary key(customer_id),
	unique(customer_id, email)
);

create table TrainerHasCustomer(
	trainer_id int NOT NULL,
	customer_id int NOT NULL,
    signup_date timestamp DEFAULT CURRENT_TIMESTAMP,
	Foreign key(trainer_id) references Trainer(trainer_id) on delete cascade,
	Foreign key(customer_id) references Customer(customer_id) on delete cascade
);

create table WorkoutProgram(
	workoutProgram_id int NOT NULL,
	start_date datetime NOT NULL,
	end_date datetime,
	description	varchar(1000),
	tittel varchar(100),
	customer_id int NOT NULL,
	trainer_id int,
	Primary key(workoutProgram_id),
	Foreign key(customer_id) references Customer(customer_id) on delete cascade,
	Foreign key(trainer_id) references Trainer(trainer_id) on delete set null,
	unique(workoutProgram_id)						
);

create table Appointment(
	appointment_id int NOT NULL,
	date datetime NOT NULL,
	description varchar(300) NOT NULL,
	workoutProgram_id int,
	trainer_id int NOT NULL,
	customer_id int NOT NULL,
	Primary key(appointment_id),
	unique(appointment_id),	
	Foreign key(workoutProgram_id) references WorkoutProgram(workoutProgram_id) on delete set null,
	Foreign key(trainer_id) references Trainer(trainer_id) on delete cascade,
	Foreign key(customer_id) references Customer(customer_id) on delete cascade
);