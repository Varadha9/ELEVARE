"""
Response formatting utilities for consistent API responses
"""
from datetime import datetime
from typing import Any, Dict, Optional

def success_response(
    data: Any,
    message: str = "Success",
    meta: Optional[Dict] = None
) -> Dict:
    """
    Format successful response
    
    Args:
        data: Response data
        message: Success message
        meta: Optional metadata
    
    Returns:
        Formatted response dictionary
    """
    response = {
        "success": True,
        "message": message,
        "data": data,
        "timestamp": datetime.now().isoformat()
    }
    
    if meta:
        response["meta"] = meta
    
    return response

def error_response(
    message: str,
    details: Optional[Any] = None,
    error_code: Optional[str] = None
) -> Dict:
    """
    Format error response
    
    Args:
        message: Error message
        details: Optional error details
        error_code: Optional error code
    
    Returns:
        Formatted error response
    """
    response = {
        "success": False,
        "error": {
            "message": message,
            "timestamp": datetime.now().isoformat()
        }
    }
    
    if details:
        response["error"]["details"] = details
    
    if error_code:
        response["error"]["code"] = error_code
    
    return response

def format_nlp_analysis(analysis: Dict) -> Dict:
    """Format NLP analysis results"""
    return {
        "sentiment": analysis.get("sentiment", "neutral"),
        "emotions": analysis.get("emotions", []),
        "keywords": analysis.get("keywords", []),
        "detectedTraits": [
            {"trait": k, "value": v}
            for k, v in analysis.get("detectedTraits", {}).items()
        ],
        "personalitySignals": analysis.get("personalitySignals", {})
    }

def format_recommendation(rec: Dict) -> Dict:
    """Format recommendation data"""
    return {
        "career": rec.get("careerTitle"),
        "category": rec.get("careerCategory"),
        "confidence": round(rec.get("confidenceScore", 0), 1),
        "explanation": rec.get("explanation", {}),
        "details": rec.get("careerDetails", {})
    }
