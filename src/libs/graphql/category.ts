import { gql } from "@urql/core";

export const CATEGORIES = gql`
  query ($filter: OrderBy) {
    storeOwnerCategories(filter: $filter) {
      children {
        id
        title {
          en
        }
      }
      createdAt
      id
      logo
      title {
        en
      }
      updatedAt
    }
  }
`;

export const SUB_CATEGORY_BY_ID = gql`
  query ($parentId: String!) {
    storeOwnerSubcategories(parentId: $parentId) {
      id
      title {
        en
      }
    }
  }
`;
