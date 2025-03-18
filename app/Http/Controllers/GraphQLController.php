<?php

namespace App\Http\Controllers;

use App\GraphQL\Schema;
use App\Services\CocktailApiService;
use GraphQL\GraphQL;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class GraphQLController extends Controller
{
    protected $cocktailService;

    public function __construct(CocktailApiService $cocktailService)
    {
        $this->cocktailService = $cocktailService;
    }

    public function __invoke(Request $request)
    {
        // Handle preflight OPTIONS request
        if ($request->isMethod('OPTIONS')) {
            return $this->setCorsHeaders(response(null, 204));
        }

        try {
            // Handle both GET and POST methods
            if ($request->isMethod('GET')) {
                $query = $request->query('query');
                $variables = json_decode($request->query('variables', '{}'), true);
                $operationName = $request->query('operationName');
            } else {
                $input = $request->json()->all();
                $query = $input['query'] ?? null;
                $variables = $input['variables'] ?? [];
                $operationName = $input['operationName'] ?? null;
            }

            if (!$query) {
                throw new \Exception('No GraphQL query provided');
            }

            $schema = Schema::build();
            $result = GraphQL::executeQuery(
                $schema,
                $query,
                null,
                ['cocktailService' => $this->cocktailService],
                $variables,
                $operationName
            );
            
            return $this->setCorsHeaders(response()->json($result->toArray()));

        } catch (\Exception $e) {
            Log::error('GraphQL Error: ' . $e->getMessage());

            return $this->setCorsHeaders(response()->json([
                'errors' => [
                    [
                        'message' => 'An error occurred while processing your request.',
                        'extensions' => [
                            'code' => 'INTERNAL_SERVER_ERROR',
                            'details' => $e->getMessage()
                        ]
                    ]
                ]
            ], 500));
        }
    }

    public function options()
    {
        return $this->setCorsHeaders(response(null, 204));
    }

    /**
     * Set CORS headers for all responses
     *
     * @param \Illuminate\Http\Response $response
     * @return \Illuminate\Http\Response
     */
    private function setCorsHeaders($response)
    {
        return $response
            ->header('Access-Control-Allow-Origin', 'http://localhost:5173') // Specifically allow our frontend
            ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, X-CSRF-TOKEN')
            ->header('Access-Control-Allow-Credentials', 'true')
            ->header('Access-Control-Max-Age', '86400'); // 24 hours
    }
}
