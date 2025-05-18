// Check if startViewTransition is avialable once as it won't change
const transition: (callback: () => void) => void = document.startViewTransition
  ? (callback) => document.startViewTransition(callback)
  : (callback) => callback();

export default transition;
