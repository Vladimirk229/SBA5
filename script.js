const form = document.getElementById("post-form");
const inputTitle = document.getElementById("title");
const inputContent = document.getElementById("content");
const postsList = document.getElementById("posts-container");

let currentEditId = null;

let allPosts = JSON.parse(localStorage.getItem("posts")) || [];
showPosts();

//===========================================

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const titleText = inputTitle.value;
    const contentText = inputContent.value;

    if (currentEditId) {
        for (let i = 0; i < allPosts.length; i++) {
            if (allPosts[i].id === currentEditId) {
                allPosts[i].title = titleText;
                allPosts[i].content = contentText;
                break;
            }
        }
        currentEditId = null;
    } else {
        const newEntry = {
            id: Date.now(),
            title: titleText,
            content: contentText,
            timestamp: new Date().toLocaleString(),
        };
        allPosts.push(newEntry);
    }

    localStorage.setItem("posts", JSON.stringify(allPosts));
    form.reset();
    showPosts();
});

//===========================================

function showPosts() {
    postsList.innerHTML = "";

    if (allPosts.length === 0) {
        postsList.innerHTML = "<p>No posts yet.</p>";
        return;
    }

    allPosts.forEach(function (item) {
        const wrapper = document.createElement("div");
        wrapper.classList.add("post");

        const postTitle = document.createElement("h3");
        postTitle.textContent = item.title;

        const postContent = document.createElement("p");
        postContent.textContent = item.content;

        const postTime = document.createElement("small");
        postTime.textContent = "Posted on: " + item.timestamp;

        const btnEdit = document.createElement("button");
        btnEdit.textContent = "Edit";
        btnEdit.classList.add("edit");
        btnEdit.addEventListener("click", function () {
            editPost(item.id);
        });

        const btnDelete = document.createElement("button");
        btnDelete.textContent = "Delete";
        btnDelete.classList.add("delete");
        btnDelete.addEventListener("click", function () {
            removePost(item.id);
        });

        wrapper.appendChild(postTitle);
        wrapper.appendChild(postContent);
        wrapper.appendChild(postTime);
        wrapper.appendChild(btnEdit);
        wrapper.appendChild(btnDelete);

        postsList.appendChild(wrapper);
    });
}

//===========================================

function editPost(id) {
    const target = allPosts.find(function (el) {
        return el.id === id;
    });
    if (!target) return;

    inputTitle.value = target.title;
    inputContent.value = target.content;
    currentEditId = id;
}

//===========================================

function removePost(id) {
    allPosts = allPosts.filter(function (el) {
        return el.id !== id;
    });
    localStorage.setItem("posts", JSON.stringify(allPosts));
    showPosts();
}
