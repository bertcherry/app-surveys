import "@testing-library/jest-dom";

// jsdom doesn't implement scroll — silence the noise
window.scrollTo = () => {};
