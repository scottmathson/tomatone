/* @flow */
import { mount } from "enzyme";

import { StaticRouter } from "react-router";
import { Map }          from "immutable";

import { Category } from "../../../src/entities";

/* eslint-disable no-duplicate-imports */
import CategoryBreadcrumbs from "../../../src/components/category-selector/CategoryBreadcrumbs";
import type { Props }      from "../../../src/components/category-selector/CategoryBreadcrumbs";
/* eslint-enable */

function createWrapper(props: Props) {
  // https://github.com/ReactTraining/react-router/blob/553b56a750072641b532c1113336a706d6f62648/modules/__tests__/Link-test.js#L259-L277
  return mount((
    <StaticRouter
      location="/"
      action="POP"
      onPush={() => {}}
      onReplace={() => {}}
    >
      <CategoryBreadcrumbs {...props} />
    </StaticRouter>
  ));
}

describe("<CategoryBreadcrumbs />", () => {
  let wrapper;

  let currentCategory: Category;
  let categories: Map<number, Category>;

  beforeEach(() => {
    let id = 0;
    categories = Map([
      [(id += 1), new Category({ id, name: "category1" })],
      [(id += 1), new Category({ id, name: "category1/category2" })],
      [(id += 1), new Category({ id, name: "category1/category2/category3" })],
    ]);
  });

  context("when the currentCategory's depth is 1", () => {
    beforeEach(() => {
      currentCategory = categories.get(1);
      wrapper = createWrapper({ currentCategory, categories });
    });

    it("renders valid anchors", () => {
      const items = wrapper.find(".CategoryBreadcrumbs__item Link");
      assert(items.length === 1);
      {
        const href = "href=\"/tasks?category=%2Fcategory1\"";
        assert(items.at(0).text() === "category1");
        assert(items.at(0).html().indexOf(href) !== -1);
      }
    });
  });

  context("when the currentCategory's depth is 3", () => {
    beforeEach(() => {
      currentCategory = categories.get(3);
      wrapper = createWrapper({ currentCategory, categories });
    });

    it("renders valid anchors", () => {
      const items = wrapper.find(".CategoryBreadcrumbs__item Link");
      assert(items.length === 3);
      {
        const href = "href=\"/tasks?category=%2Fcategory1\"";
        assert(items.at(0).text() === "category1");
        assert(items.at(0).html().indexOf(href) !== -1);
      }
      {
        const href = "href=\"/tasks?category=%2Fcategory1%2Fcategory2\"";
        assert(items.at(1).text() === "category2");
        assert(items.at(1).html().indexOf(href) !== -1);
      }
      {
        const href = "href=\"/tasks?category=%2Fcategory1%2Fcategory2%2Fcategory3\"";
        assert(items.at(2).text() === "category3");
        assert(items.at(2).html().indexOf(href) !== -1);
      }
    });
  });

  context("when categories has not loaded", () => {
    beforeEach(() => {
      currentCategory = categories.get(1);
      wrapper = createWrapper({ currentCategory, categories: Map() });
    });

    it("does not render DOMs", () => {
      assert(wrapper.html() == null);
    });
  });
});