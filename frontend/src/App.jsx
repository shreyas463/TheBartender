import { useState } from 'react'
import { ApolloProvider } from '@apollo/client'
import { client } from './lib/apollo'
import SearchBar from './components/SearchBar'
import CocktailList from './components/CocktailList'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    category: '',
    isAlcoholic: null,
  })

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  return (
    <ApolloProvider client={client}>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-16">
            <h1 className="text-5xl font-display font-bold mb-4 bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
              TheBartender
            </h1>
            <p className="text-xl text-gray-600 font-light">
              Discover and explore amazing cocktail recipes
            </p>
          </header>

          <SearchBar onSearch={handleSearch} />

          <div className="mb-12 flex flex-wrap justify-center gap-4">
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="bg-white rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 shadow-card hover:shadow-card-hover transition-shadow cursor-pointer outline-none focus:ring-2 focus:ring-primary-500 min-w-[160px]"
            >
              <option value="">All Categories</option>
              <option value="Cocktail">Cocktails</option>
              <option value="Shot">Shots</option>
              <option value="Punch">Punch</option>
            </select>

            <select
              value={filters.isAlcoholic === null ? '' : filters.isAlcoholic.toString()}
              onChange={(e) => setFilters({
                ...filters,
                isAlcoholic: e.target.value === '' ? null : e.target.value === 'true'
              })}
              className="bg-white rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 shadow-card hover:shadow-card-hover transition-shadow cursor-pointer outline-none focus:ring-2 focus:ring-primary-500 min-w-[160px]"
            >
              <option value="">All Types</option>
              <option value="true">Alcoholic</option>
              <option value="false">Non-Alcoholic</option>
            </select>
          </div>

          <div className="container mx-auto px-4">
            <CocktailList searchQuery={searchQuery} filters={filters} />
          </div>
        </div>
      </div>
    </ApolloProvider>
  )
}

export default App
