# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.12.0] - 2025-09-22

### Fixed

- Fixed issues with isolated linker

## [0.11.0] - 2025-08-18

### Changed

- Switched to Jest 30

## [0.10.0] - 2025-08-04

### Added

- Added support for the Bun.js test runner
- Added support for TON matchers on imported `expect` from `@jest/globals`

### Changed

- Updated `README.md` with examples and instructions for using the Bun matchers

## [0.9.0] - 2025-07-07

### Added

- Added `mode` matcher for transaction

## [0.8.0] - 2025-06-16

### Added

- Added `toThrowExitCode` jest matcher and `throwExitCode` chai assertion to validate the `exitCode` of errors thrown from get method calls or external message invocations.
- Added `ExitCode` enum containing standard exit codes
- Added -14 exit code mapping

## [0.7.0] - 2025-06-02

### Added

- Add address, opcode and errors description in `toHaveTransaction` method

## [0.6.0] - 2025-05-02

### Added

- Added fail reason (`failReason`) to failed transactions

## [0.5.0] - 2025-01-17

### Added

- Added extra currency (`ec`) matcher

## [0.4.2] - 2023-11-25

### Fixed

- Fixed the `deploy` flag in flat transactions

## [0.4.1] - 2023-11-24

### Fixed

- Added missing export for `findTransactionRequired`

## [0.4.0] - 2023-11-05

### Added

- Added transaction iterator helpers
- Added find and filter helpers
- Added support for non-generic transactions

## [0.3.1] - 2023-07-19

### Changed

- Migrated to `@ton/core` and `@ton/crypto` packages instead of `ton-core` and `ton-crypto`

## [0.3.0] - 2023-07-17

### Added

- Added a warning to prevent misuse of sandbox's `SendMessageResult`

### Changed

- Non-generic transactions will be filtered out when using the transaction matcher, single non-generic transactions will generate an exception

## [0.2.0] - 2023-03-17

### Added

- Added `inMessageBounced`, `inMessageBounceable` fields on `FlatTransaction`
- Added `actionResultCode` field on `FlatTransaction`

## [0.1.0] - 2023-03-16

### Added

- Added `toEqualCell`/`equalCell`, `toEqualAddress`/`equalAddress`, `toEqualSlice`/`equalSlice` (jest/chai) matchers
- Added `on` field (alias for `to`) on `FlatTransaction`
- Added `op` field on `FlatTransaction`
