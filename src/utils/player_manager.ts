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
     * @param ctor 回调生成播放器选项，每个 container 可以不同, dataset 是 容器选择器 选中的元素的
     */
    init(selector: string, ctor: (container: HTMLElement, dataset: DOMStringMap) => Player) {
        this.containers = [...document.querySelectorAll<HTMLElement>(selector)];
        if (!this.containers.length) return;

        for (const container of this.containers) {
            const id = container.id;
            const cacheable = Boolean(container.dataset.cacheable);
            container.innerHTML = '';
            let player = cacheable ? this.cache.get(id) : null;
            if (player) {
                container.appendChild(player.container);
            } else {
                let child = document.createElement('div');
                container.appendChild(child);
                player = ctor(child, container.dataset);
            }
            (container as any)._player = player;
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
