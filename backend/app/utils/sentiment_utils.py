try:
    from textblob import TextBlob
    TEXTBLOB_AVAILABLE = True
except ImportError:
    TEXTBLOB_AVAILABLE = False
    print("Warning: TextBlob not available. Sentiment analysis will be disabled.")
import re

def clean_text(text):
    """Clean and preprocess text for sentiment analysis"""
    # Remove special characters and digits
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    # Convert to lowercase
    text = text.lower()
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def analyze_sentiment(text):
    """
    Analyze sentiment of text and return 'positive', 'negative', or 'neutral'
    """
    try:
        if not TEXTBLOB_AVAILABLE:
            # Fallback to neutral if TextBlob is not available
            return 'neutral'
            
        # Clean the text
        cleaned_text = clean_text(text)
        
        # Analyze sentiment using TextBlob
        analysis = TextBlob(cleaned_text)
        polarity = analysis.sentiment.polarity
        
        # Classify sentiment based on polarity score
        if polarity > 0.1:
            return 'positive'
        elif polarity < -0.1:
            return 'negative'
        else:
            return 'neutral'
            
    except Exception:
        # Fallback to neutral if analysis fails
        return 'neutral'