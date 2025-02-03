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
        posts[index].views++;
        renderPosts();
        showPostContent(index);
    };

    function showPostContent(index) {
        const viewOverlay = document.createElement("div");
        viewOverlay.id = "viewOverlay";
        viewOverlay.classList.add("fixed", "inset-0", "bg-gray-900", "bg-opacity-75", "flex", "items-center", "justify-center");
        const viewContainer = document.createElement("div");
        viewContainer.classList.add("bg-white", "p-6", "rounded-lg", "shadow-md", "w-10", "md:w-1/2", "lg:w-1/3");
        viewContainer.innerHTML = `
            <h2 class="text-2xl font-bold mb-4">${posts[index].title}</h2>
            <textarea class="w-full p-2 border rounded mb-4" rows="10" readonly>${posts[index].content}</textarea>
            <button id="closeView" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition ease-in-out duration-300">Close</button>
        `;
        viewOverlay.appendChild(viewContainer);
        document.body.appendChild(viewOverlay);

        document.getElementById("closeView").addEventListener("click", () => {
            document.body.removeChild(viewOverlay);
        });
    }

    const searchInput = document.getElementById('searchPost');
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        renderPosts(query);
    });

    function renderPosts(query = '') {
        postsContainer.innerHTML = "";
        posts.forEach((post, index) => {
            const titleLower = post.title.toLowerCase();
            const contentLower = post.content.toLowerCase();
            if (titleLower.includes(query) || contentLower.includes(query)) {
                const postElement = document.createElement("div");
                postElement.classList.add("bg-white", "p-10", "rounded-lg", "shadow-md", "relative", "hover:bg-blue-100", "truncate", "postElement");
                const truncatedContent = post.content.length > 20 ? post.content.substring(0, 20) + "..." : post.content;
                const truncatedTitle = post.title.length > 20 ? post.title.substring(0, 20) + "..." : post.title;
                postElement.innerHTML = `
                    <h3 onclick="viewPost(${index})" class="text-xl font-bold">${truncatedTitle}</h3>
                    <p class="mt-2">${truncatedContent}</p>
                    <p class="mt-2 text-sm text-gray-500">👁️: ${post.views || 0}</p>
                    <div class="mt-4 flex space-x-2">
                        <button onclick="editPost(${index})" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition ease-in-out duration-300">Edit</button>
                        <button onclick="deletePost(${index})" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition ease-in-out duration-300">Delete</button>
                        
                    </div>
                `;
                postsContainer.appendChild(postElement);
            }
        });

        localStorage.setItem("posts", JSON.stringify(posts));
    }

    renderPosts();
});
