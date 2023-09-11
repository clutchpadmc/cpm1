type TimingCallback = (time: number) => void;

export class Semaphore {
	private counter: number;
	private waiting: { resolve: (value?: unknown) => void, err: (err: string) => void; }[];
	private abortSignal: AbortSignal;

	constructor(private readonly max: number, abortSignal?: AbortSignal) {
		this.counter = 0;
		this.waiting = [];

		this.abortSignal = abortSignal ?? new AbortController().signal;
	}
	async withSemaphore<T>(fn: () => Promise<T>, callback?: TimingCallback) {
		await this.acquire();
		const startTime = performance.now();
		try {
			if (this.abortSignal.aborted) {
				// Return early
				return Promise.reject('Aborted');
			}
			return await fn();
		} finally {
			this.release();
			if (callback) {
				callback(performance.now() - startTime)
			}
		}
	}
	async withRetrySemaphore<T>(fn: () => Promise<T>, callback?: TimingCallback, retries: number = 3) {
		// We implement this in such a way that when sleeping betweeen retries, we don't
		// hold the semaphore
		if (this.abortSignal.aborted) {
			// Return early
			return Promise.reject('Aborted');
		}

		for (let i = 1; i < retries; i++) {
			try {
				return await this.withSemaphore(fn, callback);
			} catch (err) {
				// If we reach here, we need to retry
				await new Promise(resolve => setTimeout(resolve, 200 * i));
			}
		}
		// Try 1 last time
		return await this.withSemaphore(fn);
	}


	take() {
		if (this.waiting.length > 0 && this.counter < this.max) {
			this.counter++;
			const promise = this.waiting.shift();
			if (promise)
				promise.resolve();
		}
	}

	acquire() {
		if (this.counter < this.max) {
			this.counter++;
			return new Promise<void>(resolve => {
				resolve();
			});
		} else {
			return new Promise((resolve, err) => {
				this.waiting.push({ resolve: resolve, err: err });
			});
		}
	}

	release() {
		this.counter--;
		this.take();
	}

	purge() {
		const unresolved = this.waiting.length;

		for (let i = 0; i < unresolved; i++) {
			this.waiting[i].err('Task has been purged.');
		}

		this.counter = 0;
		this.waiting = [];

		return unresolved;
	}
}