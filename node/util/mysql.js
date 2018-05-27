'use strict';
const MySQL = require('mysql');

module.exports = class {
  constructor(database) {
    this.auth = {
      host: 'localhost',
      user: '...',
      pass: '...',
    }
    this.connection = null;
    this.database = database;
    this.connect();
  }
  connect() {
    this.connection = MySQL.createConnection({
      port: 3306,
      host: this.auth.host,
      user: this.auth.user,
      password: this.auth.pass,
      database: this.database
    });
    this.connection.connect(err => {
      if (err) throw err;
    });
  }
  query(input, vars=[]) {
    return new Promise((resolve,reject) => {
      this.connection.query(input, vars, (err, result) => {
        if (err)
          throw new Error(err);//reject(err);
        resolve(result);
      });
    });
  }
  escape(value) {
    return this.connection.escape(value);
  }

  logUpdate(ownerTable, ownerKey, ownerId, attrName, attrValue) {
    this.insert('_Updates', {
      OwnerTable: ownerTable,
      OwnerIndex: ownerKey,
      OwnerId: ownerId,
      AttrName: attrName,
      AttrValue: attrValue,
      Created: Math.floor(Date.now() / 1000)
    });
    return this;
  }

  update(table, dataset, condition=null) {
    return new Promise((resolve,reject) => {
      let query = ' UPDATE ' + table + ' SET ';
      let updates = [];
      for(let field in dataset)
        updates.push(field +' = '+ this.escape(dataset[field]));
      query += updates.join(' , ');
      if ( condition !== null )
        query += ' WHERE ' + condition;
      //console.log('Update query: ' + query);
      this.connection.query(query, (err, result) => {
        if (err)
          reject(err);
        resolve(true);
      });
    });
  }

  insert(table, dataset) {
    return new Promise((resolve,reject) => {

      let query = ' INSERT INTO ' + table + ' ';
      let fields = [];
      let values = [];
      for(let fieldName in dataset) {
        fields.push(fieldName);
        values.push(this.escape(dataset[fieldName]));
      }

      query += '('+fields.join(',')+') VALUES ('+values.join(',')+') ';
      this.connection.query(query, (err, result) => {
        if (err)
          reject(err);
        resolve(true);
      });
    });
  }


}
