# Contributing to SafeDoc Workspace

Thank you for your interest in contributing to SafeDoc! This document provides guidelines for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Maintain professional communication

## Getting Started

### Development Setup

1. Fork the repository
2. Clone your fork
3. Install dependencies: `npm run install:all`
4. Create a feature branch: `git checkout -b feature/your-feature`
5. Make your changes
6. Test thoroughly
7. Submit a pull request

### Project Structure

```
/chrome-extension  - Chrome Extension (Manifest V3)
/web-app          - React Web Application
/backend          - Node.js Backend Server
/shared           - Shared TypeScript types and utilities
```

## Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow existing code formatting
- Use meaningful variable names
- Add comments for complex logic
- Keep functions focused and small

### TypeScript

- Define explicit types for all parameters
- Avoid `any` types when possible
- Use interfaces for object structures
- Export types that other modules need

### React Components

- Use functional components with hooks
- Keep components focused on single responsibility
- Extract reusable logic into custom hooks
- Use TypeScript for prop types

### Naming Conventions

- **Files**: PascalCase for components, camelCase for utilities
- **Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Types/Interfaces**: PascalCase
- **Functions**: camelCase, descriptive verb names

## Pull Request Process

### Before Submitting

1. **Test your changes**: Verify all functionality works
2. **Check for errors**: No console errors or warnings
3. **Update documentation**: If you changed APIs or features
4. **Follow code style**: Match existing patterns
5. **Write clear commit messages**: Explain what and why

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Manual testing completed
- [ ] All existing features still work
- [ ] No console errors

## Screenshots (if applicable)
[Add screenshots]

## Additional Notes
Any other context
```

### Review Process

1. Maintainers will review your PR
2. Address any requested changes
3. Once approved, PR will be merged
4. Your contribution will be credited

## Feature Requests

### Proposing New Features

1. Check existing issues for duplicates
2. Open a new issue with:
   - Clear feature description
   - Use cases and benefits
   - Implementation approach (if known)
   - Mockups or examples (if applicable)

### Feature Priorities

High priority:
- Security enhancements
- Performance improvements
- Critical bug fixes
- Core functionality

Medium priority:
- New document types
- New analysis types
- UI improvements
- Developer experience

Lower priority:
- Nice-to-have features
- Experimental ideas
- Non-critical optimizations

## Bug Reports

### Reporting Bugs

Use the bug report template:

```markdown
**Bug Description**
Clear description of the issue

**Steps to Reproduce**
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- OS: 
- Browser: 
- Node Version:
- Extension Version:

**Screenshots/Logs**
[Attach if applicable]
```

## Areas for Contribution

### High-Impact Areas

1. **Fraud Detection Algorithms**: Improve accuracy
2. **Document Generators**: Add new types
3. **UI/UX**: Enhance user experience
4. **Performance**: Optimize slow operations
5. **Testing**: Add unit/integration tests

### Good First Issues

- Documentation improvements
- UI polish and refinements
- Adding new document templates
- Improving error messages
- Adding input validation

### Advanced Contributions

- ML model integration for deepfake detection
- Real-time collaboration features
- Mobile app development
- Advanced threat intelligence
- Enterprise features (SSO, RBAC)

## Documentation

### When to Update Docs

- Adding new features
- Changing existing APIs
- Modifying configuration
- Adding dependencies
- Changing architecture

### Documentation Files

- `README.md` - Project overview
- `QUICKSTART.md` - Getting started guide
- `ARCHITECTURE.md` - System design
- `DEPLOYMENT.md` - Production setup
- `TESTING.md` - Testing procedures
- `FEATURES.md` - Feature list

## Commit Messages

### Format

```
type(scope): subject

body (optional)

footer (optional)
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style (formatting, missing semicolons)
- **refactor**: Code restructuring
- **perf**: Performance improvements
- **test**: Adding tests
- **chore**: Build tasks, dependencies

### Examples

```bash
feat(analyzer): add currency risk detection

Implements Phase 3.3 currency volatility analysis with 
FX rate monitoring and hedging recommendations.

Closes #123

---

fix(extension): prevent side panel auto-close

Side panel was closing unexpectedly on page navigation.
Now maintains state across page loads.

---

docs(readme): update installation instructions

Added npm workspaces setup and troubleshooting section.
```

## Testing Contributions

- Write tests for new features
- Ensure existing tests pass
- Test across different browsers
- Test on different screen sizes
- Verify accessibility

## Questions?

- Check existing documentation
- Review closed issues
- Open a discussion issue
- Join community chat (if available)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to SafeDoc Workspace!** Your efforts make this project better for everyone.
