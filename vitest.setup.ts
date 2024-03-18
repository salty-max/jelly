import 'vitest-axe/extend-expect';
import * as jestDOMMatchers from '@testing-library/jest-dom/matchers';
import * as axeMatchers from 'vitest-axe/matchers';
import { expect } from 'vitest';

import type { AxeMatchers } from 'vitest-axe/matchers';

declare module 'vitest' {
  export interface Assertion extends AxeMatchers {}
  export interface AsymmetricMatchersContaining extends AxeMatchers {}
}

expect.extend(jestDOMMatchers);
expect.extend(axeMatchers);
