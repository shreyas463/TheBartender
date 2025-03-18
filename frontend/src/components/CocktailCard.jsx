import { useState } from 'react';
import PropTypes from 'prop-types';
import CocktailDetails from './CocktailDetails';

const CocktailCard = ({ cocktail }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <div className="cocktail-card bg-white">
        <img 
          src={cocktail.image} 
          alt={cocktail.name}
          className="w-full h-48 object-cover"
        />
        <div className="p-6">
          <h3 className="mb-2">{cocktail.name}</h3>
          <p className="category mb-4">{cocktail.category}</p>
          <div className="flex items-center justify-between">
            <span className={`tag ${cocktail.alcoholic === 'Alcoholic' ? 'alcoholic' : 'non-alcoholic'}`}>
              {cocktail.alcoholic || 'Non-Alcoholic'}
            </span>
            <button 
              className="view-recipe"
              onClick={() => setShowDetails(true)}
            >
              View Recipe
            </button>
          </div>
        </div>
      </div>

      {showDetails && (
        <CocktailDetails
          cocktailId={cocktail.id}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  );
};

CocktailCard.propTypes = {
  cocktail: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string,
    category: PropTypes.string,
    alcoholic: PropTypes.string,
    glass: PropTypes.string,
    instructions: PropTypes.string.isRequired,
    ingredients: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      measure: PropTypes.string,
    })),
  }).isRequired,
};

export default CocktailCard;
