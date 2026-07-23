class Semaphore {
    private queue: Array<() => void> = [];
    private active = 0;
    constructor(private max: number) {}

    async acquire() {
        if (this.active < this.max) {
            this.active++;
            return;
        }
        await new Promise<void>(resolve => this.queue.push(resolve));
        this.active++;
    }

    release() {
        this.active--;
        const next = this.queue.shift();
        if (next) next();
    }
}

export const semaphore = new Semaphore(8)