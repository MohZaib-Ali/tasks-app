import { connect } from 'mongoose';

const MongoDBCreate = (dbURL: string) => {
    connect(dbURL, {
        dbName: process.env.DB_NAME
    // tslint:disable-next-line: no-console
    });
}


export default MongoDBCreate;