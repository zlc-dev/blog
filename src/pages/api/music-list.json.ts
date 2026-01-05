import { getCollection } from 'astro:content';

export async function GET() {
    const musics = await getCollection("musics");
    return new Response(JSON.stringify(
        musics.map(m => m.data)
    ));
}
