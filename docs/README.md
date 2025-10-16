# Development Documentation

This documentation serves as a comprehensive guide for AI agents and developers working on the AIOM Dashboard project. It provides standards, best practices, and guidelines to ensure consistent, maintainable, and scalable code.

## Documentation Overview

### 📋 [Best Practices](./best-practices.md)
Comprehensive guide covering:
- **Efficient Coding Techniques**: Performance optimization, state management, API integration
- **Code Readability**: Documentation standards, commenting guidelines, naming conventions
- **TypeScript Best Practices**: Type safety, interfaces, and generic usage
- **Error Handling**: Consistent error management and user feedback

### 📏 [Project Rules](./project-rules.md)
Strict guidelines for:
- **Project Structure**: Required folder hierarchy and organization principles
- **Naming Conventions**: Files, components, variables, and functions
- **Code Quality Rules**: TypeScript requirements, component constraints, performance rules
- **Import Organization**: Consistent import ordering and structure

### 📁 [Folder Organization](./folder-organization.md)
Detailed structure guide including:
- **Component Categorization**: How to organize different types of components
- **Feature-Based Organization**: Scalable patterns for growing features
- **Asset Management**: Proper organization of styles, images, and static files
- **Testing Structure**: Comprehensive testing folder organization

### 🧩 [Component Design](./component-design.md)
Component architecture guidelines:
- **Component Splitting Strategy**: When and how to break down large components
- **Design Patterns**: Container-presentation, compound components, composition
- **Performance Optimization**: Memoization, lazy loading, and efficient rendering
- **Length Guidelines**: Recommended component sizes and refactoring strategies

## Quick Reference

### Project Tech Stack
- **Frontend**: React 19 + TypeScript
- **UI Library**: Ant Design 5.x
- **State Management**: Redux Toolkit + Redux Persist
- **Routing**: React Router v6
- **Styling**: SCSS + Tailwind CSS
- **Testing**: Jest + React Testing Library
- **Build Tool**: Create React App

### Key Principles
1. **Component-First Architecture**: Build reusable, focused components
2. **Type Safety**: Leverage TypeScript for better developer experience
3. **Performance**: Optimize for loading speed and runtime performance
4. **Accessibility**: Ensure all components are accessible by default
5. **Testability**: Write code that's easy to test and maintain

### Common Patterns

#### Component Structure
```typescript
// Standard component template
interface ComponentProps {
  // Props definition
}

const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Hooks
  // Event handlers
  // Render logic
  
  return (
    <div className="component">
      {/* JSX */}
    </div>
  );
};

export default Component;
```

#### Custom Hook Pattern
```typescript
const useFeature = (param: string) => {
  const [state, setState] = useState();
  
  // Logic
  
  return { state, actions };
};
```

#### Redux Slice Pattern
```typescript
const featureSlice = createSlice({
  name: 'feature',
  initialState,
  reducers: {
    // Synchronous actions
  },
  extraReducers: (builder) => {
    // Async actions
  }
});
```

## AI Agent Guidelines

When generating code for this project, AI agents should:

1. **Follow the established patterns** documented in these guides
2. **Use TypeScript strictly** with proper type definitions
3. **Implement proper error handling** and loading states
4. **Create focused, single-responsibility components**
5. **Use Ant Design components** consistently
6. **Follow the naming conventions** for all files and variables
7. **Include proper JSDoc comments** for complex logic
8. **Consider performance implications** of generated code
9. **Ensure accessibility compliance** in all UI components
10. **Write testable code** that follows the project patterns

## Maintenance

This documentation should be updated when:
- New architectural patterns are introduced
- Project structure changes significantly
- New tools or libraries are added to the tech stack
- Best practices evolve based on team experience

---

*Last updated: December 2024*