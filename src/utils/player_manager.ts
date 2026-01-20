import { LRUCache } from "./lru_cache.ts";

interface Player {
    container: HTMLElement;
    pause(): void;
    destroy(): void;
}

export class PlayerManager {
    private cache: LRUCache<string, Player>;
    private containers: HTMLElement[] = [];

    constructor(cache_size: number = 4) {
        this.cache = new LRUCache<string, Player>(cache_size);
    }

    /**
     * 初始化指定选择器的播放器容器
     * @param selector 容器选择器
     * @param getPlayerOptions 回调生成播放器选项，每个 container 可以不同
     */
    init(selector: string, ctor: (container: HTMLElement) => Player) {
        this.containers = [...document.querySelectorAll<HTMLElement>(selector)];
        if (!this.containers.length) return;

        for (const container of this.containers) {
            const id = container.id;
            const cacheable = Boolean(container.dataset.cacheable);
            const cached = this.cache.get(id);
            if (cached && cacheable) {
                container.appendChild(cached.container);
                (container as any)._player = cached;
            } else {
                (container as any)._player = ctor(container);
            }
        }
    }

    /**
     * 销毁当前管理的播放器
     */
    destroy() {
        if (!this.containers.length) return;

        for (const container of this.containers) {
            const id = container.id;
            const cacheable = Boolean(container.dataset.cacheable);
            const player: Player = (container as any)._player;
            (container as any)._player = null;
            if (!player) continue;
            try {
                player.pause();
                if (player.container?.parentElement === container) {
                    container.removeChild(player.container);
                }
                const ondestroy = () => player.destroy();
                if (cacheable) {
                    this.cache.push(id, player, ondestroy);
                } else {
                    ondestroy();
                }
            } catch (e) {
                console.warn("destroyPlayer failed:", e);
            }
        }

        this.containers = [];
    }
}
