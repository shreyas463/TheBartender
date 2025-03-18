import { useQuery, gql } from '@apollo/client';
import PropTypes from 'prop-types';

const GET_COCKTAIL = gql`
  query GetCocktail($id: ID!) {
    cocktail(id: $id) {
      id
      name
      image
      instructions
      ingredients {
        name
        measure
      }
      glass
      category
      alcoholic
    }
  }
`;

const CocktailDetails = ({ cocktailId, onClose }) => {
  const { loading, error, data } = useQuery(GET_COCKTAIL, {
    variables: { id: cocktailId },
  });

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg w-full max-w-2xl mx-4">
          <div className="animate-pulse flex flex-col space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-red-600 mb-4">Error</h3>
          <p className="text-gray-700">Unable to load cocktail details. Please try again later.</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const { cocktail } = data;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
      <div className="modal bg-white p-8 w-full max-w-2xl mx-4 my-8">
        <div className="modal-header flex justify-between items-start mb-6">
          <h2 className="text-3xl font-bold">{cocktail.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <img
              src={cocktail.image}
              alt={cocktail.name}
              className="w-full rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
            />
            <div className="mt-6 flex flex-wrap gap-2">
              <span className={`tag ${cocktail.alcoholic === 'Alcoholic' ? 'alcoholic' : 'non-alcoholic'}`}>
                {cocktail.alcoholic || 'Non-Alcoholic'}
              </span>
              {cocktail.category && (
                <span className="tag" style={{ backgroundColor: '#ebf8ff', color: '#2c5282' }}>
                  {cocktail.category}
                </span>
              )}
              {cocktail.glass && (
                <span className="tag" style={{ backgroundColor: '#faf5ff', color: '#553c9a' }}>
                  {cocktail.glass}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Ingredients</h3>
              <ul className="space-y-2">
                {cocktail.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full mr-3"></span>
                    {ingredient.measure ? `${ingredient.measure} ${ingredient.name}` : ingredient.name}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Instructions</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{cocktail.instructions}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

CocktailDetails.propTypes = {
  cocktailId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CocktailDetails;
