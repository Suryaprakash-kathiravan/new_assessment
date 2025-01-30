document.addEventListener("DOMContentLoaded", () => {
    const openFormBtn = document.getElementById("openForm");
    const cancelFormBtn = document.getElementById("cancelForm");
    const postFormContainer = document.getElementById("postFormContainer");
    const postForm = document.getElementById("postForm");
    const postsContainer = document.getElementById("postsContainer");

    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    let editingPostId = null;

    openFormBtn.addEventListener("click", () => {
        editingPostId = null;
        postForm.reset();
        postFormContainer.classList.remove("hidden");
    });

    cancelFormBtn.addEventListener("click", () => {
        postFormContainer.classList.add("hidden");
    });

    function renderPosts() {
        postsContainer.innerHTML = "";
        posts.forEach((post, index) => {
            const postElement = document.createElement("div");
            postElement.classList.add("bg-white", "p-4", "rounded-lg", "shadow-md", "relative");
            postElement.innerHTML = `
                <h3 class="text-xl font-bold">${post.title}</h3>
                <p class="mt-2">${post.content}</p>
                <p class="mt-2 text-sm text-gray-500">Views: ${post.views || 0}</p>
                <div class="mt-4 flex space-x-2">
                    <button onclick="editPost(${index})" class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">Edit</button>
                    <button onclick="deletePost(${index})" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Delete</button>
                </div>
            `;
            postsContainer.appendChild(postElement);
        });

        localStorage.setItem("posts", JSON.stringify(posts));
    }

    postForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const title = document.getElementById("title").value.trim();
        const content = document.getElementById("content").value.trim();

        if (title && content) {
            if (editingPostId !== null) {
                // Update existing post
                posts[editingPostId] = { ...posts[editingPostId], title, content };
                editingPostId = null;
            } else {
                // Add new post with initial view count of 0
                posts.push({ title, content, views: 0 });
            }

            postForm.reset();
            postFormContainer.classList.add("hidden");
            renderPosts();
        }
    });

    window.editPost = (index) => {
        editingPostId = index;
        document.getElementById("title").value = posts[index].title;
        document.getElementById("content").value = posts[index].content;
        postFormContainer.classList.remove("hidden");
    };

    window.deletePost = (index) => {
        if (confirm("Are you sure you want to delete this post?")) {
            posts.splice(index, 1);
            renderPosts();
        }
    };

    // Function to increment view count
    window.viewPost = (index) => {
        if (!posts[index].views) {
            posts[index].views = 0;
        }
        posts[index].views++;
        renderPosts();
    };

    // Modify the post rendering to include a "View" button
    function renderPosts() {
        postsContainer.innerHTML = "";
        posts.forEach((post, index) => {
            const postElement = document.createElement("div");
            postElement.classList.add("bg-white", "p-4", "rounded-lg", "shadow-md", "relative");
            postElement.innerHTML = `
                <h3 class="text-xl font-bold">${post.title}</h3>
                <p class="mt-2">${post.content}</p>
                <p class="mt-2 text-sm text-gray-500">Views: ${post.views || 0}</p>
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