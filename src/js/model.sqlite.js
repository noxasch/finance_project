'use strict';

const Database = require('better-sqlite3');

// sqlite interface
// we also need the business model

const ModelSQLite = (function () {
  // let db = null;
  let db = new Database('');
  const paginate = 100;
  const table = {
    transaction: 'transactions',
    account: 'account',
    tempAccount: 'temp_account',
    tempTranscation: 'temp_transaction'
  }

  function createTableTransaction() {
    // datetime = // YYYY-MM-DD to unixtime
    let sql = `CREATE TABLE IF NOT EXISTS ${table.transaction} (
        id INTEGER,
        userid DEFAULT NULL,
        label VARCHAR(30) NOT NULL,
        amount REAL NOT NULL,
        transaction_type INT NOT NULL,
        account_id INT NOT NULL,
        operation INT NOT NULL,
        category INT,
        transaction_date DATETIME NOT NULL,  
        date_added DEFAULT (strftime('%s','now')),
        date_updated DEFAULT (strftime('%s','now')),
        transfer_id INT,
        device_hash,
        purged BOOLEAN BOOLEAN DEFAULT FALSE,
        PRIMARY KEY (id)
        FOREIGN KEY (account_id) REFERENCES ${table.account}(id)
        )`.replace(/\s+/g, ' ');
    db.prepare(sql).run();
  }

  function createTableAccount() {
    let sql = `CREATE TABLE IF NOT EXISTS ${table.account} (
        id INTEGER,
        account_name VARCHAR(30) NOT NULL UNIQUE,
        icon_id INT,
        include_in_total BOOLEAN DEFAULT TRUE, 
        purged BOOLEAN DEFAULT FALSE,
        PRIMARY KEY (id)
        )`.replace(/\s+/g, ' ');
    db.prepare(sql).run();
  }

  /**
   * return boolean
   * @param {string} tableName 
   */
  function isTableExists(tableName) {
    let sql = `SELECT * FROM sqlite_master WHERE type=\'table\' AND name=?`
    let result = db.prepare(sql).get([tableName]);
    if (result === undefined) return false;
    else return true;
  }

  /**
   * return row id of the inserted item
   * @param {object} obj 
   */
  function addAccount(obj) {
    let sql = `INSERT INTO ${table.account} (account_name, icon_id) VALUES (@name, @iconid)`;
    let info = db.prepare(sql).run(obj);
    return info.lastInsertRowid;
  }

  /**
   * return array of object or empty array
   */
  function getAllAccount() {
    let rows = db.prepare(`SELECT * FROM ${table.account} WHERE purged <> 1;`).all();
    return rows;
  }

  function getAccount(accountid) {
    console.log(accountid);
    let sql = `SELECT * FROM ${table.account} WHERE id = ?`;
    return db.prepare(sql).get([accountid]);
  }

  function updateAccount(accountObj) {
    let sql = `UPDATE ${table.account} SET account_name = @name, icon_id = @iconid) WHERE id = @id`;
    db.prepare(sql).run(accountObj);
  }

  function purgeAccount(accountId) {
    let sql = `UPDATE ${table.transaction} SET purged = 1 WHERE id = ?`
    db.prepare(sql).run([accountId]);
  }

  function getTransactionById(itemId) {
    let sql = `SELECT * FROM ${table.transaction} WHERE id = ?`;
    return db.prepare(sql).get([itemId]);
  }

  function getTransactionsByTransferId(transferId) {
    let sql = `SELECT * FROM ${table.transaction} WHERE transfer_id = ?`;
    let rows = db.prepare(sql).all([transferId]);
    return rows;
  }

  function getAllTransaction(limit = null) {
    let sql = `SELECT *, (SELECT SUM(amount) FROM ${table.transaction} WHERE purged <> 1 FROM ${table.transaction} WHERE purged <> 1`;
    if (typeof limit === "number") sql += `LIMIT ${limit}`;
    let rows = db.prepare(sql).all();
    return rows;
  }
  

  function addTransaction(obj) {
    let sql = `INSERT INTO ${table.transaction} 
                    (label, amount, account_id, transaction_type, 
                      operation, category, transaction_date, date_added, date_updated, transfer_id, device_hash)
                    VALUES
                      (@label, '@amount', @accountId, @type,
                        @operation, @category, @datetime, @dateAdded, @dateUpdated
                        @transferId, @deviceHash)`.replace(/\s+/g, ' ');
    let info = db.prepare(sql).run(obj);
    

    return info.lastInsertRowid;
  }

  function addMultipleTransaction(objArray) {
    let sql = `INSERT INTO ${table.transaction} 
                    (label, amount, account_id, transaction_type, 
                      operation, category, transaction_date, date_added, date_updated
                      transfer_id, device_hash)
                    VALUES
                      (@label, '@amount', @accountId, @type,
                        @operation, @category, @datetime, @dateAdded, @dateUpdated
                        @transferId, @deviceHash)`.replace(/\s+/g, ' ');
    
    const stmt = db.prepare(sql);
    const multiple = db.transaction((items) => {
      for (const item of items) {
        stmt.run(item)
      };
    });
    multiple(objArray);
    return true;
  }

  function updateTransaction(obj) {
    let sql = `UPDATE ${table.transaction} 
              SET 
                amount = @amount,
                operation = @operation,
                transaction_type = @type,
                label = @label,
                transaction_date = @datetime,
                category = @category,
                date_updated = strftime('%s','now')
              WHERE id = @id`.replace(/\s+/g, ' ');
    db.prepare(sql).run(obj);
  }

  function purgeTransaction(itemId) {
    let sql = `UPDATE ${table.transaction} SET purged = 1 WHERE id = ?`
    db.prepare(sql).run([itemId]);
  }

  // get transaction by date range
  function getTransactionBetween(dateOne, dateTwo) {
    let sql = `SELECT * FROM ${table.transaction} WHERE transaction_date 
                  BETWEEN strftime('%s', date('?')) AND strftime('%s', date('?'))`.replace(/\s+/g, ' ');
    return db.prepare(sql).all([dateOne, dateTwo]);
  }

  return {
    init: function(database){
      db = new Database(database);
    },
    createTableTransaction,
    createTableAccount,
    isTableExists,
    addAccount,
    getAllAccount,
    getAccount,
    purgeAccount,
    updateAccount,
    addTransaction,
    addMultipleTransaction,
    getAllTransaction,
    getTransactionById,
    getTransactionsByTransferId,
    purgeTransaction,
    updateTransaction,
    getTransactionBetween,
  }
})();

module.exports = { ModelSQLite }