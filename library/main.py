from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import PyPDF2
import docx
import io

app = FastAPI(title="ATS Checker API", version="1.0.0")

# Update CORS middleware to allow your React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5178",  # Your React dev server
        "http://localhost:5173",  # Common Vite port
        "http://localhost:3000",  # Common Create React App port
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Download required NLTK data
nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('punkt')

class ATSChecker:
    def __init__(self):
        self.stop_words = set(stopwords.words('english'))
        self.lemmatizer = WordNetLemmatizer()
        
        # Common ATS-friendly and unfriendly elements
        self.ats_friendly_elements = [
            "standard headings", "clean formatting", "simple fonts", 
            "keyword optimization", "bullet points", "reverse chronological order",
            "contact information", "skills section", "quantifiable achievements"
        ]
        
        self.ats_unfriendly_elements = [
            "tables", "columns", "graphics", "images", "fancy fonts",
            "headers/footers", "text boxes", "uncommon section headings",
            "abbreviations", "icons/symbols"
        ]
        
        # Common important resume sections
        self.important_sections = [
            "experience", "work history", "education", "skills", 
            "summary", "objective", "projects", "certifications",
            "languages", "achievements"
        ]
        
        # Common resume keywords for different fields
        self.common_keywords = [
            "python", "java", "javascript", "react", "node", "sql", "database",
            "aws", "docker", "kubernetes", "git", "jenkins", "ci/cd",
            "machine learning", "ai", "data analysis", "statistics",
            "project management", "leadership", "team", "communication",
            "problem solving", "analytical", "agile", "scrum",
            "html", "css", "typescript", "angular", "vue", "rest", "api",
            "mongodb", "mysql", "postgresql", "redis", "elasticsearch",
            "linux", "windows", "macos", "cloud", "azure", "gcp"
        ]
    
    def extract_text_from_pdf(self, file_content):
        """Extract text from PDF resume"""
        text = ""
        try:
            pdf_file = io.BytesIO(file_content)
            reader = PyPDF2.PdfReader(pdf_file)
            for page in reader.pages:
                text += page.extract_text() + "\n"
        except Exception as e:
            print(f"Error reading PDF: {e}")
        return text
    
    def extract_text_from_docx(self, file_content):
        """Extract text from DOCX resume"""
        text = ""
        try:
            doc_file = io.BytesIO(file_content)
            doc = docx.Document(doc_file)
            for para in doc.paragraphs:
                text += para.text + "\n"
        except Exception as e:
            print(f"Error reading DOCX: {e}")
        return text
    
    def preprocess_text(self, text):
        """Clean and preprocess text"""
        # Convert to lowercase
        text = text.lower()
        
        # Remove special characters and numbers (keep only letters and spaces)
        text = re.sub(r'[^a-zA-Z\s]', ' ', text)
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        
        return text
    
    def extract_keywords(self, text):
        """Extract important keywords using simple text processing"""
        # Preprocess text
        cleaned_text = self.preprocess_text(text)
        
        # Tokenize
        words = cleaned_text.split()
        
        # Filter and lemmatize
        keywords = []
        for word in words:
            if (word not in self.stop_words and 
                len(word) > 2 and
                word in self.common_keywords):
                
                # Lemmatize the word
                lemma = self.lemmatizer.lemmatize(word)
                keywords.append(lemma)
        
        return list(set(keywords))  # Remove duplicates
    
    def check_ats_compatibility(self, text):
        """Check ATS compatibility based on various factors"""
        score = 100  # Start with perfect score
        
        # Check for important sections
        section_score = self.check_sections(text)
        score = min(score, section_score)
        
        # Check for ATS-unfriendly elements
        unfriendly_score = self.check_unfriendly_elements(text)
        score = min(score, unfriendly_score)
        
        # Check keyword density
        keyword_score = self.check_keyword_density(text)
        score = min(score, keyword_score)
        
        # Check length and structure
        structure_score = self.check_structure(text)
        score = min(score, structure_score)
        
        return max(0, score)  # Ensure score doesn't go below 0
    
    def check_sections(self, text):
        """Check if important resume sections are present"""
        score = 100
        found_sections = []
        
        for section in self.important_sections:
            if re.search(rf'\b{section}\b', text, re.IGNORECASE):
                found_sections.append(section)
        
        # Calculate score based on found sections
        section_ratio = len(found_sections) / len(self.important_sections)
        score = int(60 + (40 * section_ratio))  # 60-100 range
        
        return score
    
    def check_unfriendly_elements(self, text):
        """Check for ATS-unfriendly elements"""
        score = 100
        
        # Check for common unfriendly elements (indirectly)
        if re.search(r'\btable\b|\bcolumn\b|\bgraphic\b|\bimage\b', text, re.IGNORECASE):
            score -= 20
        
        # Check for complex formatting indicators
        formatting_indicators = re.findall(r'[^a-zA-Z0-9\s.,;:!?]', text)
        if len(formatting_indicators) > 50:  # Too many special characters
            score -= 15
        
        return max(60, score)  # Don't go below 60
    
    def check_keyword_density(self, text):
        """Check if resume has good keyword density"""
        keywords = self.extract_keywords(text)
        word_count = len(text.split())
        
        if word_count == 0:
            return 50
        
        keyword_density = (len(keywords) / word_count) * 100
        
        # Score based on keyword density (ideal is 2-5%)
        if keyword_density < 1:
            return 60
        elif keyword_density < 2:
            return 75
        elif keyword_density <= 5:
            return 90
        else:
            return 85  # Slightly lower if too dense (might be keyword stuffing)
    
    def check_structure(self, text):
        """Check resume structure and length"""
        score = 100
        word_count = len(text.split())
        line_count = len(text.split('\n'))
        
        # Check length (ideal resume is 400-800 words)
        if word_count < 300:
            score -= 20  # Too short
        elif word_count > 1000:
            score -= 15  # Too long
        
        # Check for bullet points (good structure indicator)
        bullet_points = text.count('•') + text.count('-') + text.count('*')
        if bullet_points < 5:
            score -= 10
        
        return score
    
    def generate_analysis(self, text):
        """Generate comprehensive ATS analysis"""
        # Calculate ATS score
        ats_score = self.check_ats_compatibility(text)
        
        # Determine compatibility level
        if ats_score >= 85:
            compatibility = "Excellent"
        elif ats_score >= 70:
            compatibility = "Good"
        elif ats_score >= 60:
            compatibility = "Fair"
        else:
            compatibility = "Poor"
        
        # Extract keywords for analysis
        keywords = self.extract_keywords(text)
        
        # Generate strengths
        strengths = []
        if ats_score >= 70:
            strengths.append("Good overall structure and formatting")
        if len(keywords) >= 10:
            strengths.append("Good keyword usage relevant to tech roles")
        if "experience" in text.lower() and "education" in text.lower():
            strengths.append("Contains essential sections")
        if text.count('•') + text.count('-') > 5:
            strengths.append("Good use of bullet points")
        
        # Generate improvements
        improvements = []
        if ats_score < 85:
            improvements.append("Optimize keyword density (aim for 2-5%)")
        if "summary" not in text.lower() and "objective" not in text.lower():
            improvements.append("Add a professional summary or objective")
        if len(text.split()) < 400:
            improvements.append("Expand on your experience and achievements")
        if len(keywords) < 10:
            improvements.append("Include more industry-specific keywords")
        
        # Get top keywords for display
        top_keywords = keywords[:15] if len(keywords) > 15 else keywords
        keyword_matches = [{"word": kw, "match": True} for kw in top_keywords]
        
        return {
            "score": ats_score,
            "atsCompatibility": compatibility,
            "strengths": strengths,
            "improvements": improvements,
            "keywordMatches": keyword_matches,
            "keywordsFound": len(keywords)
        }
    
    def analyze_resume(self, file_content, file_extension):
        """Main analysis function"""
        # Extract text based on file type
        if file_extension == 'pdf':
            resume_text = self.extract_text_from_pdf(file_content)
        elif file_extension in ['doc', 'docx']:
            resume_text = self.extract_text_from_docx(file_content)
        else:
            resume_text = file_content.decode('utf-8')
        
        if not resume_text.strip():
            return {"error": "Could not extract text from resume"}
        
        # Generate ATS analysis
        return self.generate_analysis(resume_text)

# Initialize the ATS checker
ats_checker = ATSChecker()

@app.post("/analyze/")
async def analyze_resume(file: UploadFile = File(...)):
    try:
        # Read file content
        contents = await file.read()
        file_extension = file.filename.split('.')[-1].lower()
        
        # Analyze the resume
        result = ats_checker.analyze_resume(contents, file_extension)
        
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@app.get("/")
async def root():
    return {"message": "ATS Checker API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ATS Checker API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)