// services/codingApiService.js

class CodingApiService {
  constructor() {
    this.baseUrls = {
      leetcode: 'https://leetcode.com/graphql',
      codechef: 'https://www.codechef.com/api',
      cpApi: 'https://competitive-coding-api.herokuapp.com/api'
    };
  }

  // LeetCode API Methods
  async fetchLeetCodeProblems(limit = 50, difficulty = '') {
    try {
      const query = `
        query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
          problemsetQuestionList(
            categorySlug: $categorySlug
            limit: $limit
            skip: $skip
            filters: $filters
          ) {
            total
            questions {
              acRate
              difficulty
              freqBar
              frontendQuestionId
              isFavor
              paidOnly
              status
              title
              titleSlug
              topicTags {
                name
                id
                slug
              }
            }
          }
        }
      `;

      const variables = {
        categorySlug: "",
        limit: limit,
        skip: 0,
        filters: difficulty ? { difficulty } : {}
      };

      const response = await fetch(this.baseUrls.leetcode, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, variables }),
      });

      const data = await response.json();
      return this.transformLeetCodeProblems(data.data.problemsetQuestionList.questions);
    } catch (error) {
      console.error('Error fetching LeetCode problems:', error);
      return this.getFallbackLeetCodeProblems();
    }
  }

  async fetchLeetCodeProblem(titleSlug) {
    try {
      const query = `
        query questionData($titleSlug: String!) {
          question(titleSlug: $titleSlug) {
            questionId
            questionFrontendId
            title
            titleSlug
            content
            difficulty
            exampleTestcases
            codeSnippets {
              lang
              langSlug
              code
            }
            sampleTestCase
            metaData
          }
        }
      `;

      const response = await fetch(this.baseUrls.leetcode, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query, 
          variables: { titleSlug } 
        }),
      });

      const data = await response.json();
      return this.transformLeetCodeProblem(data.data.question);
    } catch (error) {
      console.error('Error fetching LeetCode problem:', error);
      return this.getFallbackProblem(titleSlug);
    }
  }

  // CodeChef API Methods
  async fetchCodeChefProblems() {
    try {
      const response = await fetch(`${this.baseUrls.codechef}/list/problems?sort_by=Successfully_submitted&sort_order=desc`);
      const data = await response.json();
      return this.transformCodeChefProblems(data.data);
    } catch (error) {
      console.error('Error fetching CodeChef problems:', error);
      return this.getFallbackCodeChefProblems();
    }
  }

  // Competitive Programming API Methods
  async fetchProblemsFromCP(platform) {
    try {
      const response = await fetch(`${this.baseUrls.cpApi}/${platform}`);
      const data = await response.json();
      return this.transformCPProblems(data, platform);
    } catch (error) {
      console.error(`Error fetching ${platform} problems:`, error);
      return this.getFallbackProblems(platform);
    }
  }

  // Data Transformation Methods
  transformLeetCodeProblems(problems) {
    return problems.map(problem => ({
      id: `leetcode-${problem.frontendQuestionId}`,
      title: problem.title,
      difficulty: problem.difficulty.toLowerCase(),
      tags: problem.topicTags.map(tag => tag.name),
      platform: 'leetcode',
      acceptance: `${Math.round(problem.acRate)}%`,
      premium: problem.paidOnly,
      solved: problem.status === 'ac',
      frequency: problem.freqBar || 'Medium',
      points: this.calculatePoints(problem.difficulty),
      description: '',
      url: `https://leetcode.com/problems/${problem.titleSlug}/`
    }));
  }

  transformLeetCodeProblem(problem) {
    return {
      id: `leetcode-${problem.questionFrontendId}`,
      title: problem.title,
      difficulty: problem.difficulty.toLowerCase(),
      description: problem.content,
      starterCode: this.extractStarterCode(problem.codeSnippets),
      testCases: this.parseTestCases(problem.exampleTestcases),
      constraints: this.extractConstraints(problem.content),
      platform: 'leetcode'
    };
  }

  transformCodeChefProblems(problems) {
    return problems.map(problem => ({
      id: `codechef-${problem.code}`,
      title: problem.name,
      difficulty: this.mapCodeChefDifficulty(problem.difficulty),
      tags: [], // CodeChef API doesn't provide tags easily
      platform: 'codechef',
      acceptance: problem.accuracy ? `${problem.accuracy}%` : 'N/A',
      premium: false,
      solved: problem.user_status && problem.user_status === 'accepted',
      frequency: 'Medium',
      points: problem.difficulty_rating || 10,
      description: '',
      url: `https://www.codechef.com/problems/${problem.code}`
    }));
  }

  // Helper Methods
  extractStarterCode(codeSnippets) {
    const snippets = {};
    if (codeSnippets) {
      codeSnippets.forEach(snippet => {
        snippets[snippet.langSlug] = snippet.code;
      });
    }
    
    // Fallback starter code
    return {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // Your code here
    
};`,
      python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Your code here
        pass`
    };
  }

  parseTestCases(exampleTestcases) {
    if (!exampleTestcases) return [];
    
    try {
      const testCases = [];
      const lines = exampleTestcases.split('\n');
      
      for (let i = 0; i < lines.length; i += 2) {
        if (lines[i] && lines[i + 1]) {
          testCases.push({
            input: JSON.parse(lines[i]),
            output: JSON.parse(lines[i + 1])
          });
        }
      }
      return testCases;
    } catch (error) {
      console.error('Error parsing test cases:', error);
      return [];
    }
  }

  extractConstraints(content) {
    // Extract constraints from HTML content
    const constraintMatch = content.match(/<strong>Constraints:<\/strong>([\s\S]*?)(?=<br>|$)/);
    return constraintMatch ? constraintMatch[1].trim() : '';
  }

  calculatePoints(difficulty) {
    const pointsMap = {
      'Easy': 10,
      'Medium': 15,
      'Hard': 25
    };
    return pointsMap[difficulty] || 10;
  }

  mapCodeChefDifficulty(difficulty) {
    const rating = parseInt(difficulty);
    if (rating <= 3) return 'easy';
    if (rating <= 6) return 'medium';
    return 'hard';
  }

  // Fallback data
  getFallbackLeetCodeProblems() {
    return [
      {
        id: 'leetcode-1',
        title: 'Two Sum',
        difficulty: 'easy',
        tags: ['Array', 'Hash Table'],
        platform: 'leetcode',
        acceptance: '52.3%',
        premium: false,
        solved: false,
        frequency: 'High',
        points: 10
      },
      // Add more fallback problems...
    ];
  }

  getFallbackProblem(titleSlug) {
    // Return a basic problem structure
    return {
      id: `leetcode-${Date.now()}`,
      title: titleSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      difficulty: 'medium',
      description: 'Problem description not available.',
      starterCode: {
        javascript: '// Code not available',
        python: '# Code not available'
      },
      testCases: [],
      platform: 'leetcode'
    };
  }
}

export default new CodingApiService();