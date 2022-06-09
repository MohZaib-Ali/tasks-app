import { connect } from 'mongoose';

const MongoDBCreate = (dbURL: string, dbName: string) => {
    connect(dbURL, {
        dbName
    }, () => console.log('DB connection established!'));
}


export default MongoDBCreate;