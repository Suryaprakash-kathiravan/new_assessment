document.addEventListener("DOMContentLoaded", () => {
    const openFormBtn = document.getElementById("openForm");
    const cancelFormBtn = document.getElementById("cancelForm");
    const postFormOverlay = document.getElementById("postFormOverlay");
    const postForm = document.getElementById("postForm");
    const postsContainer = document.getElementById("postsContainer");

    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    let editingPostId = null;

    openFormBtn.addEventListener("click", () => {
        editingPostId = null;
        postForm.reset();
        postFormOverlay.classList.remove("hidden");
    });

    cancelFormBtn.addEventListener("click", () => {
        postFormOverlay.classList.add("hidden");
    });

    postForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const title = document.getElementById("title").value.trim();
        const content = document.getElementById("content").value.trim();

        if (title && content) {
            if (editingPostId !== null) {
                posts[editingPostId] = { ...posts[editingPostId], title, content };
                editingPostId = null;
            } else {
                posts.push({ title, content, views: 0 });
            }

            postForm.reset();
            postFormOverlay.classList.add("hidden");
            renderPosts();
        }
    });

    window.editPost = (index) => {
        editingPostId = index;
        document.getElementById("title").value = posts[index].title;
        document.getElementById("content").value = posts[index].content;
        postFormOverlay.classList.remove("hidden");
    };

    window.deletePost = (index) => {
        if (confirm("Are you sure you want to delete this post?")) {
            posts.splice(index, 1);
            renderPosts();
        }
    };

    window.viewPost = (index) => {
        if (!posts[index].views) {
            posts[index].views = 0;
        }
        posts[index].views++;
        editPost(index);
        renderPosts();
    };

    function renderPosts() {
        postsContainer.innerHTML = "";
        posts.forEach((post, index) => {
            const postElement = document.createElement("div");
            postElement.classList.add("bg-white", "p-10", "rounded-lg", "shadow-md", "relative",'hover:bg-blue-100',"truncate","px-20");
            const truncatedContent = post.content.length > 20 ? post.content.substring(0, 20) + "..." : post.content;
            postElement.innerHTML = `
                <h3 class="text-xl font-bold">${post.title}</h3>
                <p class="mt-2">${truncatedContent}</p>
                <p class="mt-2 text-sm text-gray-500">👁️: ${post.views || 0}</p>
                <div class="mt-4 flex space-x-2">
                    <button onclick="editPost(${index})" class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">Edit</button>
                    <button onclick="deletePost(${index})" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Delete</button>
                    <button onclick="viewPost(${index})" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">View</button>
                </div>
            `;
            postsContainer.appendChild(postElement);
        });

        localStorage.setItem("posts", JSON.stringify(posts));
    }

    renderPosts();
});
