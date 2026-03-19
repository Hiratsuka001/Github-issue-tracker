const API_URL = "https://phi-lab-server.vercel.app/api/v1/lab/issues";

let allIssues = [];
let currentFilter = "all";

const cardsContainer = document.getElementById("cardsContainer");
const numofissues = document.getElementById("issuesCount");

const filterAllBtn = document.getElementById("filterAll");
const filterOpenBtn = document.getElementById("filterOpen");
const filterClosedBtn = document.getElementById("filterClosed");

loadIssues();

filterAllBtn.onclick = function () {
  currentFilter = "all";
  setActiveButton();
  showCards();
};

filterOpenBtn.onclick = function () {
  currentFilter = "open";
  setActiveButton();
  showCards();
};

filterClosedBtn.onclick = function () {
  currentFilter = "closed";
  setActiveButton();
  showCards();
};

cardsContainer.onclick = function (e) {
  const card = e.target.closest(".issue-card");
  if (!card) return;

  const id = card.getAttribute("data-id");
  if (!id) return;

  openIssueModalFromAPI(id);
};

function loadIssues() {
  fetch(API_URL)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      if (Array.isArray(data)) allIssues = data;
      else if (Array.isArray(data.data)) allIssues = data.data;
      else if (Array.isArray(data.issues)) allIssues = data.issues;
      else allIssues = [];

      setActiveButton();
      showCards();
    });
}

function showCards() {
  const list = getFilteredIssues();

  numofissues.innerText = list.length;

  if (list.length === 0) {
    cardsContainer.innerHTML =
      '<div class="col-span-full"><div class="alert">No issues found.</div></div>';
    return;
  }

  let html = "";
  for (let i = 0; i < list.length; i++) {
    html += createCard(list[i]);
  }
  cardsContainer.innerHTML = html;
}

function getFilteredIssues() {
  if (currentFilter === "all") return allIssues;

  const filtered = [];
  for (let i = 0; i < allIssues.length; i++) {
    const issue = allIssues[i];
    const status = getStatus(issue);
    if (status === currentFilter) filtered.push(issue);
  }
  return filtered;
}

function setActiveButton() {
  filterAllBtn.className = "btn join-item btn-outline sm:w-auto";
  filterOpenBtn.className = "btn join-item btn-outline sm:w-auto";
  filterClosedBtn.className = "btn join-item btn-outline sm:w-auto";

  if (currentFilter === "all") {
    filterAllBtn.className = "btn join-item btn-primary sm:w-auto";
  } else if (currentFilter === "open") {
    filterOpenBtn.className = "btn join-item btn-primary sm:w-auto";
  } else {
    filterClosedBtn.className = "btn join-item btn-primary sm:w-auto";
  }
}

function createCard(issue) {
  const issueId = issue.id || issue._id || issue.issueId || "";

  const title = issue.title || "No title";
  let description = issue.description || issue.body || "No description";
  const status = getStatus(issue);
  const author = issue.author || "unknown";
  const priority = issue.priority || "LOW";
  const label = issue.label || (issue.labels && issue.labels[0]) || "GENERAL";
  const createdAt =
    issue.createdAt || issue.created_at || issue.created || issue.date || "";

  if (description.length > 90) description = description.slice(0, 90) + "...";

  let topBorderClass = "border-t-4 border-[#068606]";
  let statusIcon = "assets/Open_Status.png";

  if (status === "closed") {
    topBorderClass = "border-t-4 border-[#8e06ce]";
    statusIcon = "assets/Closed_Status.png";
  }

  let priorityBadgeClass = "badge badge-ghost";
  const p = String(priority).toLowerCase();
  if (p === "high") priorityBadgeClass = "badge badge-error badge-outline";
  if (p === "medium") priorityBadgeClass = "badge badge-warning badge-outline";
  if (p === "low") priorityBadgeClass = "badge badge-neutral badge-outline";

  let labelBadgeClass = "badge badge-outline";
  const l = String(label).toLowerCase();
  if (l.includes("bug")) labelBadgeClass = "badge badge-error badge-outline";
  if (l.includes("help")) labelBadgeClass = "badge badge-warning badge-outline";
  if (l.includes("enhance"))
    labelBadgeClass = "badge badge-success badge-outline";

  const createdText = formatDate(createdAt);

  const html =
    '<div data-id="' +
    issueId +
    '" class="issue-card card bg-base-100 shadow-sm border border-base-300 rounded-xl ' +
    topBorderClass +
    ' cursor-pointer hover:shadow-md transition">' +
    '<div class="card-body gap-3">' +
    '<div class="flex items-center justify-between">' +
    '<div class="w-9 h-9 rounded-full bg-base-200 flex items-center justify-center">' +
    '<img src="' +
    statusIcon +
    '" alt="' +
    status +
    '" class="w-5 h-5 object-contain" />' +
    "</div>" +
    '<span class="' +
    priorityBadgeClass +
    ' px-4 py-3 font-bold">' +
    String(priority).toUpperCase() +
    "</span>" +
    "</div>" +
    '<h3 class="text-lg font-bold leading-snug">' +
    title +
    "</h3>" +
    '<p class="text-sm text-base-content/60">' +
    description +
    "</p>" +
    '<div class="flex flex-wrap gap-2 pt-1">' +
    '<span class="' +
    labelBadgeClass +
    ' font-semibold">' +
    String(label).toUpperCase() +
    "</span>" +
    "</div>" +
    '<div class="divider my-1"></div>' +
    '<div class="text-sm text-base-content/60 space-y-1">' +
    "<p># by " +
    author +
    "</p>" +
    "<p>" +
    createdText +
    "</p>" +
    "</div>" +
    "</div>" +
    "</div>";

  return html;
}

function formatDate(dateValue) {
  if (!dateValue) return "";
  if (String(dateValue).includes("/")) return String(dateValue);

  const d = new Date(dateValue);
  if (isNaN(d.getTime())) return String(dateValue);

  const mm = d.getMonth() + 1;
  const dd = d.getDate();
  const yyyy = d.getFullYear();
  return mm + "/" + dd + "/" + yyyy;
}

function getStatus(issue) {
  let s = issue.status || issue.state || "";
  s = String(s).toLowerCase();

  if (s === "open" || s === "closed") return s;
  if (issue.isOpen === true) return "open";
  if (issue.isOpen === false) return "closed";

  return "open";
}
