# test-utils

This package contains useful testing utilities, such as unit test matchers (for jest, chai, and bun) and other useful functions, such as `randomAddress`.

## Installation

```
yarn add @ton/test-utils -D
```
or
```
npm i --save-dev @ton/test-utils
```

## Usage

To use the test matchers, just install either jest, chai, or bun and import this package like so:
```typescript
import "@ton/test-utils";
```

### Examples

#### Jest
```typescript
import { expect } from '@jest/globals';
import "@ton/test-utils";

test('cell comparison', () => {
    expect(cell1).toEqualCell(cell2);
});
```

#### Chai
```typescript
import { expect } from 'chai';
import "@ton/test-utils";

it('cell comparison', () => {
    expect(cell1).to.equalCell(cell2);
});
```

#### Bun
```typescript
import { expect, test } from 'bun:test';
import "@ton/test-utils";

test('cell comparison', () => {
    expect(cell1).toEqualCell(cell2);
});
```

### Transaction matcher notice

The transaction matcher (`.toHaveTransaction`) can only perform matching on transactions with descriptions of type `generic`. When matching an array of transactions, all transactions of other types will be filtered out. When matching a single transaction of non-generic type, an exception will be thrown.

## License

This package is released under the [MIT License](LICENSE).
