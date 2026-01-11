
async function test() {
    try {
        console.log("Fetching http://localhost:3005/api/v1/content/home...");
        const res = await fetch('http://localhost:3005/api/v1/content/home');
        const data = await res.json();
        console.log("Status:", res.status);
        if (data.content) {
            console.log("Content Found Check:", typeof data.content);
            // It might be a string if the API double-encoded it, or object if fastify handled it.
            // Route says: content: JSON.parse(data.content) -> so it should be an object.
            console.log("Hero Badge:", data.content.hero?.badge);
            console.log("Sectors Count:", data.content.sectors?.length);
        } else {
            console.log("No Content Field Found:", data);
        }
    } catch (e) {
        console.error("Fetch failed:", e);
    }
}

test();
