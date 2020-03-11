'use strict';

const Database = require('better-sqlite3');

// sqlite interface
// we also need the business model

const ModelSQLite = (function () {
  let db = null;
  // let db = new Database(''); // for code intellisense
  const table = {
    transaction: 'transactions',
    account: 'account',
    tempAccount: 'temp_account',
    tempTranscation: 'temp_transaction'
  }

  function createTableTransaction() {
    // transaction_date = YYYY-MM-DD to unixtime
    // exchange_Rate - for transfer at time conversion only
    let sql = `CREATE TABLE IF NOT EXISTS ${table.transaction} (
        id INTEGER,
        user_id DEFAULT NULL,
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
        exchange_rate REAL,
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
        name VARCHAR(30) NOT NULL UNIQUE,
        icon_id INT,
        include_in_total BOOLEAN DEFAULT TRUE, 
        initial_balance REAL DEFAULT 0,
        currency VARCHAR(3) NOT NULL,
        description VARCHAR(50),
        date_added DEFAULT (strftime('%s','now')),
        date_updated DEFAULT (strftime('%s','now')),
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
    let sql = `INSERT INTO ${table.account} (name, icon_id, include_in_total, initial_balance, currency, description) 
      VALUES (@name, @iconid, @include, @initial, @currency, @description)`.replace(/\s+/g, ' ');
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

  /**
   * 
   * @param {*} accountid 
   * if accountid is not null return undefined or an object 
   * if accountid is null return empy array or array of object
   */
  function getAccount(accountid = null) {
    // console.log(accountid);
    let sql = `SELECT *, (SELECT SUM(amount) FROM ${table.transaction} WHERE transactions.purged <> 1 
    AND ${table.transaction}.account_id = ${table.account}.id) as balance FROM ${table.account}`.replace(/\s+/g, ' ');
    if (accountid) {
      // console.log('JEM');
      sql += ` WHERE id = ?`;
      return db.prepare(sql).get([accountid]);
    }
    sql = `SELECT *, (SELECT SUM(amount) FROM ${table.transaction} WHERE transactions.purged <> 1 
    AND ${table.transaction}.account_id = ${table.account}.id) as balance FROM ${table.account};`.replace(/\s+/g, ' ');
    let stmt = db.prepare(sql);
    let rows = stmt.all();
    return rows;
  }

  function getAccountByCurrency(currency) {
    let sql = `SELECT * FROM ${table.account} WHERE purged <> 1 AND currency = ?`;
    return db.prepare(sql).all(currency);
  }

  function updateAccount(accountObj) {
    let sql = `UPDATE ${table.account} SET account_name = @name, icon_id = @iconid) WHERE id = @id`;
    db.prepare(sql).run(accountObj);
  }

  function purgeAccount(accountId) {
    let sql = `UPDATE ${table.account} SET purged = 1 WHERE id = ?`
    db.prepare(sql).run([accountId]);
  }

  function getAccountBalance(accountId = null) {
    let sql = '';
    if (accountId) {
      sql = `SELECT SUM(amount) + (SELECT amount FROM ${table.account} WHERE id = ?) as ${table.account}_balance FROM ${table.transaction} WHERE account_id = ?`;
      return db.prepare(sql).get([accountId, accountId]);
    }
    sql = `SELECT SUM(${table.transaction}.amount) + (SELECT SUM(initial_balance) FROM ${table.account} WHERE include_in_total = 1 AND purged <> 1) as total_balance FROM ${table.transaction} INNER JOIN  ${table.account} WHERE ${table.account}.include_in_total = 1 AND ${table.transaction}.account_id = ${table.account}.id`;
    return db.prepare(sql).get();
    // need to refactor this
    // calculate balance per account and sum it up
  }

  // function getTransactionSumByType() {
  //   sql = `SELECT`
  // }

  // function getTransactionSumByTypeAndDate() {

  // }

  function getTransactionById(itemId) {
    // console.log(itemId);
    let sql = `SELECT * FROM ${table.transaction} WHERE id = ?`;
    return db.prepare(sql).all([itemId]);
  }

  function getTransactionsByTransferId(transferId) {
    let sql = `SELECT * FROM ${table.transaction} WHERE transfer_id = ?`;
    let rows = db.prepare(sql).all([transferId]);
    return rows;
  }

  function getAllTransaction(limit = null) {
    let sql = `SELECT * FROM ${table.transaction} WHERE purged <> 1 ORDER BY transaction_date`;
    if (typeof limit === "number") sql += ` LIMIT ${limit}`;
    // console.log(sql);
    let rows = db.prepare(sql).all();
    // console.log(rows);
    return rows;
  }
  

  function addTransaction(obj) {
    let sql = `INSERT INTO ${table.transaction} 
                    (label, amount, account_id, transaction_type, 
                      operation, category, transaction_date, transfer_id)
                    VALUES
                      (@label, @amount, @account_id, @transaction_type,
                        @operation, @category_id, strftime('%s', @transaction_date),
                        @transfer_id)`.replace(/\s+/g, ' ');
    // console.log('ADD', obj);
    let info = db.prepare(sql).run(obj);
    console.log(info);
    return info.lastInsertRowid;
  }

  function addMultipleTransaction(objArray) {
    let sql = `INSERT INTO ${table.transaction} 
                    (label, amount, account_id, transaction_type, 
                      operation, category, transaction_date, transfer_id, exchange_rate)
                    VALUES
                      (@label, @amount, @account_id, @transaction_type,
                        @operation, @category_id, strftime('%s', @transaction_date),
                        @transfer_id, @exchange_rate)`.replace(/\s+/g, ' ');
    // console.log(sql);
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
                transaction_type = @transaction_type,
                label = @label,
                transaction_date =  strftime('%s', @transaction_date),
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

    // getTransactionSum,
    getAccountBalance,
    getAccountByCurrency
  }
})();

module.exports = { ModelSQLite }

// get sum of each account
// total balance = balance of all account in base currency + balance in other currency (converted as today's rate)
// balance use today's rate (latest rate)
// transaction in it's own account currency
// for now analytics should based on it's respective account currency only
// multi currency and multi timeline rate seems to be impossible