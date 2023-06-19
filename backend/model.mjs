import mongoose from 'mongoose';
import 'dotenv/config';

mongoose.connect(
    process.env.MONGODB_CONNECT_STRING,
    { useNewUrlParser: true }
);

const db = mongoose.connection;
db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
});

// Schema of a person in the database
const personSchema = mongoose.Schema({
    name: { type: String, required: true },
    birthYear: { type: String, required: false },
    birthCity: { type: String, required: false },
    birthCountry: { type: String, required: false },
    deathYear: { type: String, required: false },
    deathCity: { type: String, required: false },
    deathCountry: { type: String, required: false },
    fatherID: { type: String, required: false },
    motherID: { type: String, required: false },
    partnerID: { type: String, required: false },
});

const Person = mongoose.model("Person", personSchema);

// Function to create a new person
const createPerson = async (name, birthYear, birthCity, birthCountry, deathYear, deathCity, deathCountry, fatherID, motherID, partnerID) => {
    const person = new Person({ 
        name : name, birthYear : birthYear, birthCity : birthCity, birthCountry : birthCountry, deathYear : deathYear, 
        deathCity : deathCity, deathCountry : deathCountry, fatherID : fatherID, motherID : motherID, partnerID : partnerID
     });
    return person.save();
};

// Function to read all the people from the database
const findPeople = async (filter) => {
    const query = Person.find(filter);
    return query.exec();
};

// Function to find a specific person by id
const findPersonById = async (_id) => {
    const query = Person.findById(_id);
    return query.exec();
};

// Function to update a specific person by id
const updatePerson = async (_id, name, birthYear, birthCity, birthCountry, deathYear, deathCity, deathCountry, fatherID, motherID, partnerID) => {
    const result = await Person.replaceOne({ _id: _id }, 
        { name : name, birthYear : birthYear, birthCity : birthCity, birthCountry : birthCountry, deathYear : deathYear, 
            deathCity : deathCity, deathCountry : deathCountry, fatherID : fatherID, motherID : motherID, partnerID : partnerID
        });
    return result.modifiedCount;
};

// Function to delete a person by id
const deletePersonById = async (_id) => {
    const deletion = await Person.deleteMany({ _id: _id });
    return deletion.deletedCount;
}

export { createPerson, findPeople, findPersonById, updatePerson, deletePersonById, convertPeople };