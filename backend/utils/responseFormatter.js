/**
 * Standard API Response Formatter
 */

/**
 * Success response with data
 */
export const success = (data, message = 'Success', meta = null) => {
  const response = {
    success: true,
    message,
    data
  };

  if (meta) {
    response.meta = meta;
  }

  return response;
};

/**
 * Success response for creation
 */
export const created = (data, message = 'Resource created successfully') => {
  return {
    success: true,
    message,
    data,
    statusCode: 201
  };
};

/**
 * Success response with pagination
 */
export const paginated = (data, pagination) => {
  return {
    success: true,
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages: Math.ceil(pagination.total / pagination.limit),
      hasNext: pagination.page < Math.ceil(pagination.total / pagination.limit),
      hasPrev: pagination.page > 1
    }
  };
};

/**
 * Error response
 */
export const error = (message, statusCode = 500, details = null) => {
  const response = {
    success: false,
    error: {
      message,
      statusCode
    }
  };

  if (details) {
    response.error.details = details;
  }

  return response;
};

/**
 * Validation error response
 */
export const validationError = (errors) => {
  return {
    success: false,
    error: {
      message: 'Validation failed',
      statusCode: 400,
      details: errors
    }
  };
};

/**
 * Format user data (remove sensitive info)
 */
export const formatUser = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    age: user.age,
    education: user.education,
    createdAt: user.createdAt,
    lastActive: user.lastActive
  };
};

/**
 * Format profile data
 */
export const formatProfile = (profile) => {
  return {
    userId: profile.userId,
    behavioralTraits: profile.behavioralTraits,
    personality: profile.personality,
    ikigai: profile.ikigai,
    interests: profile.interests,
    updatedAt: profile.updatedAt
  };
};

/**
 * Format conversation data
 */
export const formatConversation = (conversation) => {
  return {
    id: conversation._id,
    userMessage: conversation.userMessage,
    aiResponse: conversation.aiResponse,
    sentiment: conversation.analysis?.sentiment,
    timestamp: conversation.timestamp
  };
};

/**
 * Format recommendation data
 */
export const formatRecommendation = (recommendation) => {
  return {
    id: recommendation._id,
    career: recommendation.careerTitle,
    matchScore: recommendation.matchScore,
    confidence: recommendation.confidenceScore,
    reasoning: recommendation.reasoning,
    skills: recommendation.requiredSkills,
    createdAt: recommendation.createdAt
  };
};
