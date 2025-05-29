 // jest-dom adds custom jest matchers for asserting on DOM nodes.
 // allows you to do things like:
 // expect(element).toHaveTextContent(/react/i)
 // learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Patch scrollIntoView for all test environments (JSDOM doesn't implement it)
// This prevents ChatWindow and others from failing TypeError in tests.
if (!window.HTMLElement.prototype.scrollIntoView) {
  window.HTMLElement.prototype.scrollIntoView = function() {};
}
