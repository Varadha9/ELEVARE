"""
Error handling utilities for AI services
"""
from functools import wraps
from fastapi import HTTPException
import logging

logger = logging.getLogger(__name__)

class AIServiceError(Exception):
    """Base exception for AI services"""
    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)

class NLPProcessingError(AIServiceError):
    """NLP processing failed"""
    def __init__(self, message: str = "NLP processing failed"):
        super().__init__(message, 500)

class RecommendationError(AIServiceError):
    """Recommendation generation failed"""
    def __init__(self, message: str = "Recommendation generation failed"):
        super().__init__(message, 500)

class ValidationError(AIServiceError):
    """Input validation failed"""
    def __init__(self, message: str = "Validation failed"):
        super().__init__(message, 400)

class DatabaseError(AIServiceError):
    """Database operation failed"""
    def __init__(self, message: str = "Database operation failed"):
        super().__init__(message, 500)

def handle_service_error(func):
    """Decorator for handling service errors"""
    @wraps(func)
    async def wrapper(*args, **kwargs):
        try:
            return await func(*args, **kwargs)
        except AIServiceError as e:
            logger.error(f"AI Service Error in {func.__name__}: {str(e)}")
            raise HTTPException(status_code=e.status_code, detail=str(e))
        except Exception as e:
            logger.error(f"Unexpected error in {func.__name__}: {str(e)}", exc_info=True)
            raise HTTPException(status_code=500, detail="Internal server error")
    return wrapper

def safe_execute(func, default=None, error_message="Operation failed"):
    """Safely execute a function with error handling"""
    try:
        return func()
    except Exception as e:
        logger.error(f"{error_message}: {str(e)}")
        return default
