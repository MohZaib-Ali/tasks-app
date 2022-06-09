
const { MongoClient, ObjectId } = require("mongodb");
require('dotenv').config();
const serverURL = `mongodb+srv://${process.env.DB_USERNAME}:${encodeURIComponent(process.env.DB_PASS)}@test.lvhnd.mongodb.net`;
const dbName = "tasks";
MongoClient.connect(serverURL, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (!!err) {
        return console.log('Unable to connect to DB!')
    }

    const db = client.db(dbName);
    Challenge
    db.collection('dailyTasks').findOne({ "_id": new ObjectId('62a1729a5fe9cca493560dfd') }, (err, result) => {
        if (err) return console.log(err);
        console.log(result)
    });
    db.collection('dailyTasks').find({ "completed": false }).toArray((err, result) => {
        if (err) return console.log(err);
        console.log(result)
    });

    // Challenge 1
    const updateTasks = db.collection('dailyTasks').updateMany({
        completed: false
    }, {
        $set: {
            completed: true
        }
    });

    updateTasks
        .then((result) => {
            console.log('Tasks completed:', result.modifiedCount);
        })
        .catch(err => {
            console.log('Error in updating Tasks: ' + err)
        })

    // Challenge 2
    db.collection('dailyTasks').deleteOne({
        description: 'Clean the house'
    }).then((result) => {
        console.log('Deleted Tast successfully!');
    })
        .catch(err => {
            console.log('Error in deleting task: ' + err)
        })

    db.collection('dailyTasks').findOneAndDelete({
        description: 'Clean the house'
    }).then((result) => {
        console.log(result.value);
        console.log('Deleted Tast successfully!');
    })
        .catch(err => {
            console.log('Error in deleting task: ' + err)
        })

    console.log('Connected to DB successfully!')
})