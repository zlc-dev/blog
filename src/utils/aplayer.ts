import APlayer from 'aplayer';
import { DEFAULT_THEME, THEMES } from '../theme';
import { getRelativePath } from '../utils';

let ap: any | null = null;
export async function mountAplayer(container: HTMLElement) {
    if (!ap) {
        const audio = await fetch(getRelativePath('/api/music-list.json')).then(r => r.json());
        ap = new APlayer({
            container: container,
            autoplay: false,
            fixed: true,
            lrcType: 3,
            audio: audio,
            theme: "var(--color-accent)"
        });
    } else {
        container?.appendChild(ap.container);
    }
    return ap;
}

export type AplayerAudio = {
    name: string;          // 歌名（必填）
    artist: string;        // 艺术家（必填）
    url: string;           // 音频地址（必填，CDN / 本地）
    cover?: string;        // 封面
    lrc?: string;          // 歌词（lrc 文件或字符串）
    theme?: string;        // 单曲主题色
    type?: 'auto' | 'hls' | 'normal'; // 音频类型
};

export async function createAplayer(container: HTMLElement, audio: AplayerAudio[]) {
    return new APlayer({
        container: container,
        autoplay: false,
        fixed: true,
        lrcType: 3,
        audio: audio,
        theme: "var(--color-accent)"
    });
}