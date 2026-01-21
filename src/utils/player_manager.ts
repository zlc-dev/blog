import { LRUPool } from "./lru_pool.ts";

interface Player {
    container: HTMLElement;
    pause(): void;
    destroy(): void;
}

export class PlayerManager<T extends Player> {
    private readonly retired: LRUPool<string, T>;
    private cntr_players: [HTMLElement, T][] = [];
    readonly selector: string;
    readonly ctor: (container: HTMLElement, dataset: DOMStringMap) => T;

    /**
     * 构造PlayerManager
     * @param selector 容器选择器，init会把Player插入到被选中的容器中
     * @param ctor 回调生成播放器选项，container是用来装载Player的容器，每个container可以不同, dataset是 容器选择器 选中的元素的
     * @param retired 缓存被淘汰的Player的池 或者 共用一个已有的PlayerManager 的缓存 或者一个新缓存池的大小
     */
    public constructor(selector: string, ctor: (container: HTMLElement, dataset: DOMStringMap) => T, retired: LRUPool<string, T> | PlayerManager<T> | number = 4) {
        this.selector = selector;
        this.ctor = ctor;
        if (typeof retired === 'number') {
        this.retired = new LRUPool(retired);
        } else if ('retired' in retired) {
            this.retired = retired.retired;
        } else {
            this.retired = retired;
        }
    }

    /**
     * 清除已创建的播放器，初始化指定选择器的播放器容器
     */
    init() {
        if (this.cntr_players.length > 0) this.destroy();
        let containers = [...document.querySelectorAll<HTMLElement>(this.selector)];
        if (!containers.length) return;

        for (const container of containers) {
            const id = container.id;
            const cacheable = container.dataset.cacheable === "true";
            container.innerHTML = '';
            let player = cacheable ? this.retired.take(id) : null;
            if (player) {
                container.appendChild(player.container);
            } else {
                let child = document.createElement('div');
                container.appendChild(child);
                player = this.ctor(child, container.dataset);
            }
            this.cntr_players.push([container, player]);
        }
    }

    /**
     * 销毁当前管理的播放器
     */
    destroy() {
        if (this.cntr_players.length == 0) return;
        const safe_destroy = (player: T) => {
            try { player.destroy(); } catch (e) { console.warn("Player destory error: ", e); }
        };
        for (const [container, player] of this.cntr_players) {
            const id = container.id;
            const cacheable = container.dataset.cacheable === "true";
            if (player === undefined) continue;
            try {
                player.pause();
                if (player.container?.parentElement === container) {
                    container.removeChild(player.container);
                }
                if (cacheable) {
                    this.retired.push(id, player, () => safe_destroy(player));
                } else {
                    safe_destroy(player);
                }
            } catch (e) {
                console.warn("PlayerManager.destroy(): ", e);
                safe_destroy(player)
            }
        }
        this.cntr_players = [];
    }
}
