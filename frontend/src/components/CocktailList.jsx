import { useQuery, gql } from '@apollo/client';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import CocktailCard from './CocktailCard';

const GET_COCKTAILS = gql`
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

const CocktailList = ({ searchQuery, filters }) => {
  const [errorDetails, setErrorDetails] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);
  
  const { loading, error, data, refetch } = useQuery(GET_COCKTAILS, {
    variables: {
      search: searchQuery || 'margarita', // Default search to ensure we get results
    },
    onError: (error) => {
      const message = error.graphQLErrors?.[0]?.message || error.message;
      setErrorDetails(message);
      setIsRetrying(false);
    },
    onCompleted: () => {
      setErrorDetails(null);
      setIsRetrying(false);
    },
  });

  // Refetch when search query or filters change
  useEffect(() => {
    const doRefetch = async () => {
      try {
        await refetch({
          search: searchQuery || 'margarita',
          ...filters,
        });
      } catch (err) {
        const message = err.graphQLErrors?.[0]?.message || err.message;
        setErrorDetails(message);
        setIsRetrying(false);
      }
    };

    doRefetch();
  }, [searchQuery, filters.category, filters.isAlcoholic, refetch]);

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="loading-spinner mb-4"></div>
        <p className="text-gray-600">Mixing your cocktails...</p>
      </div>
    );
  }
  
  if (loading && data?.cocktails) {
    return (
      <div className="relative">
        <div className="opacity-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.cocktails.map((cocktail) => (
              <CocktailCard key={cocktail.id} cocktail={cocktail} />
            ))}
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (error || errorDetails) {
    return (
      <div className="text-center py-12">
        <div className="mb-8">
          <svg className="mx-auto h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="mt-4 text-xl font-semibold">Error Loading Cocktails</h3>
          <p className="mt-2 text-gray-600">We encountered an issue while fetching your cocktails.</p>
        </div>
        
        {errorDetails && (
          <details className="mt-6 text-sm text-left bg-red-50 p-6 rounded-xl mx-auto max-w-lg shadow-sm">
            <summary className="cursor-pointer font-medium text-red-800">Error Details</summary>
            <pre className="mt-3 whitespace-pre-wrap text-red-700 text-xs">{errorDetails}</pre>
          </details>
        )}
        
        <button 
          onClick={() => {
            setIsRetrying(true);
            refetch();
          }} 
          disabled={isRetrying}
          className="view-recipe mt-8"
        >
          {isRetrying ? (
            <span className="flex items-center">
              <div className="loading-spinner mr-2 !border-white !border-t-transparent"></div>
              Retrying...
            </span>
          ) : 'Try Again'}
        </button>
      </div>
    );
  }

  if (!data?.cocktails?.length) {
    return (
      <div className="text-center py-12">
        <div className="mb-8">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-4 text-xl font-semibold">No Cocktails Found</h3>
          <p className="mt-2 text-gray-600">
            {searchQuery 
              ? `We couldn't find any cocktails matching "${searchQuery}". Try a different search term.`
              : 'Try searching for your favorite cocktail!'}
          </p>
        </div>
        
        <button 
          onClick={() => refetch({ search: 'margarita' })} 
          className="view-recipe"
        >
          Show Popular Cocktails
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {data.cocktails.map((cocktail) => (
        <CocktailCard key={cocktail.id} cocktail={cocktail} />
      ))}
    </div>
  );
};

CocktailList.propTypes = {
  searchQuery: PropTypes.string,
  filters: PropTypes.shape({
    category: PropTypes.string,
    isAlcoholic: PropTypes.bool,
  }),
};

CocktailList.defaultProps = {
  searchQuery: '',
  filters: {},
};

export default CocktailList;
