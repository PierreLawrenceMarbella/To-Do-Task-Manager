import { openDB } from 'idb'

const DB_NAME = 'momentum-tasks'
const STORE_NAME = 'tasks'
const DB_VERSION = 1

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      store.createIndex('dueDate', 'dueDate')
      store.createIndex('completed', 'completed')
      store.createIndex('category', 'category')
    }
  }
})

export async function getAllTasks() {
  return (await dbPromise).getAll(STORE_NAME)
}

export async function saveTask(task) {
  await (await dbPromise).put(STORE_NAME, task)
  return task
}

export async function deleteTaskById(id) {
  await (await dbPromise).delete(STORE_NAME, id)
}

export async function replaceAllTasks(tasks) {
  const db = await dbPromise
  const tx = db.transaction(STORE_NAME, 'readwrite')
  await tx.store.clear()
  for (const task of tasks) await tx.store.put(task)
  await tx.done
}

export async function clearAllTasks() {
  await (await dbPromise).clear(STORE_NAME)
}
