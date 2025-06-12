import { CompareResult } from './interface';

function isExitCodeError(err: unknown): err is {
    exitCode?: number;
} {
    return typeof err === 'object' && err !== null && 'exitCode' in err;
}

async function throwsExitCode(fn: CallableFunction, exitCode: number): Promise<{ pass: boolean; exitCode?: number }> {
    try {
        await fn();
    } catch (err) {
        if (isExitCodeError(err)) {
            return { pass: err.exitCode === exitCode, exitCode: err.exitCode };
        }
    }

    return { pass: false };
}

export async function compareThrownExitCodeForTest(subject: unknown, exitCode: number): Promise<CompareResult> {
    if (typeof subject === 'function') {
        const result = await throwsExitCode(subject, exitCode);
        return {
            pass: result.pass,
            posMessage: () => `Expected function to throw error with exitCode: ${exitCode}, got: ${result.exitCode}`,
            negMessage: () =>
                `Expected function NOT to throw error with exitCode: ${exitCode}, got: ${result.exitCode}`,
        };
    }

    throw new Error(`Expected function to compare, got ${typeof subject}`);
}
