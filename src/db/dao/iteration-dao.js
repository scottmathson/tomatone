/* @flow */
import Dexie from "dexie";
import { List } from "immutable";

import {
  Iteration,
  IterationType,
  Task,
} from "../../entities";

export default class IterationDao {
  db: Dexie;

  constructor(db: Dexie) {
    this.db = db;
  }

  getAll(): Promise<List<Iteration>> {
    const items = this.table.toArray()
      .then(arr => List(arr.map(i => new Iteration(i))));
    return Promise.resolve(items);
  }

  createFirst(task: Task): Promise<Iteration> {
    const startedAt = Date.now();
    const type: IterationType = "WORK";
    const numOfIteration = 1;
    const totalTimeInMillis = Iteration.TIMES[type];
    const taskId = task.id;

    return this.create({
      startedAt,
      type,
      numOfIteration,
      totalTimeInMillis,
      taskId,
    });
  }

  next(itr: Iteration): Promise<Iteration> {
    let type: IterationType = "WORK";
    let numOfIteration: number = itr.numOfIteration;
    if (itr.type === "WORK") {
      const isLongBreak = itr.numOfIteration % Iteration.MAX_ITERATIONS === 0;
      type = isLongBreak ? "LONG_BREAK" : "SHORT_BREAK";
    } else {
      numOfIteration += 1;
    }
    const startedAt = Date.now();
    const totalTimeInMillis = Iteration.TIMES[type];
    const taskId = itr.taskId;

    return this.create({
      startedAt,
      type,
      numOfIteration,
      totalTimeInMillis,
      taskId,
    });
  }

  stop(itr: Iteration): Promise<Iteration> {
    return this.update(itr, { totalTimeInMillis: Date.now() - itr.startedAt });
  }

  setTask(itr: Iteration, task: Task): Promise<Iteration> {
    return this.update(itr, { taskId: task.id });
  }

  create(props: any): Promise<Iteration> {
    return Promise.resolve(this.table.put(props))
      .then(() => new Iteration(props));
  }

  update(itr: Iteration, props: any): Promise<Iteration> {
    return Promise.resolve(this.table.update(itr.id, props))
      .then(() => Object.keys(props).reduce((newItr, key) => newItr.set(key, props[key]), itr));
  }

  get table(): Dexie.WriteableTable {
    return this.db.iterations;
  }
}
