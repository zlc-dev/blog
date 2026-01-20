export class LRUCache<K, V> {
    map: Map<K, {inner: V, ondestroy: () => void}>;
    readonly capacity: number;

    constructor(capacity = 8) {
        this.map = new Map();
        this.capacity = capacity;
    }

    get(id: K) {
        if (!this.has(id)) return null;
        const value = this.map.get(id)!;
        this.map.delete(id);
        this.map.set(id, value);
        return value.inner;
    }

    full() {
        return this.map.size >= this.capacity;
    }

    empty() {
        return this.map.size == 0;
    }

    pop() {
        if (this.empty()) return null;
        const [id, oldest] = this.map.entries().next().value!;
        this.map.delete(id);
        return oldest;
    }

    has(id: K) {
        return this.map.has(id);
    }

    push(id: K, value: V, ondestroy: () => void) {
        if (this.map.has(id)) {
            this.map.delete(id);
        } else if (this.full()) {
            let oldest = this.pop();
            if (!oldest) {
                ondestroy();
                return;
            }
            oldest.ondestroy();
        }
        this.map.set(id, {inner: value, ondestroy});
    }
}
