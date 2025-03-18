import { gql } from '@apollo/client';

export const GET_COCKTAILS = gql`
  query GetCocktails($search: String) {
    cocktails(search: $search) {
      id
      name
      image
      category
      alcoholic
      glass
      instructions
      ingredients {
        name
        measure
      }
    }
  }
`;
