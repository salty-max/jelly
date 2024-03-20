import 'vitest-canvas-mock';
import 'vitest-axe/extend-expect';
import { expect } from 'vitest';
import * as jestDOMMatchers from '@testing-library/jest-dom/matchers';
import * as axeMatchers from 'vitest-axe/matchers';

import type { AxeMatchers } from 'vitest-axe/matchers';

declare module 'vitest' {
  export interface Assertion extends AxeMatchers {}
  export interface AsymmetricMatchersContaining extends AxeMatchers {}
}

expect.extend(jestDOMMatchers);
expect.extend(axeMatchers);
