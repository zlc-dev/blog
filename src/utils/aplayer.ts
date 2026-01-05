import APlayer from 'aplayer';
import { DEFAULT_THEME, THEMES } from '../theme';
import { getRelativePath } from '../utils';

let ap: any | null = null;
export async function mountAplayer(container: HTMLElement | null) {
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
