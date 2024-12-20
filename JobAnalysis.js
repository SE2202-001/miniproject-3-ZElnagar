class Job {
    constructor(title, posted, type, level, skill, detail) {
        this.title = title;
        this.posted = posted;
        this.type = type;
        this.level = level;
        this.skill = skill;
        this.detail = detail;
    }

    getDetails() {
        return `
            Title: ${this.title}
            Type: ${this.type}
            Level: ${this.level}
            Skill: ${this.skill}
            Posted: ${this.posted}
            Detail: ${this.detail}
        `;
    }

    getFormattedPostedTime() {
        const [value, unit] = this.posted.split(" ");
        const timeUnits = { minute: 1, hour: 60, day: 1440, week: 10080 };
        return parseInt(value) * timeUnits[unit.replace(/s$/, "")];
    }
}

let jobs = [];
let filteredJobs = [];

// Load JSON Data
document.getElementById("fileUpload").addEventListener("change", function (e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function (event) {
        try {
            const rawJobs = JSON.parse(event.target.result);
            jobs = rawJobs.map(
                (job) =>
                    new Job(
                        job.Title,
                        job.Posted,
                        job.Type,
                        job.Level,
                        job.Skill,
                        job.Detail
                    )
            );
            filteredJobs = [...jobs];
            renderJobs(filteredJobs);
            populateFilters();
        } catch (error) {
            alert("Error parsing JSON file. Please check the format.");
        }
    };
    reader.readAsText(file);
});

// Render Jobs
function renderJobs(jobList) {
    const jobListElement = document.getElementById("jobList");
    jobListElement.innerHTML = "";
    if (jobList.length === 0) {
        jobListElement.innerHTML = "<li>No jobs available.</li>";
        return;
    }
    jobList.forEach((job) => {
        const jobItem = document.createElement("li");
        jobItem.className = "job-item";
        jobItem.textContent = `${job.title} - ${job.type} (${job.level})`;
        jobItem.addEventListener("click", () => showJobDetails(job));
        jobListElement.appendChild(jobItem);
    });
}

// Updated `showJobDetails` function to include the job link
function showJobDetails(job) {
    const modal = document.getElementById("jobModal");
    modal.style.display = "block";

    document.getElementById("modalTitle").textContent = job.title;
    document.getElementById("modalType").textContent = job.type;
    document.getElementById("modalLevel").textContent = job.level;
    document.getElementById("modalSkill").textContent = job.skill;
    document.getElementById("modalPosted").textContent = job.posted;
    document.getElementById("modalDetail").textContent = job.detail;

    // Create a clickable job link
    const jobLinkElement = document.createElement("a");
    jobLinkElement.href = job.link;
    jobLinkElement.textContent = "Job Page Link";
    jobLinkElement.target = "_blank";
    jobLinkElement.style.display = "block"; // Ensure it appears as a block for proper styling
    document.getElementById("modalJobLink").innerHTML = ""; // Clear any previous content
    document.getElementById("modalJobLink").appendChild(jobLinkElement);
}

// Close modal functionality
document.getElementById("closeModal").addEventListener("click", () => {
    document.getElementById("jobModal").style.display = "none";
});


window.addEventListener("click", (event) => {
    const modal = document.getElementById("jobModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

// Populate Filters
function populateFilters() {
    const levels = new Set(jobs.map((job) => job.level));
    const types = new Set(jobs.map((job) => job.type));
    const skills = new Set(jobs.map((job) => job.skill));

    populateDropdown("filterLevel", levels);
    populateDropdown("filterType", types);
    populateDropdown("filterSkill", skills);
}

function populateDropdown(dropdownId, options) {
    const dropdown = document.getElementById(dropdownId);
    dropdown.innerHTML = `<option value="All">All</option>`;
    Array.from(options)
        .sort((a, b) => a.localeCompare(b))
        .forEach((option) => {
            const opt = document.createElement("option");
            opt.value = option;
            opt.textContent = option;
            dropdown.appendChild(opt);
        });
}

// Filter
document.getElementById("filterButton").addEventListener("click", () => {
    const level = document.getElementById("filterLevel").value;
    const type = document.getElementById("filterType").value;
    const skill = document.getElementById("filterSkill").value;

    filteredJobs = jobs.filter((job) => {
        return (
            (level === "All" || job.level === level) &&
            (type === "All" || job.type === type) &&
            (skill === "All" || job.skill === skill)
        );
    });

    renderJobs(filteredJobs);
});

// Sort
document.getElementById("sortButton").addEventListener("click", () => {
    const sortOption = document.getElementById("sortOptions").value;

    filteredJobs.sort((a, b) => {
        if (sortOption === "title") {
            return a.title.localeCompare(b.title);
        } else if (sortOption === "time") {
            return a.getFormattedPostedTime() - b.getFormattedPostedTime();
        }
    });

    renderJobs(filteredJobs);
});

// Reset
document.getElementById("resetButton").addEventListener("click", () => {
    document.getElementById("filterLevel").value = "All";
    document.getElementById("filterType").value = "All";
    document.getElementById("filterSkill").value = "All";
    filteredJobs = [...jobs];
    renderJobs(filteredJobs);
});
