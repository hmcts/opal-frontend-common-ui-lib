/*
 * Public API Surface of @hmcts/opal-frontend-common
 *
 * This library uses individual entry points for components, services, and utilities
 * as defined in ng-package.json. This allows for tree-shaking and selective imports.
 *
 * Most exports are available through their specific entry points, such as:
 * - @hmcts/opal-frontend-common/components/govuk/govuk-button
 * - @hmcts/opal-frontend-common/services/auth-service
 * - @hmcts/opal-frontend-common/validators/amount
 *
 * The exports below are for common utilities that should be available
 * at the main entry point.
 */

// Constants - commonly used across applications
export * from './constants/public-api';

// Pages - routing configuration
export * from './pages/public-api';
