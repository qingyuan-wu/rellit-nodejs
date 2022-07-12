// Imports the Google Cloud client library
const {Datastore} = require('@google-cloud/datastore');
const datastore = new Datastore();

const insert = (table, body) => {
    return datastore.save({
        key: datastore.key(table),
        data: body,
    });
};

module.exports = { insert };