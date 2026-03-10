# Contributing to ELEVARE

Thank you for your interest in contributing to ELEVARE! This document provides guidelines and information for contributors.

## 🎯 How to Contribute

### Types of Contributions

We welcome various types of contributions:

- 🐛 **Bug Reports** - Help us identify and fix issues
- ✨ **Feature Requests** - Suggest new functionality
- 📝 **Documentation** - Improve or add documentation
- 🔧 **Code Contributions** - Bug fixes, features, optimizations
- 🧪 **Testing** - Add or improve test coverage
- 🎨 **UI/UX Improvements** - Enhance user experience
- 🌐 **Translations** - Add multi-language support

### Getting Started

1. **Fork the Repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/ELEVARE.git
   cd ELEVARE
   ```

2. **Set Up Development Environment**
   ```bash
   # Follow the installation guide
   .\setup.bat
   ```

3. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-number
   ```

---

## 📋 Development Guidelines

### Code Style

**JavaScript/Node.js:**
- Use ES6+ features
- Follow ESLint configuration
- Use meaningful variable names
- Add JSDoc comments for functions
- Maximum line length: 100 characters

```javascript
/**
 * Analyzes user message for behavioral traits
 * @param {string} message - User's message
 * @param {Object} userProfile - User's profile data
 * @returns {Object} Analysis results with trait scores
 */
async function analyzeMessage(message, userProfile) {
  // Implementation
}
```

**Python:**
- Follow PEP 8 style guide
- Use type hints where appropriate
- Add docstrings for functions and classes
- Maximum line length: 88 characters (Black formatter)

```python
def analyze_behavioral_traits(
    message: str, 
    user_profile: Dict[str, Any]
) -> Dict[str, float]:
    """
    Analyze behavioral traits from user message.
    
    Args:
        message: User's input message
        user_profile: User's profile data
        
    Returns:
        Dictionary with trait scores
    """
    # Implementation
```

**React/Frontend:**
- Use functional components with hooks
- Follow component naming conventions
- Use TypeScript where possible
- Implement proper error boundaries

```jsx
/**
 * Chat component for user interactions
 */
const Chat = ({ userId, onMessageSent }) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Implementation
};
```

### Commit Messages

Follow conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(chat): add real-time message streaming
fix(auth): resolve JWT token expiration issue
docs(api): update authentication endpoints
test(backend): add user registration tests
```

### Branch Naming

- `feature/feature-name` - New features
- `fix/issue-number` - Bug fixes
- `docs/documentation-update` - Documentation
- `refactor/component-name` - Code refactoring
- `test/test-description` - Testing improvements

---

## 🧪 Testing Guidelines

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# AI service tests
cd ai-services
python -m pytest

# Integration tests
npm run test:integration
```

### Writing Tests

**Backend (Jest):**
```javascript
// tests/auth.test.js
describe('Authentication', () => {
  test('should register new user successfully', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      age: 22,
      education: 'undergraduate'
    };
    
    const response = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(201);
      
    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe(userData.email);
  });
});
```

**Frontend (React Testing Library):**
```jsx
// tests/Chat.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import Chat from '../components/Chat';

test('sends message when form is submitted', async () => {
  const mockOnMessageSent = jest.fn();
  
  render(<Chat onMessageSent={mockOnMessageSent} />);
  
  const input = screen.getByPlaceholderText('Type your message...');
  const button = screen.getByText('Send');
  
  fireEvent.change(input, { target: { value: 'Test message' } });
  fireEvent.click(button);
  
  expect(mockOnMessageSent).toHaveBeenCalledWith('Test message');
});
```

**AI Services (pytest):**
```python
# tests/test_nlp_processor.py
import pytest
from services.nlp_processor import NLPProcessor

class TestNLPProcessor:
    def setup_method(self):
        self.processor = NLPProcessor()
    
    def test_sentiment_analysis(self):
        message = "I love working on this project!"
        result = self.processor.analyze_sentiment(message)
        
        assert result['sentiment'] > 0.5
        assert 'positive' in result['classification']
```

### Test Coverage

Maintain minimum test coverage:
- **Backend**: 80%
- **Frontend**: 70%
- **AI Services**: 75%

```bash
# Check coverage
npm run test:coverage
python -m pytest --cov=services --cov-report=html
```

---

## 📝 Documentation Standards

### Code Documentation

**JSDoc for JavaScript:**
```javascript
/**
 * Generates career recommendations for a user
 * @async
 * @param {string} userId - User's unique identifier
 * @param {Object} options - Generation options
 * @param {number} options.limit - Maximum recommendations to return
 * @param {boolean} options.includeReasoning - Include explanation
 * @returns {Promise<Object>} Recommendation results
 * @throws {ValidationError} When userId is invalid
 * @example
 * const recommendations = await generateRecommendations('user123', {
 *   limit: 5,
 *   includeReasoning: true
 * });
 */
```

**Docstrings for Python:**
```python
def generate_recommendations(
    user_id: str, 
    limit: int = 10, 
    include_reasoning: bool = True
) -> Dict[str, Any]:
    """
    Generate career recommendations for a user.
    
    Args:
        user_id: User's unique identifier
        limit: Maximum number of recommendations (default: 10)
        include_reasoning: Whether to include explanation (default: True)
        
    Returns:
        Dictionary containing recommendations and metadata
        
    Raises:
        ValueError: If user_id is invalid
        
    Example:
        >>> recommendations = generate_recommendations('user123', limit=5)
        >>> print(recommendations['careers'][0]['title'])
        'Software Engineer'
    """
```

### README Updates

When adding new features, update relevant README sections:
- Installation instructions
- Usage examples
- API documentation
- Configuration options

### API Documentation

Update API documentation for new endpoints:

```markdown
### New Endpoint

**Description:** Brief description of what the endpoint does

**URL:** `POST /api/new-endpoint`

**Authentication:** Required

**Request Body:**
```json
{
  "parameter": "value",
  "optional_param": "optional_value"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "result": "value"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid parameters
- `401 Unauthorized` - Authentication required
```

---

## 🔍 Code Review Process

### Submitting Pull Requests

1. **Ensure your branch is up to date:**
   ```bash
   git checkout main
   git pull upstream main
   git checkout your-branch
   git rebase main
   ```

2. **Run all tests:**
   ```bash
   npm run test:all
   ```

3. **Create pull request with:**
   - Clear title and description
   - Reference related issues
   - Screenshots for UI changes
   - Test coverage information

### Pull Request Template

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Related Issues
Fixes #123
Related to #456

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
[Add screenshots for UI changes]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] No breaking changes
```

### Review Criteria

**Code Quality:**
- Follows coding standards
- Proper error handling
- Efficient algorithms
- Security considerations

**Testing:**
- Adequate test coverage
- Tests are meaningful
- Edge cases covered

**Documentation:**
- Code is well-documented
- API changes documented
- README updated if needed

**Performance:**
- No performance regressions
- Efficient database queries
- Proper caching where applicable

---

## 🐛 Bug Reports

### Before Reporting

1. **Search existing issues** to avoid duplicates
2. **Try the latest version** to see if it's already fixed
3. **Check documentation** for proper usage

### Bug Report Template

```markdown
**Bug Description**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. Windows 10, macOS 12.0, Ubuntu 20.04]
- Browser: [e.g. Chrome 96, Firefox 95]
- Node.js Version: [e.g. 18.12.0]
- Python Version: [e.g. 3.9.7]

**Additional Context**
Any other context about the problem.

**Logs**
```
Paste relevant log output here
```
```

---

## ✨ Feature Requests

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Alternative solutions or features you've considered.

**Additional context**
Any other context or screenshots about the feature request.

**Implementation Ideas**
If you have ideas about how to implement this feature.
```

### Feature Development Process

1. **Discussion** - Feature request is discussed and approved
2. **Design** - Technical design and API specification
3. **Implementation** - Code development with tests
4. **Review** - Code review and testing
5. **Documentation** - Update documentation
6. **Release** - Include in next release

---

## 🏗️ Architecture Guidelines

### Adding New Features

**Backend API Endpoints:**
1. Create route in `routes/` directory
2. Implement controller in `controllers/` directory
3. Add validation middleware if needed
4. Update API documentation
5. Add comprehensive tests

**Frontend Components:**
1. Create component in appropriate directory
2. Follow existing component patterns
3. Add proper TypeScript types
4. Implement error boundaries
5. Add unit tests

**AI Services:**
1. Create service in `services/` directory
2. Follow existing service patterns
3. Add proper error handling
4. Update service registry
5. Add comprehensive tests

### Database Changes

**Schema Updates:**
1. Create migration script
2. Update model definitions
3. Add proper indexes
4. Test with sample data
5. Document changes

**Example Migration:**
```javascript
// migrations/001_add_user_preferences.js
async function up(db) {
  await db.collection('users').updateMany(
    {},
    { $set: { preferences: {} } }
  );
  
  await db.collection('users').createIndex({ 'preferences.theme': 1 });
}

async function down(db) {
  await db.collection('users').updateMany(
    {},
    { $unset: { preferences: "" } }
  );
}
```

---

## 🔐 Security Guidelines

### Security Considerations

**Input Validation:**
- Validate all user inputs
- Sanitize data before database operations
- Use parameterized queries
- Implement rate limiting

**Authentication & Authorization:**
- Use secure JWT implementation
- Implement proper session management
- Follow principle of least privilege
- Regular security audits

**Data Protection:**
- Encrypt sensitive data
- Use HTTPS in production
- Implement proper CORS
- Regular dependency updates

### Reporting Security Issues

**DO NOT** create public issues for security vulnerabilities.

Instead, email security@elevare.com with:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

---

## 📊 Performance Guidelines

### Performance Considerations

**Database:**
- Use appropriate indexes
- Optimize query patterns
- Implement connection pooling
- Monitor query performance

**API:**
- Implement caching where appropriate
- Use pagination for large datasets
- Optimize response payloads
- Monitor response times

**Frontend:**
- Implement code splitting
- Optimize bundle sizes
- Use lazy loading
- Implement proper caching

### Performance Testing

```bash
# Load testing with Artillery
npm install -g artillery
artillery run performance-tests/api-load-test.yml

# Frontend performance with Lighthouse
npm install -g lighthouse
lighthouse http://localhost:3000 --output html --output-path ./lighthouse-report.html
```

---

## 🌐 Internationalization (i18n)

### Adding Translations

**Frontend (React):**
```jsx
// locales/en.json
{
  "chat.placeholder": "Type your message...",
  "chat.send": "Send",
  "dashboard.title": "Your Career Journey"
}

// Component usage
import { useTranslation } from 'react-i18next';

const Chat = () => {
  const { t } = useTranslation();
  
  return (
    <input placeholder={t('chat.placeholder')} />
  );
};
```

**Backend (i18next):**
```javascript
// locales/en/common.json
{
  "errors.validation": "Validation failed",
  "success.user_created": "User created successfully"
}

// Usage in controllers
res.json({
  message: req.t('success.user_created')
});
```

---

## 📦 Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

**Pre-release:**
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Version numbers updated
- [ ] Changelog updated
- [ ] Security audit completed

**Release:**
- [ ] Create release branch
- [ ] Final testing
- [ ] Create GitHub release
- [ ] Deploy to production
- [ ] Monitor deployment

**Post-release:**
- [ ] Verify deployment
- [ ] Update documentation site
- [ ] Announce release
- [ ] Monitor for issues

---

## 🤝 Community Guidelines

### Code of Conduct

We are committed to providing a welcoming and inclusive environment:

- **Be respectful** - Treat everyone with respect and kindness
- **Be inclusive** - Welcome people of all backgrounds and experience levels
- **Be collaborative** - Work together towards common goals
- **Be constructive** - Provide helpful feedback and suggestions
- **Be patient** - Help others learn and grow

### Communication Channels

- **GitHub Issues** - Bug reports and feature requests
- **GitHub Discussions** - General questions and discussions
- **Discord** - Real-time chat and community support
- **Email** - Direct contact for sensitive issues

### Recognition

Contributors will be recognized in:
- README contributors section
- Release notes
- Annual contributor highlights
- Special contributor badges

---

## 📚 Resources

### Learning Resources

**JavaScript/Node.js:**
- [MDN Web Docs](https://developer.mozilla.org/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/guide/)

**React:**
- [React Documentation](https://reactjs.org/docs/)
- [React Testing Library](https://testing-library.com/react)

**Python:**
- [Python Documentation](https://docs.python.org/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [pytest Documentation](https://docs.pytest.org/)

**MongoDB:**
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)

### Development Tools

**Recommended Extensions (VS Code):**
- ESLint
- Prettier
- Python
- MongoDB for VS Code
- GitLens
- Thunder Client (API testing)

**Useful Commands:**
```bash
# Format code
npm run format
python -m black .

# Lint code
npm run lint
python -m flake8

# Type checking
npm run type-check
python -m mypy .
```

---

## ❓ Getting Help

### Before Asking for Help

1. Check existing documentation
2. Search GitHub issues
3. Review code examples
4. Try debugging steps

### How to Ask for Help

**Provide Context:**
- What you're trying to achieve
- What you've already tried
- Error messages (full stack traces)
- Environment details
- Relevant code snippets

**Good Example:**
```
I'm trying to implement a new behavioral trait analysis feature. 

**Goal:** Add "resilience" as a new trait to track

**What I've tried:**
1. Added trait to the schema
2. Updated the analysis algorithm
3. Added frontend display

**Issue:** The trait score is always returning 0

**Error:** No errors in logs, but the calculation seems wrong

**Environment:** 
- Node.js 18.12.0
- Python 3.9.7
- Local development setup

**Code:**
[Include relevant code snippets]
```

### Response Time Expectations

- **Bug reports**: 1-3 business days
- **Feature requests**: 1 week for initial response
- **Questions**: 1-2 business days
- **Security issues**: 24 hours

---

## 🎉 Thank You!

Thank you for contributing to ELEVARE! Your contributions help make career discovery more accessible and effective for students worldwide.

**Happy coding!** 🚀

---

## 📞 Contact

- **Project Maintainer**: Varadha - [GitHub](https://github.com/Varadha9)
- **Email**: contribute@elevare.com
- **Discord**: [ELEVARE Community](https://discord.gg/elevare)
- **Twitter**: [@ElevareAI](https://twitter.com/elevareai)