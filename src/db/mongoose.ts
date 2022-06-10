import { connect } from 'mongoose';

const MongoDBCreate = (dbURL: string, dbName: string) => {
    connect(dbURL, {
        dbName
    // tslint:disable-next-line: no-console
    }, () => console.log('DB connection established!'));
}


export default MongoDBCreate;