/* @flow */
import { Record, Map, List } from 'immutable'

import {
  Category,
  Iteration,
  Message,
  Task,
  Timer,
} from '../entities'

type StateConfig = {
  categories: Map<number, Category>,
  iterations: Map<number, Iteration>,
  messages: List<Message>,
  tasks: Map<number, Task>,
  timer: Timer,
}

const defaultValues: StateConfig = {
  categories: Map([
    [Category.ALL.id, Category.ALL],
    [Category.NO_CATEGORY.id, Category.NO_CATEGORY],
  ]),
  iterations: Map(),
  messages:   List(),
  tasks:      Map(),
  timer:      new Timer(),
}

const StateRecord = Record(defaultValues)

export default class State extends StateRecord {
  currentIteration (): ?Iteration {
    return this.iterations.get(this.timer.currentIterationId)
  }

  currentTask (): ?Task {
    return this.tasks.get(this.timer.selectedTaskId)
  }

  currentCategory (): Category {
    return this.categories.get(this.timer.selectedCategoryId)
  }

  currentCategoryTasks (): Map<number, Task> {
    const currentCategory = this.currentCategory()
    return this.tasks
      .filter((task) => {
        const category = this.categories.get(task.categoryId)
        return currentCategory.includes(task) ||
          (category != null && currentCategory.isParentOf(category))
      })
  }

  hasStarted (): boolean {
    return this.timer.hasStarted()
  }

  isWorking (): boolean {
    const itr = this.currentIteration()
    return (itr === undefined || itr === null) ? false : itr.isWorking()
  }
}
