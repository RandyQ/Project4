const weightService = require('../lib/weightService');

module.exports = {
    // Home page
    home: function (req, res) {
        res.render('home', { title: "WeighTracker" });
    },

    // Direct the user to the add new entry page
    addEntry: function (req, res) {
        res.render('entry', {
            title: "Add New Weight Entry",
            name: req.session.user.name,
            weight: "",
            height: "",
            // Date is a string in order to display proper format
            date: formatDate(new Date())
        });
    },

    // Create a new entry in the database when adding or editing if all fields are filled out and send a flash message
    postEntry: async function (req, res) {
        let name = req.body.name, weight = req.body.weight,
            height = req.body.height, date = req.body.date, _id = req.body._id;
        let redirect;
        if (name && weight && height && date) {
            if (req.body._id) {
                await weightService.postEditedEntry(name, weight, height, padDate(date), _id);
                redirect = "/viewentries";
            } else {
                await weightService.postEntry(name, weight, height, padDate(date));
                redirect = "/add";
            }
            // Flash message to inform the user their entry has been saved
            req.session.flash = {
                message: "Your weight entry has been saved..."
            };
        }
        else {
            // Validation
            req.session.flash = {
                message: "You must fill in all fields!"
            };
        }
        // Redirect the user back to adding a new entry to add another 
        // if they like, or to view all entries if they are editing
        return res.redirect(303, redirect);
    },

    // View all entries page organized by name
    viewEntries: async function (req, res) {
        let allEntries = await weightService.getAllEntries();
        let entriesByName = splitEntriesByName(allEntries);
        res.render('entryList', {
            entries: entriesByName,
            title: "All Weight Entries"
        });
    },

    // Opens the 'Add Entry' page with prefilled data in the inputs to edit
    editEntry: function (req, res) {
        res.render('entry', {
            title: "Edit Weight Entry",
            name: req.query.name,
            weight: req.query.weight,
            height: req.query.height,
            date: req.query.date,
            _id: req.query._id
        })
    },

    // Deletes the user's chosen weight entry and returns a flash message
    deleteEntry: async function (req, res) {
        if (req.query._id) {
            let message = await weightService.deleteEntry(req.query._id);
            req.session.flash = {
                message: message
            };
        }

        res.redirect(303, '/viewentries');
    },

    // Sets up and displays the WeighTracker functions page
    functions: async function (req, res) {
        const temp = await weightService.getUserNames();
        let users = Array.from(new Set(temp.map(user => user.name)));
        res.render('functions', {
            title: "WeighTracker Functions",
            users: users
        })
    },

    // Calculates total weight loss (or gain) for a chosen user according to different timespans (week, month, or more)
    calculateWeightLoss: async function (req, res) {
        let weightChange;
        if (req.body.user && req.body.timeSpan) {
            // Find the begin date according to a user's given timespan from current date
            let beginDate = getBeginDate(new Date(), req.body.timeSpan);
            // Retrieves an object with both weight (gain or loss) and the user's earliest date relative to timespan
            weightChange = await weightService.getTotalWeightLoss(req.body.user, formatDate(beginDate));
            if (weightChange.weight <= 0) {
                req.session.flash = {
                    message: req.body.user + " has LOST " + Math.abs(weightChange.weight)
                        + " lbs since " + weightChange.earliestDate + "!!"
                };
            } else {
                req.session.flash = {
                    message: req.body.user + " has GAINED " + weightChange.weight
                        + " lbs since " + weightChange.earliestDate
                }
            }
        } else {
            req.session.flash = {
                message: "ERROR: Please check your inputs and try again"
            };
        }
        res.redirect(303, 'functions');
    },

    // Calculates a user's Body Mass Index and displays it via flash message
    calculateBMI: async function (req, res) {
        let BMI;
        if (req.body.user) {
            // Retrieve the latest record to calculate BMI with
            let latestRecord = await weightService.getLatestRecordByName(req.body.user);
            const conversionFactor = 703;
            // BMI calculation
            BMI = (conversionFactor * latestRecord.weight) / (latestRecord.height * latestRecord.height);
            req.session.flash = {
                message: req.body.user + "'s BMI is " + BMI.toFixed(2) + " as of " + latestRecord.date
            };
        } else {
            req.session.flash = {
                message: "ERROR: Please check your inputs and try again"
            };
        }

        res.redirect(303, 'functions');
    }
};

// Creates an array of arrays where each array represents a particular user's entries (by name)
function splitEntriesByName(allEntries) {
    // Create an array that will hold arrays of weight entries by name
    let entriesByName = [];
    let j = 0, k = 0;
    // Iterate over all weight entries from the database
    for (let i = 0; i < allEntries.length; i++) {
        let userEntries = [];
        // As long as the entries in allEntries have the same name, 
        // add an entry to a temp array representing a user's entries
        for (j; (j < allEntries.length) && (allEntries[j].name === allEntries[i].name); j++) {
            userEntries[j - i] = allEntries[j];
        }
        if (userEntries.length !== 0) {
            // Insert the user's grouped entries (array of a particluar user's entries) 
            // into an array that will hold all user's entries as separate arrays 
            entriesByName[k] = userEntries;
            ++k;
        }
        // If j iterated over all remaining entries from allEntries, then the process
        // is complete and we break the loop.
        if (j === allEntries.length) {
            break;
        }
    }
    return entriesByName;
}

// Returns a date that is a given timespan (week, month, or more) prior to the given date  
function getBeginDate(date, timeSpan) {
    if (timeSpan === "week") {
        date.setDate(date.getDate() - 7);
    } else if (timeSpan === "month") {
        date.setMonth(date.getMonth() - 1);
    } else {
        date = new Date("1000-1-1");
    }
    return date;
}

// Create a date string of a date in the format mm/dd/yyyy
function formatDate(date) {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = date.getFullYear();
    let formattedDate = mm + '/' + dd + '/' + yyyy;
    return formattedDate;
}

// Make sure the date input has two digits for month and day and four for year
function padDate(date) {
    const month = date.substring(0, date.indexOf('/')).padStart(2, '0');
    const day = date.substring(date.indexOf('/') + 1, date.lastIndexOf('/')).padStart(2, '0');
    let adjustedDate = month + '/' + day + date.substring(date.lastIndexOf('/'), date.length);
    if (adjustedDate.length !== 10) {
        adjustedDate = adjustedDate.substring(0, 6) + '20' 
        + adjustedDate.substring(adjustedDate.length - 2, adjustedDate.length);
    }
    return adjustedDate;
}