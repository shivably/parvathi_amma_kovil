
CREATE TABLE IF NOT EXISTS Members
( 
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    name TEXT NOT NULL, 
    address TEXT, 
    permanent_address INT NOT NULL , 
    phone TEXT NOT NULL,
    email TEXT,
    aadhar TEXT,
    pan TEXT,
    active BOOLEAN DEFAULT 1,
    dor DATETIME DEFAULT CURRENT_TIMESTAMP,
    dob TEXT
);

CREATE TABLE IF NOT EXISTS Kovil
( 
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    name TEXT NOT NULL, 
    description TEXT, 
    active BOOLEAN DEFAULT 1,
    dor DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS IncomeType
( 
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    name TEXT NOT NULL, 
    value INTEGER NOT NULL,
    description TEXT, 
    active BOOLEAN DEFAULT 1,
    dor DATETIME DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS Income
( 
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    donor_name TEXT DEFAULT NULL,
    donor_contact TEXT DEFAULT NULL,
    member_id INTEGER NOT NULL, 
    income_type_id INTEGER NOT NULL,
    kovil_id INTEGER NOT NULL,
    quantity_value INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    value INTEGER NOT NULL,
    description TEXT,
    donation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(member_id) REFERENCES Members(id),
    FOREIGN KEY(income_type_id) REFERENCES IncomeType(id),
    FOREIGN KEY(kovil_id) REFERENCES Kovil(id)

);
