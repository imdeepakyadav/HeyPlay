# Contributing to HeyPlay

Thank you for your interest in contributing to HeyPlay! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### 🐛 Reporting Bugs

1. **Check existing issues** first to avoid duplicates
2. **Use the bug report template** when creating new issues
3. **Provide detailed information**:
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots/videos if applicable
   - Environment details (OS, browser, device)

### 💡 Suggesting Features

1. **Check the roadmap** and existing feature requests
2. **Use the feature request template**
3. **Provide detailed use cases** and benefits
4. **Consider implementation complexity**

### 🔧 Code Contributions

#### Getting Started

1. **Fork the repository**

   ```bash
   git clone https://github.com/your-username/HeyPlay.git
   cd HeyPlay
   ```

2. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Set up development environment** (see README.md)

4. **Make your changes** following our coding standards

5. **Test your changes** thoroughly

6. **Commit and push**

   ```bash
   git add .
   git commit -m "feat: add your feature description"
   git push origin feature/your-feature-name
   ```

7. **Open a Pull Request**

## 📝 Development Guidelines

### Code Style

- **TypeScript**: Use TypeScript for all new code
- **ESLint**: Follow the existing ESLint configuration
- **Prettier**: Use Prettier for consistent formatting
- **Comments**: Write clear, concise comments for complex logic

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

feat(auth): add email verification
fix(player): resolve sync issues
docs(readme): update setup instructions
style(ui): improve button styling
refactor(api): optimize database queries
test(auth): add login test cases
```

### Branch Naming

- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/documentation-update` - Documentation changes
- `refactor/code-improvement` - Code refactoring
- `test/test-addition` - Adding tests

### Code Structure

#### Backend (`/backend`)

```
src/
├── models/          # Database models
├── routes/          # API route handlers
├── services/        # Business logic services
├── middleware/      # Custom middleware
├── utils/           # Utility functions
└── config/          # Configuration files
```

#### Web (`/web`)

```
src/
├── app/             # Next.js app directory
├── components/      # Reusable UI components
├── lib/             # Utility libraries
├── hooks/           # Custom React hooks
├── types/           # TypeScript type definitions
└── styles/          # Global styles
```

#### Mobile (`/mobile`)

```
src/
├── screens/         # Screen components
├── components/      # Reusable components
├── navigation/      # Navigation configuration
├── services/        # API and utility services
├── hooks/           # Custom hooks
├── types/           # TypeScript types
└── config/          # App configuration
```

## 🧪 Testing

### Running Tests

```bash
# Backend tests
cd backend && npm test

# Web tests
cd web && npm run test

# Mobile tests
cd mobile && npm test
```

### Writing Tests

- **Unit tests** for utility functions
- **Integration tests** for API endpoints
- **Component tests** for React components
- **E2E tests** for critical user flows

### Test Guidelines

- Write tests for new features
- Maintain or improve test coverage
- Use descriptive test names
- Mock external dependencies

## 🎯 Pull Request Guidelines

### Before Submitting

- [ ] Code follows project conventions
- [ ] Tests pass locally
- [ ] New features include tests
- [ ] Documentation is updated
- [ ] No console errors or warnings
- [ ] Mobile app builds successfully
- [ ] Web app builds successfully

### PR Description Template

```markdown
## What does this PR do?

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)

Add screenshots for UI changes

## Additional Notes

Any additional context or considerations
```

## 🔍 Code Review Process

1. **Automated checks** must pass
2. **At least one approval** from maintainers
3. **Address feedback** promptly
4. **Squash commits** before merging (if requested)

## 📚 Resources

### Learning Resources

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/)

### Project Architecture

- [API Documentation](./docs/API.md)
- [Database Schema](./docs/DATABASE.md)
- [Authentication Flow](./docs/AUTHENTICATION.md)
- [Socket Events](./docs/SOCKET_EVENTS.md)

## 🎖️ Recognition

Contributors will be recognized in:

- README.md contributors section
- Release notes for significant contributions
- Special thanks in project announcements

## 📞 Getting Help

- **Discord**: Join our development Discord server
- **GitHub Discussions**: Ask questions in GitHub Discussions
- **Email**: developers@heyplay.com

## 📜 License

By contributing to HeyPlay, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to HeyPlay! 🎵
