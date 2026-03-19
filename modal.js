const singleIssue = "https://phi-lab-server.vercel.app/api/v1/lab/issue/";

const issueModal = document.getElementById("issueModal");
const modalTitle = document.getElementById("modalTitle");
const modalStatusBadge = document.getElementById("modalStatusBadge");
const modalAuthor = document.getElementById("modalAuthor");
const modalCreatedAt = document.getElementById("modalCreatedAt");
const modalLabels = document.getElementById("modalLabels");
const modalDescription = document.getElementById("modalDescription");
const modalAssignee = document.getElementById("modalAssignee");
const modalPriorityBadge = document.getElementById("modalPriorityBadge");

function openIssueModalFromAPI(id) {
  issueModal.showModal();

  fetch(singleIssue + id)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      let issue = data;
      if (data && data.data) issue = data.data;
      if (data && data.issue) issue = data.issue;

      fillModal(issue);
    });
}

function fillModal(issue) {
  const title = issue.title || "No title";
  const description = issue.description || issue.body || "No description";
  const status = getStatus(issue);
  const author = issue.author || issue.user || "unknown";
  const priority = issue.priority || "LOW";
  const createdAt =
    issue.createdAt || issue.created_at || issue.created || issue.date || "";

  const assignee = issue.assignee || issue.assignedTo || "N/A";

  modalTitle.innerText = title;
  modalAuthor.innerText = author;
  modalCreatedAt.innerText = formatDate(createdAt);
  modalDescription.innerText = description;
  modalAssignee.innerText = assignee;

  if (status === "open") {
    modalStatusBadge.className = "badge badge-success";
    modalStatusBadge.innerText = "Opened";
  } else {
    modalStatusBadge.className = "badge badge-secondary";
    modalStatusBadge.innerText = "Closed";
  }

  const p = String(priority).toLowerCase();
  if (p === "high") modalPriorityBadge.className = "badge badge-error";
  else if (p === "medium") modalPriorityBadge.className = "badge badge-warning";
  else modalPriorityBadge.className = "badge badge-neutral";
  modalPriorityBadge.innerText = String(priority).toUpperCase();

  modalLabels.innerHTML = "";
  let labelsArr = [];

  if (Array.isArray(issue.labels)) labelsArr = issue.labels;
  else if (issue.label) labelsArr = [issue.label];

  for (let i = 0; i < labelsArr.length; i++) {
    modalLabels.innerHTML +=
      '<span class="badge badge-outline">' +
      String(labelsArr[i]).toUpperCase() +
      "</span>";
  }
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
