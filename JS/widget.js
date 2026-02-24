/* ============================================
   Stand Out - FULL LOGIC MISSION WIDGET
   Mirrors completeMission() with full rules
=============================================== */

// Keys same as your app
const KEY_MISSIONS = "missions";
const KEY_COMPLETED = "completedMissions";
const KEY_DAILY = "dailyImprovementCount";
const KEY_LAST_DATE = "lastImprovementDate";
const KEY_SKILLS = "skills";
const KEY_ACH = "achievements";
const KEY_NOTIFS = "appNotifications";

const DAILY_LIMIT = 10;

// Helper
function getISTDate() {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );
}

// Enforce daily reset
function enforceDailyReset() {
  const today = getISTDate().toISOString().slice(0, 10);
  const last = localStorage.getItem(KEY_LAST_DATE) || today;

  if (today !== last) {
    localStorage.setItem(KEY_LAST_DATE, today);
    localStorage.setItem(KEY_DAILY, "0");
  }
}

// Parse HTML of missions
function parseMissions(html) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = html;
  return [...wrapper.querySelectorAll("li")];
}

// Save missions back
function saveMissions(list) {
  let wrapper = document.createElement("div");
  list.forEach(li => wrapper.appendChild(li));
  localStorage.setItem(KEY_MISSIONS, wrapper.innerHTML);
}

// Main loader
function loadMission() {
  const html = localStorage.getItem(KEY_MISSIONS) || "";

  const list = parseMissions(html);

  if (list.length === 0) {
    document.getElementById("missionTitle").innerText = "No Missions Yet";
    return;
  }

  const li = list[0];
  const title = li.querySelector(".mission-text")?.innerText || "Untitled";

  document.getElementById("missionTitle").innerText = title;

  const pts = Number(localStorage.getItem(KEY_COMPLETED)) || 0;
  document.getElementById("points").innerText = "Points: " + pts;
}

// XP handling for linked skill
function addSkillXP(skillName) {
  if (!skillName) return;

  let skillsHTML = localStorage.getItem(KEY_SKILLS) || "";
  const wrapper = document.createElement("div");
  wrapper.innerHTML = skillsHTML;

  const skills = wrapper.querySelectorAll(".skill");

  skills.forEach(skill => {
    const name = skill.querySelector("strong")?.textContent.trim();
    if (name === skillName.trim()) {
      let xp = parseInt(skill.dataset.xp) || 0;
      xp += 1;

      skill.dataset.xp = xp;
      skill.setAttribute("data-xp", xp);
      skill.querySelector(".xp-count").textContent = xp;
      skill.querySelector(".progress-bar").style.width = xp + "%";
    }
  });

  localStorage.setItem(KEY_SKILLS, wrapper.innerHTML);
}

// Add notification
function pushNotification(title, msg) {
  const arr = JSON.parse(localStorage.getItem(KEY_NOTIFS) || "[]");

  arr.unshift({
    title,
    msg,
    time: new Date().toLocaleString()
  });

  localStorage.setItem(KEY_NOTIFS, JSON.stringify(arr));
}

// Achievement unlock logic
function processAchievement(count) {
  let ach = JSON.parse(localStorage.getItem(KEY_ACH) || "[]");

  const id = "mission" + count;
  const item = ach.find(a => a.id == id);

  if (item && !item.unlocked) {
    item.unlocked = true;
    item.unlockedAt = new Date().toDateString();

    pushNotification("🏆 Achievement Unlocked", item.title);
  }

  localStorage.setItem(KEY_ACH, JSON.stringify(ach));
}

// Mark mission from widget
function markMission() {
  enforceDailyReset();

  // Load current missions
  const html = localStorage.getItem(KEY_MISSIONS) || "";
  const list = parseMissions(html);

  if (list.length === 0) return;

  let li = list[0];

  const deadline = li.dataset.deadline || "";
  const linkedSkill = li.dataset.skill || "";
  const isHardcore = li.dataset.hardcore === "true";

  let completed = Number(localStorage.getItem(KEY_COMPLETED)) || 0;
  let daily = Number(localStorage.getItem(KEY_DAILY)) || 0;

  const now = Date.now();

  // 1. DEADLINE MISSED → HARDCORE OR ZERO POINTS
  if (deadline) {
    const t = new Date(deadline).getTime();

    if (t < now) {
      // HARDCORE PUNISHMENT
      if (isHardcore) {
        pushNotification("🔥 Hardcore Failed", "You missed a Hardcore Mission.");

        // EXACT punishment logic from your app
        if (completed < 0) {
          completed -= 4;
        } else {
          completed = 0;
        }

        localStorage.setItem(KEY_COMPLETED, completed);
      } else {
        // Normal mission overdue = no gain
        pushNotification(
          "Mission Overdue",
          "Mission was overdue. No improvement points gained."
        );
      }

      // Remove mission
      list.shift();
      saveMissions(list);

      document.getElementById("missionTitle").innerText = "Completed!";
      document.getElementById("points").innerText = "Points: " + completed;
      return;
    }
  }

  // 2. DAILY LIMIT CHECK
  if (daily >= DAILY_LIMIT) {
    pushNotification(
      "Daily Limit Reached",
      "You cannot earn more improvement points today."
    );

    // Remove mission anyway (same as app)
    list.shift();
    saveMissions(list);
    return;
  }

  // 3. SUCCESSFUL NORMAL COMPLETION
  daily++;
  completed++;

  localStorage.setItem(KEY_DAILY, daily);
  localStorage.setItem(KEY_COMPLETED, completed);

  // Skill XP
  addSkillXP(linkedSkill);

  // Achievements
  processAchievement(completed);

  // Remove mission
  list.shift();
  saveMissions(list);

  // UI update
  document.getElementById("missionTitle").innerText = "Completed!";
  document.getElementById("points").innerText = "Points: " + completed;

  // Notification
  pushNotification("Mission Completed", "+1 Improvement Point");
}


// Auto-load
loadMission();
