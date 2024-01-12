
(async () => {
    //const fs = {};

    //let currentLevel = [];
    //let isDone = false;

    //while (!isDone) {

    //}

    for await (const entry of Deno.readDir('./src/routes')) {
        console.log(entry);
    }
})();


//const handler = (req: Request) => {
//    console.log(req.url);
//    return new Response("hallo");
//};
//
//Deno.serve(handler);
