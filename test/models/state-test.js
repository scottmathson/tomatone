/* @flow */
import { useFakeTimers } from "sinon";
import { List }          from "immutable";

import {
  Iteration,
  Timer,
} from "../../src/entities";

import {
  State,
} from "../../src/models";

const now = Date.now("2016-11-22T15:30:00");

describe("State", () => {
  let clock;

  beforeEach(() => {
    clock = useFakeTimers(now);
  });

  afterEach(() => {
    clock.restore();
  });

  describe("#currentIteration()", () => {
    it("returns undefined when the timer has not started", () => {
      const itr1 = new Iteration();
      const itr2 = itr1.next();
      const state = new State({
        iterations: List.of(itr1, itr2),
        timer:      new Timer(),
      });
      assert(state.currentIteration() === undefined);
    });

    it("returns undefined when the timer has not started", () => {
      const itr1 = new Iteration();
      const itr2 = itr1.next();
      const state = new State({
        iterations: List.of(itr1, itr2),
        timer:      new Timer({ currentIterationId: itr2.id }),
      });
      assert(state.currentIteration(), itr2);
    });
  });
});
