const CACHE_NAME = "standout-v2.3 beta 19";

// const MEDIA_CACHE = "standout-media";
// NEVER versioned


/* =====================================================
   FONT AWESOME CACHE
===================================================== */

const FONT_AWESOME_CACHE =
  "standout-fontawesome-v1";


const FONT_AWESOME_FILES = [

  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css",

  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/webfonts/fa-solid-900.woff2",

  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/webfonts/fa-regular-400.woff2",

  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/webfonts/fa-brands-400.woff2"

];


/* =====================================================
   BACKGROUND CACHE
===================================================== */

const BACKGROUND_CACHE =
  "standout-background-v4";


/* =====================================================
   APP SHELL
===================================================== */

const APP_SHELL = [

  "/",
  "/index.html",
  "/manifest.json",

  "/widget.js",
  "/widget.html",


  /* ===========================
     CSS
  =========================== */

  "/CSS/base.css",
  "/CSS/buttons.css",
  "/CSS/components.css",
  "/CSS/features.css",
  "/CSS/effects.css",
  "/CSS/timer.css",
  "/CSS/account.css",
  "/CSS/badges.css",
  "/CSS/momentum.css",
  "/CSS/monthly-report.css",
  "/CSS/intro.css",


  /* ===========================
     JS
  =========================== */

  "/JS/cards.js",
  "/JS/app.js",
  "/JS/background.js",
  "/JS/badges.js",
  "/JS/custom-cards.js",
  "/JS/momentum.js",
  "/JS/sound.js",


  /* ===========================
     APP ICON
  =========================== */

  "/icon.jpeg"

];


/* =====================================================
   BACKGROUND ASSETS
===================================================== */

const BACKGROUND_ASSETS = [

  /* ===========================
     IMAGES
  =========================== */

  "/Images/s1.jpg",
  "/Images/s2.jpg",

  "/Images/a1.jpg",
  "/Images/a2.jpg",
  "/Images/a3.jpg",

  "/Images/b1.jpg",
  "/Images/b2.jpg",
  "/Images/b3.jpg",
  "/Images/b4.jpg",
  "/Images/b5.jpg",

  "/Images/c1.jpg",
  "/Images/c2.jpg",
  "/Images/c3.jpg",
  "/Images/c4.jpg",
  "/Images/c5.jpg",

  "/Images/d1.jpg",
  "/Images/d2.jpg",
  "/Images/d3.jpg",
  "/Images/d4.jpg",
  "/Images/d5.jpg",
  "/Images/d6.jpg",
  "/Images/d7.jpg",

  "/Images/e1.jpg",
  "/Images/e2.jpg",
  "/Images/e3.jpg",
  "/Images/e4.jpg",
  "/Images/e5.jpg",
  "/Images/e6.jpg",
  "/Images/e7.jpg",
  "/Images/e8.jpg",

  "/Images/w4.jpg",
  "/Images/jjk.gif",


  /* ===========================
     SOUNDS
  =========================== */

  "/Music/Complete.mp3",
  "/Music/Achievements.mp3",

  "/Music/m1.mp3",
  "/Music/m2.mp3",
  "/Music/m3.mp3",
  "/Music/m4.mp3",
  "/Music/m5.mp3",
  "/Music/m6.mp3",

  "/Music/MintCard.mp3",


  /* ===========================
     VIDEOS
  =========================== */

  "/AchievedGoal.mp4",
  "/Intro.mp4",


  /* ===========================
     BADGES
  =========================== */

  "/badges/aug-2026.png",
  "/badges/sep-2026.png"

];


/* =====================================================
   INSTALL → CACHE APP SHELL
===================================================== */

self.addEventListener("install", event => {

  console.log(
    "🟡 SW installing..."
  );


  event.waitUntil(

    (async () => {


      /* =================================================
         APP SHELL
      ================================================= */

      const appCache =
        await caches.open(
          CACHE_NAME
        );


      try {

        await appCache.addAll(
          APP_SHELL
        );


        console.log(
          "✅ App shell cached"
        );


      } catch (err) {

        console.error(
          "❌ App shell cache failed:",
          err
        );


        throw err;

      }


      /* =================================================
         FONT AWESOME
      ================================================= */

      const fontAwesomeCache =
        await caches.open(
          FONT_AWESOME_CACHE
        );


      for (
        const url of FONT_AWESOME_FILES
      ) {

        try {

          const response =
            await fetch(
              url,
              {
                mode: "cors"
              }
            );


          if (
            response.ok
          ) {

            await fontAwesomeCache.put(
              url,
              response
            );


            console.log(
              "✅ Font Awesome cached:",
              url
            );

          }

        } catch (error) {

          console.warn(
            "⚠️ Could not cache Font Awesome:",
            url,
            error
          );

        }

      }

    })()

  );


  self.skipWaiting();

});


/* =====================================================
   MESSAGE
===================================================== */

self.addEventListener(
  "message",
  event => {

    if (
      event.data ===
      "SKIP_WAITING"
    ) {

      self.skipWaiting();

    }

  }
);


/* =====================================================
   ACTIVATE → CLEAN OLD CACHES
===================================================== */

self.addEventListener(
  "activate",
  event => {

    console.log(
      "🟢 SW activating"
    );


    event.waitUntil(

      (async () => {


        /* =============================================
           CLEAN OLD CACHES
        ============================================= */

        const keys =
          await caches.keys();


        await Promise.all(

          keys.map(k => {

            /*
             * Keep all active caches.
             */

            if (
              k === CACHE_NAME ||
              k === FONT_AWESOME_CACHE ||
              k === BACKGROUND_CACHE
            ) {

              return Promise.resolve();

            }


            return caches.delete(k);

          })

        );


        /* =============================================
           BACKGROUND ASSET CACHING
        ============================================= */

        cacheBackgroundAssets()
          .catch(error => {

            console.warn(
              "Background asset caching failed:",
              error
            );

          });


        /* =============================================
           NOTIFY ALL CLIENTS
        ============================================= */

        const clients =
          await self.clients.matchAll({
            includeUncontrolled: true
          });


        clients.forEach(client => {

          client.postMessage({
            type: "SW_UPDATED"
          });

        });

      })()

    );


    self.clients.claim();

  }
);


/* =====================================================
   FETCH → CACHE STRATEGY
===================================================== */

self.addEventListener(
  "fetch",
  event => {


    const url =
      event.request.url;


    const pathname =
      new URL(
        url
      ).pathname;


    /* =================================================
       INTRO VIDEO
       Handle separately because videos can use
       HTTP Range requests.
    ================================================= */

    if (
      pathname ===
      "/Intro.mp4"
    ) {

      event.respondWith(
        handleIntroVideo(
          event.request
        )
      );


      return;

    }


    /* =================================================
       FONT AWESOME / BACKGROUND ASSETS
    ================================================= */

    if (

      FONT_AWESOME_FILES.includes(
        url
      )

      ||

      (
        BACKGROUND_ASSETS.includes(
          pathname
        )

        &&

        pathname !==
        "/Intro.mp4"
      )

    ) {

      event.respondWith(

        (async () => {


          /* =========================================
             CHECK ANY CACHE
          ========================================= */

          const cached =
            await caches.match(
              event.request
            );


          if (cached) {

            return cached;

          }


          /* =========================================
             NETWORK FALLBACK
          ========================================= */

          try {

            const response =
              await fetch(
                event.request
              );


            return response;

          } catch (error) {

            console.warn(
              "Offline asset unavailable:",
              event.request.url
            );


            throw error;

          }

        })()

      );


      return;

    }


    /* =================================================
       EXISTING APP SHELL LOGIC
    ================================================= */

    event.respondWith(

      caches.match(
        event.request
      )

      .then(cached => {


        if (cached) {

          return cached;

        }


        return fetch(
          event.request
        )

        .catch(() =>

          caches.match(
            "/index.html"
          )

        );

      })

    );

  }
);


/* =====================================================
   BACKGROUND ASSET CACHING
===================================================== */

async function cacheBackgroundAssets() {


  const cache =
    await caches.open(
      BACKGROUND_CACHE
    );


  for (
    const url of BACKGROUND_ASSETS
  ) {

    try {


      /* =============================================
         CHECK IF ALREADY CACHED
      ============================================= */

      const existing =
        await cache.match(
          url
        );


      if (existing) {

        console.log(
          "Already cached:",
          url
        );


        continue;

      }


      /* =============================================
         DOWNLOAD
      ============================================= */

      const response =
        await fetch(
          url
        );


      /* =============================================
         STORE
      ============================================= */

      if (
        response.ok
      ) {

        await cache.put(
          url,
          response.clone()
        );


        console.log(
          "✅ Background cached:",
          url
        );

      }


    } catch (error) {

      /*
       * One failed asset should NEVER stop
       * the remaining assets from downloading.
       */

      console.warn(
        "⚠️ Background cache failed:",
        url,
        error
      );

    }

  }


  console.log(
    "🎯 Background asset caching complete"
  );

}


/* =====================================================
   INTRO VIDEO HANDLER
   Supports HTTP RANGE requests.
===================================================== */

async function handleIntroVideo(
  request
) {


  const cache =
    await caches.open(
      BACKGROUND_CACHE
    );


  /* =================================================
     CHECK CACHE
  ================================================= */

  const cached =
    await cache.match(
      "/Intro.mp4"
    );


  const range =
    request.headers.get(
      "range"
    );


  /* =================================================
     RANGE REQUEST
  ================================================= */

  if (
    range &&
    cached
  ) {


    const buffer =
      await cached.arrayBuffer();


    const total =
      buffer.byteLength;


    /* ===============================================
       PARSE RANGE

       Examples:

       bytes=0-
       bytes=1000-
       bytes=1000-5000
    =============================================== */

    const match =
      range.match(
        /bytes=(\d+)-(\d*)/
      );


    /* ===============================================
       INVALID RANGE
    =============================================== */

    if (!match) {

      return new Response(
        null,
        {
          status: 416,

          statusText:
            "Range Not Satisfiable",

          headers: {

            "Content-Range":
              `bytes */${total}`

          }

        }
      );

    }


    const start =
      Number(
        match[1]
      );


    const requestedEnd =
      match[2]
        ? Number(
            match[2]
          )
        : total - 1;


    /* ===============================================
       RANGE OUT OF BOUNDS
    =============================================== */

    if (
      start >= total
    ) {

      return new Response(
        null,
        {
          status: 416,

          statusText:
            "Range Not Satisfiable",

          headers: {

            "Content-Range":
              `bytes */${total}`

          }

        }
      );

    }


    /* ===============================================
       CALCULATE END
    =============================================== */

    const end =
      Math.min(
        requestedEnd,
        total - 1
      );


    /* ===============================================
       EXTRACT CHUNK
    =============================================== */

    const chunk =
      buffer.slice(
        start,
        end + 1
      );


    /* ===============================================
       RETURN 206 PARTIAL CONTENT
    =============================================== */

    return new Response(
      chunk,
      {

        status: 206,

        statusText:
          "Partial Content",

        headers: {

          "Content-Type":
            cached.headers.get(
              "Content-Type"
            ) ||
            "video/mp4",

          "Content-Length":
            String(
              chunk.byteLength
            ),

          "Content-Range":
            `bytes ${start}-${end}/${total}`,

          "Accept-Ranges":
            "bytes"

        }

      }
    );

  }


  /* =================================================
     NORMAL CACHED REQUEST
  ================================================= */

  if (cached) {

    return cached;

  }


  /* =================================================
     FIRST REQUEST
     FETCH + CACHE
  ================================================= */

  try {


    const response =
      await fetch(
        request
      );


    if (
      response.ok
    ) {

      await cache.put(
        "/Intro.mp4",
        response.clone()
      );

    }


    return response;


  } catch (error) {

    console.error(
      "Intro video unavailable:",
      error
    );


    throw error;

  }

}
