console.log("🔥 DROP INFO JS LOADED");

/* =========================================================
   STAND OUT — MONTHLY DROP
========================================================= */

const MONTHLY_DROP_KEY = "standOutMonthlyDropSeen";

const DROP_DATA = {
    name: "The Ascension",
    month: "September 2026",
    description: "A new month. A new challenge.",
    expiry: "September 30, 2026",

    introVideo: "welcome.mp4",

    limitedCards: [
        {
            title: "Limited Edition Card I",
            description:
                "A new limited edition card for this month's drop.",
            image: "Images/Endgame_Cap.gif"
        },
        {
            title: "Limited Edition Card II",
            description:
                "A second limited edition card for this month's drop.",
            image: "Images/Endgame_Thor.gif"
        }
    ],

    season: {
        name: "The Ascension",
        description:
            "A new season with new rewards and season cards.",
        expiry: "September 30, 2026"
    },

    badge: {
        name: "New Monthly Badge",
        description:
            "A new badge is waiting for you this month.",
        image: "badges/sep-2026.png"
    },

    achievedGoalVideo: "AchievedGoal.mp4",

    tips: [
        "Explore the new season early.",
        "Claim your season rewards as you progress.",
        "Complete this month's goals before the drop expires."
    ]
};


/* =========================================================
   DROP KEY
========================================================= */

function getCurrentDropKey() {

    const now = new Date();

    return `${now.getFullYear()}-${String(
        now.getMonth() + 1
    ).padStart(2, "0")}`;
}


/* =========================================================
   MARK CURRENT DROP AS SEEN
========================================================= */

function markDropSeen() {

    localStorage.setItem(
        MONTHLY_DROP_KEY,
        getCurrentDropKey()
    );
}


/* =========================================================
   SET TEXT SAFELY
========================================================= */

function setText(id, value) {

    const element = document.getElementById(id);

    if (element) {
        element.textContent = value ?? "";
    }
}


/* =========================================================
   VIDEO SETUP
========================================================= */

function setupVideo(
    videoId,
    sourceId,
    fallbackId,
    src
) {

    const video =
        document.getElementById(videoId);

    const source =
        document.getElementById(sourceId);

    const fallback =
        document.getElementById(fallbackId);

    if (!video || !source || !fallback) {
        return;
    }

    const wrapper =
        video.closest(".drop-video-wrap");

    if (!src) {

        if (wrapper) {
            wrapper.classList.add("is-empty");
        }

        return;
    }

    source.src = src;

    video.load();
}


/* =========================================================
   RENDER LIMITED CARDS
========================================================= */

function renderLimitedCards(cards) {

    const container =
        document.getElementById("limitedCards");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    cards.forEach(card => {

        const article =
            document.createElement("article");

        article.className = "drop-card";

        const imageHTML = card.image
            ? `
                <img
                    src="${card.image}"
                    alt="${card.title}"
                >
              `
            : `
                <div class="drop-card-placeholder">
                    <i class="fa-solid fa-layer-group"></i>
                </div>
              `;

        article.innerHTML = `
            <div class="drop-card-image">
                ${imageHTML}
            </div>

            <div class="drop-card-info">
                <h3>${card.title}</h3>
                <p>${card.description}</p>
            </div>
        `;

        container.appendChild(article);
    });
}


/* =========================================================
   RENDER BADGE
========================================================= */

function renderBadge(badge) {

    const wrap =
        document.getElementById(
            "badgeImageWrap"
        );

    setText(
        "badgeName",
        badge.name
    );

    setText(
        "badgeDescription",
        badge.description
    );

    if (!wrap) {
        return;
    }

    if (badge.image) {

        wrap.innerHTML = `
            <img
                src="${badge.image}"
                alt="${badge.name}"
            >
        `;
    }
}


/* =========================================================
   RENDER DROP
========================================================= */

function renderDrop() {

    setText(
        "dropName",
        DROP_DATA.name
    );

    setText(
        "dropMonth",
        DROP_DATA.month
    );

    setText(
        "dropDescription",
        DROP_DATA.description
    );

    setText(
        "dropExpiry",
        DROP_DATA.expiry
    );


    /* -------------------------
       SEASON
    ------------------------- */

    setText(
        "seasonName",
        DROP_DATA.season.name
    );

    setText(
        "seasonDescription",
        DROP_DATA.season.description
    );

    setText(
        "seasonExpiry",
        DROP_DATA.season.expiry
    );


    /* -------------------------
       LIMITED CARDS
    ------------------------- */

    renderLimitedCards(
        DROP_DATA.limitedCards
    );


    /* -------------------------
       BADGE
    ------------------------- */

    renderBadge(
        DROP_DATA.badge
    );


    /* -------------------------
       TIPS
    ------------------------- */

    const tips =
        document.getElementById(
            "dropTips"
        );

    if (tips) {

        tips.innerHTML = "";

        DROP_DATA.tips.forEach(tip => {

            const li =
                document.createElement("li");

            li.textContent = tip;

            tips.appendChild(li);
        });
    }


    /* -------------------------
       INTRO VIDEO
    ------------------------- */

    setupVideo(
        "introVideo",
        "introVideoSource",
        "introVideoFallback",
        DROP_DATA.introVideo
    );


    /* -------------------------
       ACHIEVED GOAL VIDEO
    ------------------------- */

    setupVideo(
        "achievedGoalVideo",
        "achievedGoalVideoSource",
        "achievedGoalVideoFallback",
        DROP_DATA.achievedGoalVideo
    );
}


/* =========================================================
   CONTINUE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderDrop();

        const continueButton =
            document.getElementById(
                "dropContinue"
            );

        if (!continueButton) {
            return;
        }

        continueButton.addEventListener(
            "click",
            () => {

                /*
                 * Mark this month's Drop as seen.
                 */
                markDropSeen();

                /*
                 * Return to the main application.
                 */
                window.location.href =
                    "index.html";
            }
        );
    }
);
