import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AxiosError, AxiosHeaders } from 'axios';
import posthog from 'posthog-js';
import { beginApiRequest, captureApiFailure, captureClientError } from './api-telemetry';

vi.mock('posthog-js', () => ({ default: { captureException: vi.fn() } }));
beforeEach(() => {
  vi.stubEnv('REACT_APP_ENV', 'production');
  vi.clearAllMocks();
});

function apiError(status: number) {
  const config = beginApiRequest({ headers: new AxiosHeaders({ 'X-Request-ID': 'stable-business-id',
    Authorization: 'Bearer never-export-token' }), method: 'post', data: { customer: 'never-export-body' } });
  return new AxiosError('never-export-original-message', undefined, config, undefined, {
    status, statusText: 'Failure', config, headers: { 'x-trace-id': '11111111111111111111111111111111' },
    data: { private: 'never-export-response' },
  });
}

describe('client telemetry contract', () => {
  it('changes attempt correlation while preserving business idempotency', () => {
    const config = { headers: new AxiosHeaders({ 'X-Request-ID': 'stable-business-id' }) };
    beginApiRequest(config);
    const first = config.headers.get('X-Correlation-ID');
    beginApiRequest(config);
    expect(config.headers.get('X-Correlation-ID')).not.toBe(first);
    expect(config.headers.get('X-Request-ID')).toBe('stable-business-id');
  });
  it('does not report expected 4xx through interceptor or generic hooks', () => {
    const error = apiError(401);
    captureApiFailure(error);
    captureClientError(error);
    expect(posthog.captureException).not.toHaveBeenCalled();
  });
  it('projects a 5xx once across interceptor and rejection handlers', () => {
    const error = apiError(500);
    captureApiFailure(error);
    captureClientError(error);
    expect(posthog.captureException).toHaveBeenCalledTimes(1);
    const [safe, properties] = vi.mocked(posthog.captureException).mock.calls[0];
    if (!(safe instanceof Error)) throw new Error('Expected projected Error');
    expect(JSON.stringify({ safe: { name: safe.name, message: safe.message, stack: safe.stack }, properties }))
      .not.toContain('never-export');
    expect(properties?.trace_id).toBe('11111111111111111111111111111111');
    expect(properties?.correlation_id).toBe(error.config?.headers.get('X-Correlation-ID'));
  });
  it('omits exception messages while preserving frames for source maps', () => {
    const error = new TypeError('never-export-secret');
    error.stack = 'TypeError: never-export-secret\n    at render (https://app.example.com/main.js:10:20)';
    captureClientError(error);
    const safe = vi.mocked(posthog.captureException).mock.calls[0][0];
    if (!(safe instanceof Error)) throw new Error('Expected projected Error');
    expect(safe.stack).toContain('main.js:10:20');
    expect(safe.stack).not.toContain('never-export');
  });
});
