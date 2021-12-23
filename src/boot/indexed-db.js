let db = null
// related tables
const TABLES = ['last_update_time', 'person', 'organize', 'role']
const TABLES_ABORT = ['last_update_time_copy', 'person_copy', 'organize_copy', 'role_copy']

// open indexedDB
let request = window.indexedDB.open('teamwork', 12)
request.onsuccess = function (event) {
  db = request.result
  // console.log('indexedDB打开成功')

  // delete instance can trigger it
  db.onclose = function () {
    console.log('IndexedDB opening closed!')
  }
}
request.onupgradeneeded = function (event) {
  db = event.target.result

  // delete old version tables
  let deleteTables = [...TABLES, ...TABLES_ABORT]
  deleteTables.forEach(table => {
    db.objectStoreNames.contains(table) && db.deleteObjectStore(table)
  })

  createTables(TABLES)
}
request.onerror = function (event) {
  console.log('indexedDB打开报错')
}

/**
 * batch create tables
 * @param {*} tables
 */
function createTables (tables) {
  tables.forEach(table => {
    !db.objectStoreNames.contains(table) && createTable(table)
  })
}

/**
 * create table fields
 * @param {*} table
 */
function createTable (table) {
  let objectStore = null
  switch (table) {
    case 'last_update_time':
      objectStore = db.createObjectStore('last_update_time', { keyPath: 'id' })
      objectStore.createIndex('time', 'time', { unique: false })
      break
    case 'person':
      objectStore = db.createObjectStore('person', { keyPath: 'id' })
      objectStore.createIndex('persons', 'persons', { unique: false })
      break
    case 'organize':
      objectStore = db.createObjectStore('organize', { keyPath: 'id' })
      objectStore.createIndex('organizes', 'organizes', { unique: false })
      break
    case 'role':
      objectStore = db.createObjectStore('role', { keyPath: 'id' })
      objectStore.createIndex('roles', 'roles', { unique: false })
      break
  }
}

/**
 * get lastUpdateTimeStamp
 */
function getLastUpdateTime () {
  return new Promise((resolve, reject) => {
    loadModel('last_update_time', 1)
      .then(res => {
        let lastUpdateTime = (res && res.time) || null
        resolve(lastUpdateTime)
      })
  })
}

/**
 * load model from indexedDB
 * @param {*} table table name
 * @param {*} id row id
 */
function loadModel (table, id) {
  return new Promise((resolve, reject) => {
    if (db) {
      let readRequest = db.transaction(table)
        .objectStore(table)
        .get(id)

      readRequest.onsuccess = function (event) {
        resolve(readRequest.result)
      }

      readRequest.onerror = function (event) {
        // delete last_update_time
        db.transaction('last_update_time', 'readwrite')
          .objectStore('last_update_time')
          .clear()
        reject('事务失败')
      }
    } else { resolve(null) }
  })
}

/**
 * load models from indexedDB
 * @param {*} table table name
 */
function loadList (table) {
  return new Promise((resolve, reject) => {
    if (db) {
      let objectStore = db.transaction(table).objectStore(table)
      // getAll first
      let readRequest = null
      if (objectStore.getAll) {
        readRequest = objectStore.getAll()
        readRequest.onsuccess = function (event) {
          resolve(event.target.result)
        }
      } else {
        let list = []
        readRequest = objectStore.openCursor()
        readRequest.onsuccess = function (event) {
          let cursor = event.target.result
          if (cursor) {
            list.push(cursor.value)
            cursor.continue()
          } else {
            resolve(list)
            // console.log('没有更多数据了！')
          }
        }
      }

      readRequest.onerror = function (event) {
        // delete last_update_time
        db.transaction('last_update_time', 'readwrite')
          .objectStore('last_update_time')
          .clear()
        reject('事务失败')
      }
    } else { resolve(null) }
  })
}

/**
 * update one row of a table
 * @param {*} table table name
 * @param {*} model rowData
 */
function update (table, model) {
  return new Promise((resolve, reject) => {
    if (db) {
      let request = db.transaction(table, 'readwrite')
        .objectStore(table)
        .put(model)

      request.onsuccess = function (event) {
        // console.log('数据更新成功')
        resolve(model)
      }

      request.onerror = function (event) {
        // console.log('数据更新失败')
        reject('数据更新失败')
      }
    } else { resolve(null) }
  })
}

/**
 * update rows of a table
 * @param {*} table table name
 * @param {*} list rowDatas
 */
function batchUpdate (table, list) {
  let arrPromise = []
  for (let i = 0; i < list.length; i++) {
    const element = list[i]
    arrPromise.push(update(table, element))
  }
  return Promise.all(arrPromise)
}

/**
 * remove one row of a table
 * @param {*} table table name
 * @param {*} id row id
 */
function remove (table, id) {
  return new Promise((resolve, reject) => {
    if (db) {
      let removeRequest = db.transaction(table, 'readwrite')
        .objectStore(table)
        .delete(id)

      removeRequest.onsuccess = function (event) {
        // console.log('数据删除成功')
        resolve(event.target.result)
      }
    } else { resolve(null) }
  })
}

const indexedDBInterface = {
  getLastUpdateTime: () => getLastUpdateTime(),
  getCount: table => getCount(table),
  loadModel: (table, id) => loadModel(table, id),
  loadList: table => loadList(table),
  update: (table, model) => update(table, model),
  batchUpdate: (table, list) => batchUpdate(table, list),
  remove: (table, id) => remove(table, id)
}

export default indexedDBInterface
