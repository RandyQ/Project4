// Import mongoose and the models
const mongoose = require('mongoose');
const WeightEntry = mongoose.model("WeightEntry");
let weightEntryModel = require('../models/weightEntry');

// Insert new weight entry into the database
const postEntry = function (name, weight, height, date) {
    WeightEntry.create(new weightEntryModel({
        name: name,
        weight: weight,
        height: height,
        date: date
    })
    );
};

// Post an edited weight entry to database
const postEditedEntry = function (name, weight, height, date, _id) {
    return WeightEntry.findById(_id, function (err, entry) {
        entry.name = name;
        entry.weight = weight;
        entry.height = height;
        entry.date = date;
        entry.save();
    });
};

// Retrieves all entries in the database
const getAllEntries = function () {
    return WeightEntry.find({}).sort({
        // Organize entries by name first, then by date in descending order
        name: -1,
        date: -1
    }).exec();
};

// Deletes an entry from database and creates a message of the details of the action for the user
const deleteEntry = async function (_id) {
    let deletedDataMessage;
    await WeightEntry.findById(_id, function (err, entry) {

        err ? console.log(err) : deletedDataMessage =
            "Entry with date " + entry.date + " and with weight "
            + entry.weight + " was deleted from " + entry.name + "'s list";
        entry.remove();
    });

    return deletedDataMessage;
};

// Retrieves all user names for display (dropdowns)
const getUserNames = function () {
    return WeightEntry.find({}, { name: 1 });
};

// Retrieves the most recent record/entry input by a given user
const getLatestRecordByName = async function (name) {
    const allRecordsByName = await WeightEntry.find({ name: name }).exec();
    return getBeginAndEndRecords(allRecordsByName).latestDateRecord;
};

// Calculates total weight loss from a given date for a given user
const getTotalWeightLoss = async function (name, date) {
    const allRecordsByName = await WeightEntry.find({ name: name }).exec();
    let relevantRecords = [];
    allRecordsByName.forEach(element => {
        if (element.date > date) {
            relevantRecords.push(element);
        }
    });
    // See function definition
    const records = getBeginAndEndRecords(relevantRecords);
    return {
        // negative results (numbers) are lost weight and positive results are gained weight
        weight: records.earliestDateRecord.weight - records.latestDateRecord.weight,
        // The 'begin' date for weight calculation
        earliestDate: records.earliestDateRecord.date
    };
}

// Retrieves the most recent entry/record and the earliest record from the database according to a timespan
// for use in calculating weight loss between these dates
function getBeginAndEndRecords(relevantRecords) {
    let earliestDateRecord = latestDateRecord = relevantRecords[0];
    for (let i = 0; i < relevantRecords.length; i++) {
        // Find the earliest record
        if (earliestDateRecord.date < relevantRecords[i].date) {
            earliestDateRecord = relevantRecords[i];
        }
        // Find the latest record
        if (latestDateRecord.date > relevantRecords[i].date) {
            latestDateRecord = relevantRecords[i];
        }
    }

    return { earliestDateRecord, latestDateRecord };
}

module.exports = {
    postEntry,
    getAllEntries,
    postEditedEntry,
    deleteEntry,
    getUserNames,
    getTotalWeightLoss,
    getLatestRecordByName
}