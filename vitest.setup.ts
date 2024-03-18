import 'vitest-axe/extend-expect';
import * as jestDOMMatchers from '@testing-library/jest-dom/matchers';
import * as axeMatchers from 'vitest-axe/matchers';
import { expect } from 'vitest';

expect.extend(jestDOMMatchers);
expect.extend(axeMatchers);
