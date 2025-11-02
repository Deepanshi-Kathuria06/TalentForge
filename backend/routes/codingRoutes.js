import express from 'express';
import axios from 'axios';

const router = express.Router();

// ✅ LeetCode Problems via GraphQL
router.get('/leetcode', async (req, res) => {
  try {
    console.log('📡 Fetching LeetCode problems...');
    
    const response = await axios.post('https://leetcode.com/graphql', {
      query: `
        query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
          problemsetQuestionList: questionList(
            categorySlug: $categorySlug
            limit: $limit
            skip: $skip
            filters: $filters
          ) {
            total: totalNum
            questions: data {
              acRate
              difficulty
              frontendQuestionId: questionFrontendId
              isFavor
              paidOnly: isPaidOnly
              status
              title
              titleSlug
            }
          }
        }
      `,
      variables: {
        categorySlug: "",
        skip: 0,
        limit: 10,
        filters: {}
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });

    console.log('✅ LeetCode data received');
    res.json(response.data);
  } catch (error) {
    console.error('❌ LeetCode API error:', error.message);
    
    // Return mock LeetCode data
    const mockLeetCode = {
      data: {
        problemsetQuestionList: {
          questions: [
            {
              frontendQuestionId: "1",
              title: "Two Sum",
              difficulty: "Easy",
              acRate: 48.5,
              titleSlug: "two-sum"
            },
            {
              frontendQuestionId: "2",
              title: "Add Two Numbers",
              difficulty: "Medium", 
              acRate: 38.6,
              titleSlug: "add-two-numbers"
            },
            {
              frontendQuestionId: "3",
              title: "Longest Substring Without Repeating Characters",
              difficulty: "Medium",
              acRate: 33.8,
              titleSlug: "longest-substring-without-repeating-characters"
            }
          ]
        }
      }
    };
    
    res.json(mockLeetCode);
  }
});

// ✅ CodeChef Problems
router.get('/codechef', async (req, res) => {
  try {
    console.log('📡 Fetching CodeChef problems...');
    
    const response = await axios.get('https://www.codechef.com/api/list/problems', {
      params: {
        sort_by: 'Successfully_submitted',
        sort_order: 'desc',
        limit: 10
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      },
      timeout: 10000
    });

    console.log('✅ CodeChef data received');
    res.json(response.data);
  } catch (error) {
    console.error('❌ CodeChef API error:', error.message);
    
    // Return mock CodeChef data
    const mockCodeChef = {
      data: [
        {
          problem_code: "START01",
          problem_name: "Number Mirror",
          successful_submissions: "15000",
          accuracy: "45.2%",
          difficulty_rating: "100"
        },
        {
          problem_code: "FLOW001",
          problem_name: "Add Two Numbers", 
          successful_submissions: "12000",
          accuracy: "50.1%",
          difficulty_rating: "200"
        },
        {
          problem_code: "HS08TEST",
          problem_name: "ATM",
          successful_submissions: "10000", 
          accuracy: "40.5%",
          difficulty_rating: "300"
        }
      ]
    };
    
    res.json(mockCodeChef);
  }
});

// ✅ HackerRank Problems (Mock data)
router.get('/hackerrank', async (req, res) => {
  try {
    console.log('📡 Fetching HackerRank problems...');
    
    // HackerRank mock data
    const mockHackerRank = [
      {
        id: 1,
        title: "Solve Me First",
        difficulty: "Easy",
        domain: "Algorithms",
        points: 5,
        description: "Complete the function solveMeFirst to compute the sum of two integers."
      },
      {
        id: 2,
        title: "Simple Array Sum",
        difficulty: "Easy",
        domain: "Algorithms", 
        points: 10,
        description: "Given an array of integers, find the sum of its elements."
      },
      {
        id: 3,
        title: "Compare the Triplets",
        difficulty: "Easy",
        domain: "Algorithms",
        points: 10,
        description: "Compare two triplets and return their comparison points."
      }
    ];

    console.log('✅ HackerRank mock data sent');
    res.json(mockHackerRank);
  } catch (error) {
    console.error('❌ HackerRank error:', error.message);
    res.status(500).json({ error: 'Failed to fetch HackerRank problems' });
  }
});

// ✅ Competitive Programming API
router.get('/competitive', async (req, res) => {
  try {
    console.log('📡 Fetching from Competitive Coding API...');
    
    const response = await axios.get('https://competitive-coding-api.herokuapp.com/api/leetcode');
    console.log('✅ Competitive API data received');
    res.json(response.data);
  } catch (error) {
    console.error('❌ Competitive API error:', error.message);
    res.json({ status: 'success', data: [] });
  }
});

// ✅ Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Coding challenges API is working',
    timestamp: new Date().toISOString(),
    endpoints: [
      '/leetcode', 
      '/codechef', 
      '/hackerrank', 
      '/competitive'
    ]
  });
});

export default router;