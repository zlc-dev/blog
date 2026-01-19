import { getCollection } from 'astro:content';

export async function GET() {
    const musics = await getCollection("musics");
    return new Response(JSON.stringify(
        musics.sort((a, b) => a.id.localeCompare(b.id)).map(m => m.data)
    ));
}
